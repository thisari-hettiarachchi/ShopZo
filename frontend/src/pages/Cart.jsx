import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function Cart() {
  // TEMP demo data (replace with Context / Redux later)
  const [cartItems, setCartItems] = useState([
    {
      _id: "1",
      name: "Men Running Shoes",
      price: 8500,
      image: "https://via.placeholder.com/150",
      quantity: 1,
    },
    {
      _id: "2",
      name: "Women Sneakers",
      price: 9200,
      image: "https://via.placeholder.com/150",
      quantity: 2,
    },
  ]);

  const increaseQty = (id) => {
    setCartItems((items) =>
      items.map((item) =>
        item._id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCartItems((items) =>
      items.map((item) =>
        item._id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item._id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

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
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 p-4 rounded-2xl bg-[var(--bg-card)] shadow"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-contain rounded-lg bg-[var(--bg-muted)]"
                  />

                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-[var(--text-primary)]">
                      {item.name}
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
                        {item.quantity}
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

              <button className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-medium bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] hover:opacity-90">
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
