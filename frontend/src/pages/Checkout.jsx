import React, { useState, useEffect } from "react";
import { ShoppingCart, MapPin, User, Tag, Edit } from "lucide-react";
import { fetchCart } from "../api/cartApi";
import { getAddresses } from "../services/addressService";

export default function CheckoutPage() {
  const token = localStorage.getItem("token");

  const [promoCode, setPromoCode] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [address, setAddress] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const loadCheckoutData = async () => {
      try {
        const cart = await fetchCart(token);
        const addressRes = await getAddresses();

        setCartItems(cart.items || []);
        setAddress(addressRes.data?.[0] || null);
      } catch (err) {
        console.error("Checkout load error:", err);
      }
    };

    loadCheckoutData();
  }, [token]);

  const itemsTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const deliveryFee = 286;
  const total = itemsTotal + deliveryFee;

  const handleApplyPromo = () => {
    if (promoCode.trim()) setIsPromoApplied(true);
  };

  const handleProceedToPay = () => {
    alert("Proceeding to payment...");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] py-8 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Checkout</h1>
          <p className="text-[var(--text-secondary)]">
            Review your order and complete payment
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* SHIPPING & BILLING */}
            <div className="bg-[var(--bg-card)] rounded-2xl shadow-lg p-6 border-2 border-[var(--border)]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
                    <MapPin className="text-white w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-semibold">Shipping & Billing</h2>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-[var(--color-primary)] hover:bg-[var(--bg-muted)]">
                  <Edit className="w-4 h-4" /> EDIT
                </button>
              </div>

              {address ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-[var(--color-primary)]" />
                    <p className="font-medium">{address.fullName}</p>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-[var(--color-primary)] mt-1" />
                    <div>
                      <p className="font-medium">{address.phone}</p>
                      <p className="text-[var(--text-secondary)]">
                        {address.addressLine}, {address.city}, {address.district}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-[var(--text-muted)]">No address found</p>
              )}
            </div>

            {/* PACKAGE */}
            <div className="bg-[var(--bg-card)] rounded-2xl shadow-lg p-6 border-2 border-[var(--border)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
                  <ShoppingCart className="text-white w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold">
                  Package 1 of {cartItems.length ? 1 : 0}
                </h2>
              </div>

              <div className="space-y-4 border-t-2 border-[var(--border)] pt-4">
                {cartItems.length === 0 ? (
                  <p className="text-center text-[var(--text-muted)]">
                    No items in cart
                  </p>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex gap-4 p-4 rounded-xl bg-[var(--bg-muted)] border border-[var(--border)]"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-20 rounded-lg object-contain bg-white"
                      />

                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)]">
                          {item.vendor?.name}
                        </p>

                        <span className="text-xl font-bold text-[var(--color-primary)]">
                          Rs. {item.price}
                        </span>

                        <p className="text-sm mt-1">Qty: {item.qty}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            {/* PROMO */}
            <div className="bg-[var(--bg-card)] rounded-2xl shadow-lg p-6 border-2 border-[var(--border)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
                  <Tag className="text-white w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold">Promotion</h2>
              </div>

              <div className="flex gap-3">
                <input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter promo code"
                  className="flex-1 px-4 py-3 rounded-lg bg-[var(--bg-main)] border-2 border-[var(--border)]"
                />
                <button
                  onClick={handleApplyPromo}
                  className="px-6 py-3 rounded-lg search-btn"
                >
                  APPLY
                </button>
              </div>

              {isPromoApplied && (
                <p className="mt-3 text-sm text-green-600">
                  ✓ Promo code applied successfully!
                </p>
              )}
            </div>

            {/* SUMMARY */}
            <div className="bg-[var(--bg-card)] rounded-2xl shadow-lg p-6 border-2 border-[var(--border)] sticky top-4">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Items Total</span>
                  <span>Rs. {itemsTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>Rs. {deliveryFee}</span>
                </div>

                <div className="border-t-2 border-[var(--border)] pt-4 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-[var(--color-primary)]">
                    Rs. {total}
                  </span>
                </div>
              </div>

              <button
                onClick={handleProceedToPay}
                className="w-full mt-6 py-4 rounded-xl search-btn text-lg"
              >
                Proceed to Pay
              </button>

              <p className="mt-4 text-xs text-center text-[var(--text-muted)]">
                🔒 Secure checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
