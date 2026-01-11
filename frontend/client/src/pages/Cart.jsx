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
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) =>
                item.product ? (  // <-- check if product exists
                  <div
                    key={item._id}
                    className="flex gap-4 p-4 rounded-2xl bg-[var(--bg-card)] shadow"
                  >
                    <img
                      src={item.product.image || "/placeholder.png"} // fallback image
                      alt={item.product.name || "Product"}
                      className="w-24 h-24 object-contain rounded-lg bg-[var(--bg-muted)]"
                    />

                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-[var(--text-primary)]">
                        {item.product.name}
                      </h3>

                      <p className="font-bold text-[var(--color-primary)]">
                        Rs. {item.price}
                      </p>

                      {/* Quantity */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => decreaseQty(item._id)}
                          className="p-2 rounded-lg border hover:bg-[var(--bg-muted)]"
                        >
                          <Minus className="w-4 h-4" />
                        </button>

                        <span className="min-w-[24px] text-center">
                          {item.quantity || 1}
                        </span>

                        <button
                          onClick={() => increaseQty(item._id)}
                          className="p-2 rounded-lg border hover:bg-[var(--bg-muted)]"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ) : null
              )}
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
