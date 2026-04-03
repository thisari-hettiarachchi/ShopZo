import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "../services/adminService";

const STATUS_OPTIONS = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const STATUS_STYLES = {
  Pending:    { dot: "bg-amber-400",   badge: "bg-amber-50 text-amber-700 ring-amber-200"   },
  Processing: { dot: "bg-blue-400",    badge: "bg-blue-50 text-blue-700 ring-blue-200"      },
  Shipped:    { dot: "bg-violet-400",  badge: "bg-violet-50 text-violet-700 ring-violet-200"},
  Delivered:  { dot: "bg-emerald-400", badge: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  Cancelled:  { dot: "bg-red-400",     badge: "bg-red-50 text-red-600 ring-red-200"         },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.Pending;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${s.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

function OrderCard({ order, onStatusChange }) {
  const [updating, setUpdating] = useState(false);
  const [localStatus, setLocalStatus] = useState(order.status || "Pending");

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    setUpdating(true);
    setLocalStatus(newStatus);
    await onStatusChange(order._id, newStatus);
    setUpdating(false);
  };

  return (
    <div className="group relative rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden transition-shadow duration-200 hover:shadow-md hover:shadow-black/5">
      {/* Top accent bar */}
      <div className={`h-0.5 w-full ${STATUS_STYLES[localStatus]?.dot ?? "bg-amber-400"}`} />

      <div className="p-5 space-y-4">
        {/* Header row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold tracking-tight text-[var(--text-primary)]">
                #{order._id.slice(-6).toUpperCase()}
              </p>
              <StatusBadge status={localStatus} />
            </div>
            <p className="text-sm text-[var(--text-secondary)]">
              {order.user?.name || "Unknown customer"}
              {order.user?.email && (
                <span className="opacity-60"> · {order.user.email}</span>
              )}
            </p>
            {order.vendor?.storeName && (
              <p className="text-xs text-[var(--text-secondary)] opacity-70">
                Store: {order.vendor.storeName}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 sm:flex-col sm:items-end">
            <p className="text-lg font-bold text-[var(--text-primary)] tabular-nums">
              ${Number(order.total || 0).toFixed(2)}
            </p>
            <div className="relative">
              <select
                value={localStatus}
                onChange={handleChange}
                disabled={updating}
                className="appearance-none cursor-pointer rounded-xl border border-[var(--border)] bg-[var(--bg-main)] pl-3 pr-8 py-1.5 text-xs font-medium text-[var(--text-primary)] transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--border)] disabled:opacity-50"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[var(--border)]" />

        {/* Products */}
        <div className="grid gap-2 sm:grid-cols-2">
          {(order.products || []).map((item, index) => (
            <div
              key={`${order._id}-${index}`}
              className="flex items-center gap-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border)] p-3 transition-colors duration-150 hover:border-[var(--text-secondary)]/30"
            >
              <div className="relative flex-shrink-0">
                <img
                  src={item.product?.images?.[0] || "https://placehold.co/56x56/e2e8f0/94a3b8?text=—"}
                  alt={item.product?.name || "Product"}
                  className="h-12 w-12 rounded-lg object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                  {item.product?.name || "Product"}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  Qty&nbsp;
                  <span className="font-semibold tabular-nums text-[var(--text-primary)]">
                    {item.quantity || 0}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(Array.isArray(data) ? data : []);
      } catch (requestError) {
        setError(requestError?.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const updated = await updateOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => (o._id === id ? updated : o)));
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Failed to update order status");
    }
  };

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    return (
      !q ||
      o._id.slice(-6).toLowerCase().includes(q) ||
      o.user?.name?.toLowerCase().includes(q) ||
      o.user?.email?.toLowerCase().includes(q) ||
      o.vendor?.storeName?.toLowerCase().includes(q)
    );
  });

  return (
    <section className="px-6 md:px-10 pt-8 pb-16 bg-[var(--bg-main)] text-[var(--text-primary)] min-h-screen">

      {/* Page header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          {!loading && (
            <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
              {orders.length} {orders.length === 1 ? "order" : "orders"} total
            </p>
          )}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search orders…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] pl-9 pr-4 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--border)]"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-600">
          <svg className="mt-0.5 h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-card)] py-20 text-center">
          <svg className="h-10 w-10 text-[var(--text-secondary)] opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6M3 12a9 9 0 1 1 18 0A9 9 0 0 1 3 12z" />
          </svg>
          <p className="text-sm font-medium text-[var(--text-secondary)]">
            {search ? "No orders match your search" : "No orders yet"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((order) => (
            <OrderCard key={order._id} order={order} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}
    </section>
  );
}