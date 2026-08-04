import React, { useState } from "react";
import { toast } from "react-toastify";
import { CreditCard, Truck, ShieldCheck, Loader2, ArrowLeft } from "lucide-react";
import { createCheckoutSession } from "../../services/checkoutService";
import { createOrder } from "../../services/orderService";
import { clearCartApi } from "../../api/cartApi";
import { useNavigate, useLocation } from "react-router-dom";

export default function ProceedToPay() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, address, deliveryFee = 286, couponCode = null, discountAmount = 0 } =
    location.state || {};

  const [method, setMethod] = useState("stripe");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  if (!cartItems || cartItems.length === 0 || !address) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] px-4">
        <div className="bg-[var(--bg-card)] border-2 border-[var(--border)] rounded-2xl p-10 text-center max-w-md">
          <h1 className="text-2xl font-bold mb-3">Let's get you back to checkout</h1>
          <p className="text-[var(--text-secondary)] mb-6">
            We need your cart and shipping address before you can pay. Please start from checkout.
          </p>
          <button
            onClick={() => navigate("/checkout")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-semibold"
          >
            <ArrowLeft size={18} /> Go to Checkout
          </button>
        </div>
      </div>
    );
  }

  const itemsTotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = Math.max(itemsTotal + deliveryFee - discountAmount, 0);

  const resolveVendorId = (item) => {
    const vendor = item.product?.vendor || item.vendor;
    if (!vendor) return null;
    return typeof vendor === "object" ? vendor._id : vendor;
  };

  const buildItems = () =>
    cartItems.map((item) => ({
      product: item.product?._id || item.product,
      vendor: resolveVendorId(item),
      name: item.product?.name,
      qty: item.qty || 1,
      price: item.price,
    }));

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      const items = buildItems();

      if (method === "stripe") {
        const session = await createCheckoutSession({
          items,
          shippingAddress: address,
          couponCode,
        });
        window.location.href = session.url;
        return;
      }

      // Cash on Delivery - creates the order immediately, no external redirect
      await createOrder(
        { items, shippingAddress: address, couponCode },
        localStorage.getItem("token")
      );

      try {
        await clearCartApi(localStorage.getItem("token"));
      } catch (err) {
        console.error("Failed to clear cart on server:", err);
      }

      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));

      navigate("/order/success", { state: { method: "cod" } });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] px-4 py-8">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
        {/* LEFT - PAYMENT METHODS */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-2xl font-semibold">Select Payment Method</h1>

          {/* STRIPE CARD PAYMENT */}
          <label
            className={`block bg-[var(--bg-card)] border-2 rounded-xl p-5 cursor-pointer transition ${
              method === "stripe" ? "border-[var(--color-primary)]" : "border-[var(--border)]"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                checked={method === "stripe"}
                onChange={() => setMethod("stripe")}
              />
              <CreditCard className="text-[var(--color-primary)]" />
              <span className="font-medium">Pay securely with Card (Stripe)</span>
            </div>
            {method === "stripe" && (
              <div className="mt-4 flex items-start gap-2 text-sm text-[var(--text-secondary)] pl-8">
                <ShieldCheck size={16} className="mt-0.5 shrink-0 text-green-600" />
                <p>
                  You'll be redirected to Stripe's secure checkout to enter your card details.
                  ShopZo never stores your card number.
                </p>
              </div>
            )}
          </label>

          {/* CASH ON DELIVERY */}
          <label
            className={`block bg-[var(--bg-card)] border-2 rounded-xl p-5 cursor-pointer transition ${
              method === "cod" ? "border-[var(--color-primary)]" : "border-[var(--border)]"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                checked={method === "cod"}
                onChange={() => setMethod("cod")}
              />
              <Truck className="text-[var(--color-primary)]" />
              <span className="font-medium">Cash on Delivery</span>
            </div>
          </label>
        </div>

        {/* RIGHT - ORDER SUMMARY */}
        <div className="bg-[var(--bg-card)] border-2 border-[var(--border)] rounded-xl p-6 h-fit sticky top-4">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          <div className="space-y-2 text-sm text-[var(--text-secondary)]">
            <div className="flex justify-between">
              <span>Items Total</span>
              <span>Rs. {itemsTotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>Rs. {deliveryFee}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Coupon ({couponCode})</span>
                <span>- Rs. {discountAmount}</span>
              </div>
            )}
          </div>

          <div className="border-t border-[var(--border)] mt-3 pt-3 flex justify-between font-bold text-lg">
            <span>Total Amount</span>
            <span className="text-[var(--color-primary)]">Rs. {total}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
            className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isPlacingOrder && <Loader2 size={20} className="animate-spin" />}
            {method === "stripe" ? "Continue to Payment" : "Confirm Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
