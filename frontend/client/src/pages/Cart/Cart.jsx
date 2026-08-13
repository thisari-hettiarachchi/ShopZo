import { useState, useEffect } from "react"; 
import { Trash2, ShoppingBag, ArrowRight, XCircle } from "lucide-react";
import { toast } from "react-toastify";
import {
  fetchCart,
  updateCartItemApi,
  removeCartItemApi,
  clearCartApi,
} from "../../api/cartApi";
import { useNavigate } from "react-router-dom";
import { formatVariantLabel } from "../../utils/productVariants";

export default function Cart() {
  const token = localStorage.getItem("token");
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  // Dispatch custom event to update navbar
  const dispatchCartUpdate = () => {
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const navigate = useNavigate();
  
  // Fetch cart from backend
  useEffect(() => {
    const getCart = async () => {
      setLoading(true);
      try {
        const cart = await fetchCart(token);

        // Normalize cart items (use qty from backend)
        const normalizedItems = (cart.items || []).map((item) => ({
          ...item,
          quantity: item.qty && item.qty > 0 ? item.qty : 1,
        }));

        setCartItems(normalizedItems);
        
        // Update localStorage for navbar sync
        localStorage.setItem('cart', JSON.stringify(normalizedItems));
        dispatchCartUpdate();
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      }
      setLoading(false);
    };
    getCart();
  }, [token]);

  // Increase quantity
  const increaseQty = async (id) => {
    const item = cartItems.find((i) => i._id === id);
    if (!item) return;

    try {
      const updatedCart = await updateCartItemApi(item._id, item.quantity + 1, token);
      const normalizedItems = (updatedCart.items || []).map((i) => ({
        ...i,
        quantity: i.qty && i.qty > 0 ? i.qty : 1,
      }));
      
      setCartItems(normalizedItems);
      localStorage.setItem('cart', JSON.stringify(normalizedItems));
      dispatchCartUpdate();
    } catch (err) {
      console.error("Failed to increase quantity:", err);
    }
  };

  // Decrease quantity
  const decreaseQty = async (id) => {
    const item = cartItems.find((i) => i._id === id);
    if (!item || item.quantity <= 1) return;

    try {
      const updatedCart = await updateCartItemApi(item._id, item.quantity - 1, token);
      const normalizedItems = (updatedCart.items || []).map((i) => ({
        ...i,
        quantity: i.qty && i.qty > 0 ? i.qty : 1,
      }));
      
      setCartItems(normalizedItems);
      localStorage.setItem('cart', JSON.stringify(normalizedItems));
      dispatchCartUpdate();
    } catch (err) {
      console.error("Failed to decrease quantity:", err);
    }
  };

  // Remove item
  const removeItem = async (itemId) => {
    try {
      const updatedCart = await removeCartItemApi(itemId, token);
      const normalizedItems = (updatedCart.items || []).map((i) => ({
        ...i,
        quantity: i.qty && i.qty > 0 ? i.qty : 1,
      }));
      
      setCartItems(normalizedItems);
      localStorage.setItem('cart', JSON.stringify(normalizedItems));
      dispatchCartUpdate();
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  // Remove all items
  const handleRemoveAll = async () => {
    if (cartItems.length === 0) return;
    const confirmed = window.confirm("Remove all items from your cart?");
    if (!confirmed) return;

    setClearing(true);
    try {
      await clearCartApi(token);
      setCartItems([]);
      localStorage.setItem('cart', JSON.stringify([]));
      dispatchCartUpdate();
      toast.success("Cart cleared");
    } catch (err) {
      console.error("Failed to clear cart:", err);
      toast.error("Failed to clear cart");
    } finally {
      setClearing(false);
    }
  };

  // Correct subtotal calculation
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  // Group cart items by Vendor
  const groupedCart = cartItems.reduce((acc, item) => {
    if (!item.product) return acc;
    
    // Fallback if vendor is missing or unpopulated
    const vendorId = item.product.vendor?._id || "unknown";
    const vendorName = item.product.vendor?.name || "Official Shop";

    if (!acc[vendorId]) {
      acc[vendorId] = {
        name: vendorName,
        items: []
      };
    }
    acc[vendorId].items.push(item);
    return acc;
  }, {});

  const itemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-main)]">
        <p className="text-[var(--text-muted)]">Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] px-4 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-[0_12px_28px_-18px_var(--shadow)]">
              <ShoppingBag className="w-6 h-6 text-[var(--color-primary)]" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: "'Sora', sans-serif" }}>
                Your Cart
              </h1>
              <p className="text-sm text-[var(--text-muted)]">
                {itemCount > 0 ? `${itemCount} item${itemCount > 1 ? "s" : ""} in your cart` : "No items yet"}
              </p>
            </div>
          </div>

          {cartItems.length > 0 && (
            <button
              onClick={handleRemoveAll}
              disabled={clearing}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--text-secondary)] transition hover:border-red-500 hover:text-red-500 disabled:opacity-60"
            >
              <XCircle className="w-4 h-4" />
              {clearing ? "Removing..." : "Remove All"}
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] py-20 text-center shadow-[0_24px_60px_-36px_var(--shadow)]">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--bg-muted)]">
              <ShoppingBag className="w-8 h-8 text-[var(--text-muted)]" />
            </div>
            <p className="text-[var(--text-secondary)]">Your cart is empty.</p>
            <button
              onClick={() => navigate("/products")}
              className="mt-2 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {Object.entries(groupedCart).map(([vendorId, vendor]) => (
                <div
                  key={vendorId}
                  className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-[0_18px_40px_-30px_var(--shadow)]"
                >
                  {/* Vendor Header */}
                  <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--bg-muted)] px-5 py-3">
                    <input type="checkbox" className="w-4 h-4 rounded accent-[var(--color-primary)] cursor-pointer" defaultChecked />
                    <ShoppingBag className="w-5 h-5 text-[var(--color-primary)]" />
                    <span className="text-sm font-bold uppercase tracking-wide text-[var(--text-primary)]">
                      {vendor.name}
                    </span>
                  </div>

                  {/* Vendor Items */}
                  <div className="p-5 space-y-4">
                    {vendor.items.map((item) => (
                      <div
                        key={item._id}
                        className="flex gap-4 border-b border-[var(--border)] pb-4 last:border-0 last:pb-0"
                      >
                        <img
                          src={item.product.images?.[0] || item.product.image || "/placeholder.png"} 
                          alt={item.product.name || "Product"}
                          className="w-24 h-24 rounded-lg border border-[var(--border)] bg-[var(--bg-muted)] object-contain"
                        />

                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-semibold text-[var(--text-primary)] leading-tight">
                              {item.product.name}
                            </h3>
                            {formatVariantLabel(item) && (
                              <div className="mt-1 flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                                {item.selectedColor?.hex && (
                                  <span
                                    className="inline-block h-3.5 w-3.5 rounded-full border border-[var(--border)]"
                                    style={{ backgroundColor: item.selectedColor.hex }}
                                    title={item.selectedColor.name}
                                  />
                                )}
                                <span>{formatVariantLabel(item)}</span>
                              </div>
                            )}
                            <p className="mt-1 line-clamp-1 text-xs text-[var(--text-muted)]">{item.product.description}</p>
                          </div>

                          <div className="flex items-end justify-between mt-3">
                            <p className="font-bold text-lg text-[var(--color-primary)]">
                              LKR {item.price}
                            </p>

                            {/* Actions */}
                            <div className="flex items-center gap-4">
                              {/* Remove */}
                              <button
                                onClick={() => removeItem(item._id)}
                                className="text-[var(--text-muted)] transition hover:text-red-500"
                                title="Remove Item"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>

                              {/* Quantity */}
                              <div className="flex items-center rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]">
                                <button
                                  onClick={() => decreaseQty(item._id)}
                                  className="p-1 px-3 tracking-wider text-[var(--text-secondary)] transition hover:bg-[var(--bg-muted)] hover:text-[var(--color-primary)]"
                                >
                                  −
                                </button>
                                <span className="w-10 text-center font-mono text-sm font-medium text-[var(--text-primary)]">
                                  {item.quantity || 1}
                                </span>
                                <button
                                  onClick={() => increaseQty(item._id)}
                                  className="p-1 px-3 tracking-wider text-[var(--text-secondary)] transition hover:bg-[var(--bg-muted)] hover:text-[var(--color-primary)]"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="h-fit space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[0_18px_40px_-30px_var(--shadow)]">
              <h2 className="text-xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: "'Sora', sans-serif" }}>
                Order Summary
              </h2>

              <div className="flex justify-between text-sm text-[var(--text-secondary)]">
                <span>Subtotal</span>
                <span>LKR {subtotal}</span>
              </div>

              <div className="flex justify-between text-sm text-[var(--text-secondary)]">
                <span>Delivery</span>
                <span>Free</span>
              </div>

              <hr className="border-[var(--border)]" />

              <div className="flex justify-between text-lg font-bold text-[var(--text-primary)]">
                <span>Total</span>
                <span className="text-[var(--color-primary)]">
                  LKR {subtotal}
                </span>
              </div>

              <button 
                onClick={() => navigate(`/checkout`)}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-medium bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] transition hover:opacity-90">
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
