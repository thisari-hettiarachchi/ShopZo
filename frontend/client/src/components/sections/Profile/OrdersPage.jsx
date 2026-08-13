import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, ChevronRight } from "lucide-react";
import { fetchOrders as fetchOrdersApi } from "../../../api/ordersApi";
import ProfileSectionHeader from "./ProfileSectionHeader";
import { capitalizeText } from "../../../utils/productHelpers";

const STATUS_STYLES = {
  Delivered: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  Pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Placed: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Processing: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  Shipped: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
  Cancelled: "bg-red-500/15 text-red-600 dark:text-red-400",
  Refunded: "bg-slate-500/15 text-slate-600 dark:text-slate-300",
};

function formatOrderId(id = "") {
  const short = String(id).slice(-8).toUpperCase();
  return short ? `ORD-${short}` : "ORD---------";
}

function formatMoney(amount) {
  return `LKR ${(Number(amount) || 0).toLocaleString("en-LK")}`;
}

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getItemCount(order) {
  return (order.products || []).reduce((sum, item) => sum + (item?.quantity || 1), 0);
}

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setOrders([]);
        setLoading(false);
        return;
      }

      try {
        const ordersRes = await fetchOrdersApi();
        setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  return (
    <div className="space-y-6">
      <ProfileSectionHeader
        icon={Package}
        eyebrow="Orders"
        title="My Orders"
        description="Track purchases, cancel within 24 hours, or confirm receipt when shipped."
      />

      {loading ? (
        <p className="text-sm text-[var(--text-muted)]">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] py-16 text-center shadow-[0_24px_60px_-36px_var(--shadow)]">
          <p className="text-[var(--text-secondary)]">No orders found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => {
            const itemCount = getItemCount(order);
            const items = order.products || [];

            return (
              <article
                key={order._id}
                className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-[0_18px_40px_-30px_var(--shadow)] backdrop-blur-xl transition hover:border-[color-mix(in_srgb,var(--color-primary)_35%,var(--border))]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        className="text-base font-semibold tracking-wide text-[var(--text-primary)]"
                        style={{ fontFamily: "'Sora', sans-serif" }}
                      >
                        {formatOrderId(order._id)}
                      </h3>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                          STATUS_STYLES[order.status] ||
                          "bg-[var(--bg-muted)] text-[var(--text-secondary)]"
                        }`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-[var(--text-muted)]">
                      Ordered on {formatDate(order.createdAt)}
                    </p>
                    <p className="text-sm text-[var(--text-muted)]">
                      {itemCount} {itemCount === 1 ? "item" : "items"}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {items.slice(0, 3).map((item, idx) => (
                        <span
                          key={`${order._id}-preview-${idx}`}
                          className="inline-flex max-w-full truncate rounded-lg bg-[var(--bg-main)] px-2.5 py-1.5 text-xs text-[var(--text-secondary)]"
                        >
                          {item?.quantity || 1}x {capitalizeText(item?.product?.name || "Product")}
                        </span>
                      ))}
                      {items.length > 3 && (
                        <span className="inline-flex rounded-lg bg-[var(--bg-main)] px-2.5 py-1.5 text-xs text-[var(--text-muted)]">
                          +{items.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-end justify-between self-stretch">
                    <p
                      className="text-xl font-semibold text-[var(--color-primary)] sm:text-2xl"
                      style={{ fontFamily: "'Sora', sans-serif" }}
                    >
                      {formatMoney(order.total)}
                    </p>

                    <button
                      type="button"
                      onClick={() => navigate(`/orders/${order._id}`)}
                      className="mt-6 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)] transition hover:text-[var(--color-primary)]"
                    >
                      View details
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
