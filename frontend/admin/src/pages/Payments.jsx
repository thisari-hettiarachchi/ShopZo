import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { CreditCard, Truck, RotateCcw, Wallet, Undo2 } from "lucide-react";
import { getPayments, refundOrder } from "../services/adminService";
import PageHeader from "../components/shared/PageHeader";

const STATUS_STYLES = {
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  refunded: "bg-slate-100 text-slate-600 ring-slate-200",
  failed: "bg-red-50 text-red-600 ring-red-200",
};

function StatCard({ icon: Icon, label, value, tone }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 flex items-center gap-4">
      <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${tone}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs text-[var(--text-secondary)]">{label}</p>
        <p className="text-xl font-bold text-[var(--text-primary)] tabular-nums">{value}</p>
      </div>
    </div>
  );
}

export default function PaymentsPage() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refundingId, setRefundingId] = useState("");
  const [filter, setFilter] = useState("all");

  const loadPayments = async () => {
    try {
      const data = await getPayments();
      setOrders(Array.isArray(data.orders) ? data.orders : []);
      setStats(data.stats || null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleRefund = async (order) => {
    const confirmed = window.confirm(
      `Refund Rs. ${order.amountPaid || order.total} to ${order.user?.name || "this customer"}?`
    );
    if (!confirmed) return;

    setRefundingId(order._id);
    try {
      const res = await refundOrder(order._id);
      setOrders((prev) => prev.map((o) => (o._id === order._id ? res.order : o)));
      toast.success("Refund issued successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to process refund");
    } finally {
      setRefundingId("");
    }
  };

  const filtered = useMemo(() => {
    if (filter === "all") return orders;
    if (filter === "stripe") return orders.filter((o) => o.paymentMethod === "stripe");
    if (filter === "cod") return orders.filter((o) => o.paymentMethod === "cod");
    if (filter === "refunded") return orders.filter((o) => o.paymentStatus === "refunded");
    return orders;
  }, [orders, filter]);

  return (
    <section className="min-h-screen bg-[var(--bg-main)] px-5 pb-10 pt-8 text-[var(--text-primary)] md:px-10 md:pb-12">
      <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="Finance"
        title="Payments"
        description="Track Stripe collections, cash on delivery, and issue refunds."
        meta={stats ? `Rs. ${Number(stats.totalCollected || 0).toLocaleString()} collected` : undefined}
      />

      {stats && (
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <StatCard
            icon={Wallet}
            label="Total Collected (Stripe)"
            value={`Rs. ${Number(stats.totalCollected || 0).toLocaleString()}`}
            tone="bg-emerald-50 text-emerald-600"
          />
          <StatCard
            icon={Truck}
            label="COD Pending Collection"
            value={`Rs. ${Number(stats.codPending || 0).toLocaleString()}`}
            tone="bg-amber-50 text-amber-600"
          />
          <StatCard
            icon={Undo2}
            label="Total Refunded"
            value={`Rs. ${Number(stats.totalRefunded || 0).toLocaleString()}`}
            tone="bg-slate-100 text-slate-600"
          />
        </div>
      )}

      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {[
          { id: "all", label: "All" },
          { id: "stripe", label: "Card (Stripe)" },
          { id: "cod", label: "Cash on Delivery" },
          { id: "refunded", label: "Refunded" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition ${
              filter === tab.id
                ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white"
                : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--color-primary)]/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-card)] py-20 text-center">
          <p className="text-sm font-medium text-[var(--text-secondary)]">No payments found</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((order) => {
            const statusTone = STATUS_STYLES[order.paymentStatus] || STATUS_STYLES.pending;
            const canRefund = order.paymentMethod === "stripe" && order.paymentStatus === "paid";
            return (
              <div
                key={order._id}
                className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm">#{order._id.slice(-6).toUpperCase()}</p>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusTone}`}>
                    {order.paymentStatus || "pending"}
                  </span>
                </div>

                <p className="text-sm text-[var(--text-secondary)]">
                  {order.user?.name || "Unknown customer"}
                  {order.user?.email && <span className="opacity-60"> · {order.user.email}</span>}
                </p>

                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                  {order.paymentMethod === "cod" ? <Truck size={14} /> : <CreditCard size={14} />}
                  {order.paymentMethod === "cod" ? "Cash on Delivery" : "Stripe Card Payment"}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
                  <p className="text-lg font-bold tabular-nums">
                    Rs. {Number(order.amountPaid || order.total || 0).toLocaleString()}
                  </p>
                  {canRefund && (
                    <button
                      onClick={() => handleRefund(order)}
                      disabled={refundingId === order._id}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                    >
                      <RotateCcw size={13} />
                      {refundingId === order._id ? "Refunding..." : "Refund"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>
    </section>
  );
}
