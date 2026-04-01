import { useState, useEffect } from "react"; 
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import {
  fetchCart,
  updateCartItemApi,
  removeCartItemApi,
} from "../api/cartApi";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const token = localStorage.getItem("token");
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <p className="text-center py-10">Loading your cart...</p>;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] px-4 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag className="w-7 h-7 text-[var(--color-primary)]" />
          <h1 className="text-3xl font-bold">Your Cart</h1>
        </div>

        {cartItems.length === 0 ? (
          <p className="text-center text-[var(--text-muted)]">
            Your cart is empty.
          </p>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {Object.entries(groupedCart).map(([vendorId, vendor]) => (
                <div key={vendorId} className="bg-[var(--bg-card)] rounded-2xl shadow overflow-hidden">
                  {/* Vendor Header */}
                  <div className="bg-gray-50 px-5 py-3 border-b flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 rounded text-[var(--color-primary)] cursor-pointer" defaultChecked />
                    <ShoppingBag className="w-5 h-5 text-[var(--color-primary)]" />
                    <span className="font-bold text-gray-800 uppercase tracking-wide text-sm">
                      {vendor.name}
                    </span>
                  </div>

                  {/* Vendor Items */}
                  <div className="p-5 space-y-4">
                    {vendor.items.map((item) => (
                      <div
                        key={item._id}
                        className="flex gap-4 pb-4 border-b last:pb-0 last:border-0"
                      >
                        <img
                          src={item.product.images?.[0] || item.product.image || "/placeholder.png"} 
                          alt={item.product.name || "Product"}
                          className="w-24 h-24 object-contain rounded-lg bg-[var(--bg-muted)] border border-gray-100"
                        />

                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-semibold text-[var(--text-primary)] leading-tight">
                              {item.product.name}
                            </h3>
                            <p className="text-xs text-gray-400 mt-1 line-clamp-1">{item.product.description}</p>
                          </div>

                          <div className="flex items-end justify-between mt-3">
                            <p className="font-bold text-lg text-[var(--color-primary)]">
                              Rs. {item.price}
                            </p>

                            {/* Actions */}
                            <div className="flex items-center gap-4">
                              {/* Remove */}
                              <button
                                onClick={() => removeItem(item._id)}
                                className="text-gray-400 hover:text-red-500 transition tooltip"
                                title="Remove Item"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>

                              {/* Quantity */}
                              <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                                <button
                                  onClick={() => decreaseQty(item._id)}
                                  className="p-1 px-3 hover:bg-[var(--bg-muted)] text-gray-600 transition tracking-wider"
                                >
                                  −
                                </button>
                                <span className="w-10 text-center font-medium font-mono text-sm">
                                  {item.quantity || 1}
                                </span>
                                <button
                                  onClick={() => increaseQty(item._id)}
                                  className="p-1 px-3 hover:bg-[var(--bg-muted)] text-gray-600 transition tracking-wider"
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
            <div className="p-6 rounded-2xl bg-[var(--bg-card)] shadow space-y-4 h-fit">
              <h2 className="text-xl font-semibold">Order Summary</h2>

              <div className="flex justify-between text-sm text-[var(--text-secondary)]">
                <span>Subtotal</span>
                <span>Rs. {subtotal}</span>
              </div>

              <div className="flex justify-between text-sm text-[var(--text-secondary)]">
                <span>Delivery</span>
                <span>Free</span>
              </div>

              <hr className="border-[var(--border)]" />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-[var(--color-primary)]">
                  Rs. {subtotal}
                </span>
              </div>

              <button 
                onClick={() => navigate(`/checkout`)}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-medium bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] hover:opacity-90">
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
