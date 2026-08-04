import React from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, ShoppingCart, Home } from "lucide-react";

export default function OrderCancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] px-4">
      <div className="bg-[var(--bg-card)] border-2 border-[var(--border)] rounded-2xl p-10 text-center max-w-md w-full">
        <XCircle size={56} className="mx-auto mb-4 text-[var(--color-secondary)]" />
        <h1 className="text-2xl font-bold mb-2">Payment cancelled</h1>
        <p className="text-[var(--text-secondary)] mb-6">
          No worries - your cart is still saved. You can try again whenever you're ready.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate("/cart")}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-semibold"
          >
            <ShoppingCart size={18} /> Back to Cart
          </button>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-[var(--border)] font-semibold"
          >
            <Home size={18} /> Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
