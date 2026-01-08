import React, { useState } from "react";
import { CreditCard, Wallet, Truck } from "lucide-react";

export default function ProceedToPay() {
  const [method, setMethod] = useState("card");

  return (
    <div className="min-h-screen bg-[var(--bg-main)] px-4 py-8">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">

        {/* LEFT – PAYMENT METHODS */}
        <div className="lg:col-span-2 space-y-6">

          <h1 className="text-2xl font-semibold">Select Payment Method</h1>

          {/* CREDIT / DEBIT CARD */}
          <div className="bg-[var(--bg-card)] border-2 border-[var(--border)] rounded-xl p-5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="payment"
                checked={method === "card"}
                onChange={() => setMethod("card")}
              />
              <CreditCard className="text-[var(--color-primary)]" />
              <span className="font-medium">Credit / Debit Card</span>
            </label>

            {method === "card" && (
              <div className="mt-5 grid md:grid-cols-2 gap-4">
                <input className="input" placeholder="Card number" />
                <input className="input" placeholder="Name on card" />
                <input className="input" placeholder="MM/YY" />
                <input className="input" placeholder="CVV" />

                <p className="md:col-span-2 text-xs text-[var(--text-muted)]">
                  We will save this card for your convenience. You can remove it later from
                  <b> Account → Payment Options</b>.
                </p>
              </div>
            )}
          </div>

          {/* POINTS */}
          <div className="bg-[var(--bg-card)] border-2 border-[var(--border)] rounded-xl p-5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="payment"
                checked={method === "points"}
                onChange={() => setMethod("points")}
              />
              <Wallet className="text-[var(--color-primary)]" />
              <span className="font-medium">Points</span>
            </label>
          </div>

          {/* PAYLATER */}
          <div className="bg-[var(--bg-card)] border-2 border-[var(--border)] rounded-xl p-5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="payment"
                checked={method === "paylater"}
                onChange={() => setMethod("paylater")}
              />
              <span className="font-medium">
                Daraz PayLater by Koko | <span className="text-green-600">0% Interest</span>
              </span>
            </label>

            {method === "paylater" && (
              <p className="mt-3 text-sm text-[var(--text-secondary)]">
                Pay in <b>3 instalments</b> of <b>Rs. 212</b>
              </p>
            )}
          </div>

          {/* CASH ON DELIVERY */}
          <div className="bg-[var(--bg-card)] border-2 border-[var(--border)] rounded-xl p-5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="payment"
                checked={method === "cod"}
                onChange={() => setMethod("cod")}
              />
              <Truck className="text-[var(--color-primary)]" />
              <span className="font-medium">Cash on Delivery</span>
            </label>

            {method === "cod" && (
              <div className="mt-3 text-sm text-[var(--text-secondary)] space-y-2">
                <p>● Cash Payment Fee (6%), max Rs.100 applies.</p>
                <p>● Keep exact change amount.</p>
                <p>● Confirm order number, sender, and tracking number before payment.</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT – ORDER SUMMARY */}
        <div className="bg-[var(--bg-card)] border-2 border-[var(--border)] rounded-xl p-6 h-fit sticky top-4">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal (1 item + shipping)</span>
              <span>Rs. 636</span>
            </div>

            {method === "cod" && (
              <div className="flex justify-between text-red-500">
                <span>Cash Payment Fee (6%)</span>
                <span>Rs. 38</span>
              </div>
            )}

            <div className="border-t border-[var(--border)] pt-3 flex justify-between font-bold text-lg">
              <span>Total Amount</span>
              <span className="text-[var(--color-primary)]">
                Rs. {method === "cod" ? 674 : 636}
              </span>
            </div>
          </div>

          <button className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-semibold text-lg">
            Confirm Order
          </button>
        </div>
      </div>

      {/* INPUT STYLE */}
      <style>{`
        .input {
          padding: 12px;
          border-radius: 10px;
          border: 2px solid var(--border);
          background: var(--bg-main);
          color: var(--text-primary);
          outline: none;
        }
        .input:focus {
          border-color: var(--color-primary);
        }
      `}</style>
    </div>
  );
}
