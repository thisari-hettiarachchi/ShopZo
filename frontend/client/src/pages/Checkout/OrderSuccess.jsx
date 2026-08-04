import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2, Package, Home } from "lucide-react";
import { confirmCheckoutSession } from "../../services/checkoutService";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const sessionId = params.get("session_id");
  const isCod = location.state?.method === "cod";

  const [status, setStatus] = useState(isCod ? "paid" : "loading");

  useEffect(() => {
    if (isCod || !sessionId) {
      if (!isCod && !sessionId) setStatus("error");
      return;
    }

    let attempts = 0;
    const maxAttempts = 5;

    const poll = async () => {
      try {
        const res = await confirmCheckoutSession(sessionId);
        if (res.status === "paid") {
          setStatus("paid");
          return;
        }
        attempts += 1;
        if (attempts < maxAttempts) {
          setTimeout(poll, 1500);
        } else {
          setStatus("pending");
        }
      } catch (err) {
        console.error("Failed to confirm payment:", err);
        setStatus("error");
      }
    };

    poll();
  }, [sessionId, isCod]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] px-4">
      <div className="bg-[var(--bg-card)] border-2 border-[var(--border)] rounded-2xl p-10 text-center max-w-md w-full">
        {status === "loading" && (
          <>
            <Loader2 size={56} className="mx-auto mb-4 animate-spin text-[var(--color-primary)]" />
            <h1 className="text-2xl font-bold mb-2">Confirming your payment...</h1>
            <p className="text-[var(--text-secondary)]">This only takes a moment.</p>
          </>
        )}

        {status === "paid" && (
          <>
            <CheckCircle2 size={56} className="mx-auto mb-4 text-green-500" />
            <h1 className="text-2xl font-bold mb-2">
              {isCod ? "Order placed successfully!" : "Payment successful!"}
            </h1>
            <p className="text-[var(--text-secondary)] mb-6">
              {isCod
                ? "Your order will be prepared for delivery. Pay the courier when it arrives."
                : "Thank you for your purchase. A confirmation has been added to your notifications."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate("/profile?section=My%20Orders")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-semibold"
              >
                <Package size={18} /> View My Orders
              </button>
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-[var(--border)] font-semibold"
              >
                <Home size={18} /> Continue Shopping
              </button>
            </div>
          </>
        )}

        {status === "pending" && (
          <>
            <Loader2 size={56} className="mx-auto mb-4 text-[var(--color-primary)]" />
            <h1 className="text-2xl font-bold mb-2">Almost there</h1>
            <p className="text-[var(--text-secondary)] mb-6">
              We're still processing your payment. Check your orders in a moment - you'll get a
              notification once it's confirmed.
            </p>
            <button
              onClick={() => navigate("/profile?section=My%20Orders")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-semibold"
            >
              View My Orders
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle size={56} className="mx-auto mb-4 text-red-500" />
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-[var(--text-secondary)] mb-6">
              We couldn't confirm your payment automatically. If money was deducted, check your
              orders page or contact support.
            </p>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-[var(--border)] font-semibold"
            >
              <Home size={18} /> Back to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}
