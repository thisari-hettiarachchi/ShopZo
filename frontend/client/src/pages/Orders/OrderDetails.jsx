import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Check,
  CreditCard,
  MapPin,
  Package,
  PackageCheck,
  Star,
  Truck,
  XCircle,
} from "lucide-react";
import {
  cancelOrder,
  confirmOrderReceipt,
  fetchOrderById,
  fetchReturns,
  requestReturn,
} from "../../api/ordersApi";
import { formatVariantLabel } from "../../utils/productVariants";
import { capitalizeText } from "../../utils/productHelpers";

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

function formatDateTime(date) {
  if (!date) return "Pending";
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [returnRequest, setReturnRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");

  const loadOrder = async () => {
    try {
      const [orderRes, returnsRes] = await Promise.all([
        fetchOrderById(id),
        fetchReturns().catch(() => ({ data: [] })),
      ]);
      setOrder(orderRes.data);
      const returns = Array.isArray(returnsRes.data) ? returnsRes.data : [];
      setReturnRequest(
        returns.find((item) => String(item?.order?._id || item?.order) === String(id)) || null
      );
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load order");
      navigate("/profile?section=My%20Orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to continue");
      navigate("/auth");
      return;
    }
    loadOrder();
  }, [id, navigate]);

  const canReturn =
    order &&
    !returnRequest &&
    ["Delivered"].includes(order.status) &&
    (() => {
      const deliveredAt =
        order.statusHistory?.find((entry) => entry.status === "Delivered")?.at ||
        order.createdAt;
      const days =
        (Date.now() - new Date(deliveredAt).getTime()) / (1000 * 60 * 60 * 24);
      return days <= 7;
    })();

  const handleCancel = async () => {
    if (!order?.canCancel) return;
    const confirmed = window.confirm(
      "Cancel this order? This can only be done within 24 hours of placing it."
    );
    if (!confirmed) return;

    try {
      setActionLoading("cancel");
      const res = await cancelOrder(order._id);
      setOrder(res.data.order);
      toast.success(res.data.message || "Order cancelled");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to cancel order");
    } finally {
      setActionLoading("");
    }
  };

  const handleConfirmReceipt = async () => {
    if (!order?.canConfirmReceipt) return;
    const confirmed = window.confirm(
      "Confirm that you received this order? It will be marked as Delivered."
    );
    if (!confirmed) return;

    try {
      setActionLoading("confirm");
      const res = await confirmOrderReceipt(order._id);
      setOrder(res.data.order);
      toast.success(res.data.message || "Order marked as delivered");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to confirm receipt");
    } finally {
      setActionLoading("");
    }
  };

  const handleReturn = async () => {
    const reason = prompt("Reason for return:");
    if (!reason) return;

    try {
      setActionLoading("return");
      await requestReturn(order._id, { reason, details: "Requested from order details" });
      toast.success("Return request submitted");
      await loadOrder();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to request return");
    } finally {
      setActionLoading("");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-[var(--bg-main)]">
        <p className="text-sm text-[var(--text-muted)]">Loading order details...</p>
      </div>
    );
  }

  if (!order) return null;

  const items = order.products || [];
  const itemCount = items.reduce((sum, item) => sum + (item?.quantity || 1), 0);
  const timeline = order.trackingTimeline || [];
  const isCancelled = order.status === "Cancelled";
  const isDelivered = order.status === "Delivered";

  const goToProductReview = (item) => {
    const productId = item?.product?._id || item?.product;
    if (!productId) {
      toast.error("Product not found for this item");
      return;
    }
    navigate(`/products/${productId}?review=1`);
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

      <div className="relative mx-auto max-w-5xl px-4 py-8 md:px-6 lg:px-8">
        <Link
          to="/profile?section=My%20Orders"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-secondary)] transition hover:text-[var(--color-primary)]"
        >
          <ArrowLeft size={16} />
          Back to My Orders
        </Link>

        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-[0_12px_28px_-18px_var(--shadow)]">
              <Package className="h-6 w-6 text-[var(--color-primary)]" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Order Details
              </p>
              <h1
                className="text-3xl font-semibold text-[var(--text-primary)]"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                {formatOrderId(order._id)}
              </h1>
              <p className="mt-0.5 text-sm text-[var(--text-muted)]">
                Placed on {formatDate(order.createdAt)} · {itemCount}{" "}
                {itemCount === 1 ? "item" : "items"}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                STATUS_STYLES[order.status] ||
                "bg-[var(--bg-muted)] text-[var(--text-secondary)]"
              }`}
            >
              {order.status}
            </span>
            <p
              className="mt-2 text-2xl font-semibold text-[var(--color-primary)]"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              {formatMoney(order.total)}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Tracking */}
          <section className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[0_24px_60px_-36px_var(--shadow)] backdrop-blur-xl md:p-8">
            <h2
              className="mb-6 text-xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Order tracking
            </h2>

            {isCancelled ? (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/15 text-red-500">
                    <XCircle size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-red-600 dark:text-red-400">Order cancelled</p>
                    <p className="text-sm text-[var(--text-muted)]">
                      {formatDateTime(
                        order.statusHistory?.find((entry) => entry.status === "Cancelled")?.at ||
                          order.updatedAt
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <ol className="relative space-y-0">
                {timeline.map((step, index) => {
                  const done = step.completed;
                  const active = step.active;
                  const isLast = index === timeline.length - 1;

                  return (
                    <li key={step.status} className="relative flex gap-4 pb-8 last:pb-0">
                      {!isLast && (
                        <span
                          className={`absolute left-[15px] top-8 h-[calc(100%-16px)] w-0.5 ${
                            done ? "bg-[var(--color-primary)]" : "bg-[var(--border)]"
                          }`}
                        />
                      )}
                      <div
                        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                          done || active
                            ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                            : "border-[var(--border)] bg-[var(--bg-main)] text-[var(--text-muted)]"
                        }`}
                      >
                        {done ? <Check size={14} /> : <span className="text-[10px] font-bold">{index + 1}</span>}
                      </div>
                      <div className="min-w-0 pt-0.5">
                        <p
                          className={`font-semibold ${
                            done || active
                              ? "text-[var(--text-primary)]"
                              : "text-[var(--text-muted)]"
                          }`}
                        >
                          {step.status}
                          {active && !isCancelled && (
                            <span className="ml-2 text-xs font-bold uppercase tracking-wide text-[var(--color-primary)]">
                              Current
                            </span>
                          )}
                        </p>
                        <p className="mt-0.5 text-sm text-[var(--text-muted)]">
                          {done || active ? formatDateTime(step.at) : "Awaiting update"}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}

            {/* Actions */}
            <div className="mt-8 flex flex-wrap gap-3 border-t border-[var(--border)] pt-6">
              {order.canCancel && (
                <button
                  type="button"
                  disabled={Boolean(actionLoading)}
                  onClick={handleCancel}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-500/60 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-500/10 disabled:opacity-60 dark:text-red-400"
                >
                  <XCircle size={16} />
                  {actionLoading === "cancel" ? "Cancelling..." : "Cancel order"}
                </button>
              )}

              {order.canConfirmReceipt && (
                <button
                  type="button"
                  disabled={Boolean(actionLoading)}
                  onClick={handleConfirmReceipt}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_-14px_rgba(249,115,22,0.55)] transition hover:opacity-90 disabled:opacity-60"
                >
                  <PackageCheck size={16} />
                  {actionLoading === "confirm" ? "Confirming..." : "Confirm receipt"}
                </button>
              )}

              {canReturn && (
                <button
                  type="button"
                  disabled={Boolean(actionLoading)}
                  onClick={handleReturn}
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[var(--bg-hover)] disabled:opacity-60"
                >
                  {actionLoading === "return" ? "Submitting..." : "Request return"}
                </button>
              )}

              {returnRequest && (
                <span className="inline-flex items-center rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm font-semibold text-amber-700 dark:text-amber-400">
                  Return: {returnRequest.status}
                </span>
              )}

              {!order.canCancel &&
                !order.canConfirmReceipt &&
                !canReturn &&
                !returnRequest &&
                !isCancelled &&
                !isDelivered && (
                  <p className="text-sm text-[var(--text-muted)]">
                    No actions available for this order right now.
                  </p>
                )}

              {isDelivered && (
                <p className="w-full text-sm text-[var(--text-muted)]">
                  Order delivered — you can add a review for each item below.
                </p>
              )}
            </div>

            {order.canCancel && order.cancelExpiresAt && (
              <p className="mt-3 text-xs text-[var(--text-muted)]">
                Cancel available until {formatDateTime(order.cancelExpiresAt)} (24 hours from
                order time).
              </p>
            )}

            {order.canConfirmReceipt && (
              <p className="mt-3 text-xs text-[var(--text-muted)]">
                Received your package? Confirm receipt to mark this order as Delivered.
              </p>
            )}
          </section>

          {/* Summary */}
          <aside className="space-y-4">
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[0_24px_60px_-36px_var(--shadow)] backdrop-blur-xl">
              <h3
                className="mb-4 text-lg font-semibold text-[var(--text-primary)]"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                Items
              </h3>
              <div className="space-y-3">
                {items.map((item, idx) => {
                  const productId = item?.product?._id || item?.product;
                  return (
                    <div
                      key={`${order._id}-${idx}`}
                      className="rounded-2xl bg-[var(--bg-main)] p-3"
                    >
                      <div className="flex gap-3">
                        <img
                          src={item?.product?.images?.[0] || "https://via.placeholder.com/64"}
                          alt=""
                          className="h-14 w-14 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                            {capitalizeText(item?.product?.name || "Product")}
                          </p>
                          <p className="text-xs text-[var(--text-muted)]">
                            Qty: {item?.quantity || 1}
                            {formatVariantLabel(item) ? ` · ${formatVariantLabel(item)}` : ""}
                          </p>
                          <p className="text-sm font-semibold text-[var(--color-primary)]">
                            {formatMoney(item?.price || 0)}
                          </p>
                        </div>
                      </div>

                      {isDelivered && productId && (
                        <button
                          type="button"
                          onClick={() => goToProductReview(item)}
                          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-primary)] px-3 py-2 text-xs font-semibold text-[var(--color-primary)] transition hover:bg-[var(--bg-hover)]"
                        >
                          <Star size={14} />
                          Add Review
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {order.coupon?.code && (
                <p className="mt-4 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  Coupon &quot;{order.coupon.code}&quot; saved{" "}
                  {formatMoney(order.coupon.discountAmount)}
                </p>
              )}
            </div>

            <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[0_24px_60px_-36px_var(--shadow)] backdrop-blur-xl">
              <h3
                className="mb-4 text-lg font-semibold text-[var(--text-primary)]"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                Details
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3 text-[var(--text-secondary)]">
                  <Truck size={16} className="mt-0.5 shrink-0 text-[var(--color-primary)]" />
                  <span>
                    Vendor:{" "}
                    <span className="font-semibold text-[var(--text-primary)]">
                      {capitalizeText(order.vendor?.storeName || order.vendor?.name || "Vendor")}
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-3 text-[var(--text-secondary)]">
                  {order.paymentMethod === "cod" ? (
                    <Truck size={16} className="mt-0.5 shrink-0 text-[var(--color-primary)]" />
                  ) : (
                    <CreditCard size={16} className="mt-0.5 shrink-0 text-[var(--color-primary)]" />
                  )}
                  <span>
                    Payment:{" "}
                    <span className="font-semibold capitalize text-[var(--text-primary)]">
                      {order.paymentMethod === "cod" ? "Cash on Delivery" : "Card"} ·{" "}
                      {order.paymentStatus || "pending"}
                    </span>
                  </span>
                </li>
                {order.shippingAddress && (
                  <li className="flex items-start gap-3 text-[var(--text-secondary)]">
                    <MapPin size={16} className="mt-0.5 shrink-0 text-[var(--color-primary)]" />
                    <span>
                      {[
                        order.shippingAddress.fullName,
                        order.shippingAddress.addressLine,
                        order.shippingAddress.region,
                        order.shippingAddress.phone,
                      ]
                        .filter(Boolean)
                        .join(", ") || "Shipping address on file"}
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
