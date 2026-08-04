import React from "react";
import { ShieldCheck, CreditCard, Truck } from "lucide-react";
import ProfileSectionHeader from "./ProfileSectionHeader";

export default function PaymentOptions() {
  return (
    <div className="space-y-6">
      <ProfileSectionHeader
        icon={CreditCard}
        eyebrow="Checkout"
        title="Payment Options"
        description="ShopZo never stores your card details. Payments run securely through Stripe."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[0_24px_60px_-36px_var(--shadow)] backdrop-blur-xl transition hover:-translate-y-0.5">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--bg-hover)] text-[var(--color-primary)]">
            <CreditCard size={22} />
          </div>
          <h3
            className="text-lg font-semibold text-[var(--text-primary)]"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Card payments via Stripe
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
            Enter your card once at checkout — Stripe handles it directly, end to end.
          </p>
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[0_24px_60px_-36px_var(--shadow)] backdrop-blur-xl transition hover:-translate-y-0.5">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--bg-hover)] text-[var(--color-primary)]">
            <Truck size={22} />
          </div>
          <h3
            className="text-lg font-semibold text-[var(--text-primary)]"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Cash on Delivery
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
            Prefer to pay in person? Choose Cash on Delivery at checkout instead.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] px-5 py-4 text-sm text-[var(--text-muted)] shadow-[0_18px_40px_-30px_var(--shadow)]">
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <p>
          Your payment information is encrypted and handled by Stripe, a PCI-DSS Level 1
          certified payment processor. ShopZo&apos;s servers never see or store your full card
          number.
        </p>
      </div>
    </div>
  );
}
