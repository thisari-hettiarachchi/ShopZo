import React from "react";
import { ShieldCheck, CreditCard, Truck } from "lucide-react";

export default function PaymentOptions() {
  return (
    <div
      className="p-6 rounded-2xl shadow-2xl"
      style={{ backgroundColor: "var(--bg-card)", boxShadow: "0 10px 40px var(--shadow)" }}
    >
      <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
        Payment Options
      </h2>
      <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
        ShopZo never stores your card details. Every card payment is processed securely by Stripe
        at checkout.
      </p>

      <div className="flex flex-col gap-4">
        <div
          className="p-5 rounded-2xl border-2 border-[var(--border)] flex items-center gap-4"
          style={{ backgroundColor: "var(--bg-muted)" }}
        >
          <CreditCard size={32} style={{ color: "var(--color-primary)" }} />
          <div>
            <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
              Card payments via Stripe
            </p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Enter your card once at checkout - Stripe handles it directly, end to end.
            </p>
          </div>
        </div>

        <div
          className="p-5 rounded-2xl border-2 border-[var(--border)] flex items-center gap-4"
          style={{ backgroundColor: "var(--bg-muted)" }}
        >
          <Truck size={32} style={{ color: "var(--color-primary)" }} />
          <div>
            <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
              Cash on Delivery
            </p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Prefer to pay in person? Choose Cash on Delivery at checkout instead.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2 text-sm mt-2" style={{ color: "var(--text-muted)" }}>
          <ShieldCheck size={16} className="mt-0.5 shrink-0 text-green-600" />
          <p>
            Your payment information is encrypted and handled by Stripe, a PCI-DSS Level 1
            certified payment processor. ShopZo's servers never see or store your full card
            number.
          </p>
        </div>
      </div>
    </div>
  );
}
