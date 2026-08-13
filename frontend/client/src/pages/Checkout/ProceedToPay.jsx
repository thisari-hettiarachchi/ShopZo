import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  CreditCard,
  Truck,
  ShieldCheck,
  Loader2,
  ArrowLeft,
  Wallet,
  MapPin,
  Mail,
  Phone,
  User,
} from "lucide-react";
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
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--bg-main)] px-4">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-72 opacity-80"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 10% -10%, color-mix(in srgb, var(--color-primary) 22%, transparent), transparent 70%)",
          }}
        />
        <div className="relative max-w-md rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-10 text-center shadow-[0_24px_60px_-36px_var(--shadow)] backdrop-blur-xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--bg-main)]">
            <Wallet className="h-7 w-7 text-[var(--color-primary)]" />
          </div>
          <h1
            className="text-2xl font-semibold text-[var(--text-primary)]"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Let&apos;s get you back to checkout
          </h1>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">
            We need your cart and shipping address before you can pay. Please start from
            checkout.
          </p>
          <button
            type="button"
            onClick={() => navigate("/checkout")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-6 py-3 text-sm font-semibold text-white"
          >
            <ArrowLeft size={18} /> Go to Checkout
          </button>
        </div>
      </div>
    );
  }

  const itemsTotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = Math.max(itemsTotal + deliveryFee - discountAmount, 0);
  const itemCount = cartItems.reduce((sum, item) => sum + (item.qty || 1), 0);

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
          deliveryFee,
        });
        if (!session?.url) {
          throw new Error("Stripe did not return a checkout URL");
        }
        window.location.href = session.url;
        return;
      }

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
    <div className="relative min-h-screen overflow-hidden bg-[var(--bg-main)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 opacity-80"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 10% -10%, color-mix(in srgb, var(--color-primary) 22%, transparent), transparent 70%), radial-gradient(ellipse 60% 50% at 90% 0%, color-mix(in srgb, var(--color-accent) 14%, transparent), transparent 65%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <button
          type="button"
          onClick={() =>
            navigate("/checkout", {
              state: location.state?.buyNowState || undefined,
            })
          }
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-secondary)] transition hover:text-[var(--color-primary)]"
        >
          <ArrowLeft size={16} />
          Back to checkout
        </button>

        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-[0_12px_28px_-18px_var(--shadow)]">
            <Wallet className="h-6 w-6 text-[var(--color-primary)]" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Final Step
            </p>
            <h1
              className="text-3xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Select Payment Method
            </h1>
            <p className="mt-0.5 text-sm text-[var(--text-muted)]">
              Choose how you want to pay, then confirm your order.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Payment methods */}
            <section className="space-y-3">
              <PaymentOption
                active={method === "stripe"}
                onSelect={() => setMethod("stripe")}
                icon={CreditCard}
                title="Pay securely with Card"
                subtitle="Stripe encrypted checkout"
              >
                {method === "stripe" && (
                  <div className="mt-4 flex items-start gap-2 rounded-xl bg-[var(--bg-main)] px-3 py-3 text-sm text-[var(--text-secondary)]">
                    <ShieldCheck
                      size={16}
                      className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                    />
                    <p>
                      You&apos;ll be redirected to Stripe&apos;s secure checkout to enter your
                      card details. ShopZo never stores your card number.
                    </p>
                  </div>
                )}
              </PaymentOption>

              <PaymentOption
                active={method === "cod"}
                onSelect={() => setMethod("cod")}
                icon={Truck}
                title="Cash on Delivery"
                subtitle="Pay when your order arrives"
              >
                {method === "cod" && (
                  <div className="mt-4 rounded-xl bg-[var(--bg-main)] px-3 py-3 text-sm text-[var(--text-secondary)]">
                    Your order will be placed immediately. Please keep the exact amount ready
                    for the delivery partner.
                  </div>
                )}
              </PaymentOption>
            </section>

            {/* Shipping preview */}
            <section className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[0_24px_60px_-36px_var(--shadow)] backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--bg-hover)] text-[var(--color-primary)]">
                  <MapPin size={18} />
                </div>
                <div>
                  <h2
                    className="text-xl font-semibold text-[var(--text-primary)]"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                  >
                    Delivering to
                  </h2>
                  <p className="text-sm text-[var(--text-muted)]">
                    Shipping details from your checkout form
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <InfoRow icon={User} label="Name" value={address.fullName} />
                <InfoRow icon={Phone} label="Contact" value={address.phone} />
                {address.email && (
                  <InfoRow icon={Mail} label="Email" value={address.email} />
                )}
                <InfoRow
                  icon={MapPin}
                  label="Address"
                  value={[address.addressLine, address.region].filter(Boolean).join(", ")}
                />
              </div>
            </section>
          </div>

          {/* Order summary */}
          <aside className="h-fit rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[0_24px_60px_-36px_var(--shadow)] backdrop-blur-xl lg:sticky lg:top-24">
            <h2
              className="mb-1 text-xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Order summary
            </h2>
            <p className="mb-5 text-sm text-[var(--text-muted)]">
              {itemCount} {itemCount === 1 ? "item" : "items"} ·{" "}
              {method === "stripe" ? "Card payment" : "Cash on Delivery"}
            </p>

            <div className="mb-5 max-h-64 space-y-3 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div
                  key={item._id || item.product?._id}
                  className="flex gap-3 rounded-2xl bg-[var(--bg-main)] p-3"
                >
                  <img
                    src={item.product?.image || item.product?.images?.[0]}
                    alt={item.product?.name || "Product"}
                    className="h-14 w-14 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] object-contain"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                      {item.product?.name}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">Qty: {item.qty}</p>
                    <p className="mt-1 text-sm font-semibold text-[var(--color-primary)]">
                      LKR {(item.price * item.qty).toLocaleString("en-LK")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-[var(--border)] pt-4 text-sm">
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Items total</span>
                <span>LKR {itemsTotal.toLocaleString("en-LK")}</span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Delivery</span>
                <span>LKR {deliveryFee.toLocaleString("en-LK")}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Coupon ({couponCode})</span>
                  <span>- LKR {discountAmount.toLocaleString("en-LK")}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-[var(--border)] pt-3 text-lg font-bold text-[var(--text-primary)]">
                <span>Total</span>
                <span className="text-[var(--color-primary)]">
                  LKR {total.toLocaleString("en-LK")}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] py-3.5 text-sm font-semibold text-white shadow-[0_12px_28px_-14px_rgba(249,115,22,0.55)] transition hover:opacity-90 disabled:opacity-60"
            >
              {isPlacingOrder && <Loader2 size={18} className="animate-spin" />}
              {method === "stripe" ? "Continue to Payment" : "Confirm Order"}
            </button>

            <p className="mt-3 text-center text-xs text-[var(--text-muted)]">
              By placing your order you agree to ShopZo&apos;s checkout terms.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}

function PaymentOption({ active, onSelect, icon: Icon, title, subtitle, children }) {
  return (
    <label
      className={`block cursor-pointer rounded-3xl border-2 bg-[var(--bg-card)] p-5 shadow-[0_18px_40px_-30px_var(--shadow)] backdrop-blur-xl transition ${
        active
          ? "border-[var(--color-primary)] bg-[var(--bg-hover)]"
          : "border-[var(--border)] hover:border-[color-mix(in_srgb,var(--color-primary)_40%,var(--border))]"
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="radio"
          name="paymentMethod"
          checked={active}
          onChange={onSelect}
          className="mt-1 accent-[var(--color-primary)]"
        />
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-main)] text-[var(--color-primary)]">
          <Icon size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-[var(--text-primary)]">{title}</p>
          <p className="text-sm text-[var(--text-muted)]">{subtitle}</p>
          {children}
        </div>
      </div>
    </label>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-[var(--bg-main)] px-4 py-3">
      <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
        <Icon size={12} />
        {label}
      </div>
      <p className="text-sm font-medium text-[var(--text-primary)]">{value || "—"}</p>
    </div>
  );
}
