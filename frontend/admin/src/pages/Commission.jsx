import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  BadgePercent,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Store,
  Wallet,
} from "lucide-react";
import {
  getCommissions,
  markCommissionPaid,
  markCommissionUnpaid,
  markVendorCommissionsPaid,
} from "../services/adminService";
import PageHeader from "../components/shared/PageHeader";

const STATUS_STYLES = {
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  unpaid: "bg-amber-50 text-amber-700 ring-amber-200",
  overdue: "bg-red-50 text-red-600 ring-red-200",
  waived: "bg-slate-100 text-slate-600 ring-slate-200",
};

function StatCard({ icon: Icon, label, value, tone }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs text-[var(--text-secondary)]">{label}</p>
        <p className="text-xl font-bold tabular-nums text-[var(--text-primary)]">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const key = status || "unpaid";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ring-1 ring-inset ${
        STATUS_STYLES[key] || STATUS_STYLES.unpaid
      }`}
    >
      {key}
    </span>
  );
}

const money = (value) => `LKR ${Number(value || 0).toLocaleString()}`;

export default function CommissionPage() {
  const [stats, setStats] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [commissionRate, setCommissionRate] = useState(0.02);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("vendors");
  const [busyId, setBusyId] = useState("");

  const loadCommissions = async () => {
    try {
      const data = await getCommissions();
      setStats(data.stats || null);
      setVendors(Array.isArray(data.vendors) ? data.vendors : []);
      setCommissions(Array.isArray(data.commissions) ? data.commissions : []);
      setCommissionRate(Number(data.commissionRate || 0.02));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load commissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommissions();
  }, []);

  const filteredVendors = useMemo(() => {
    if (filter === "all") return vendors;
    return vendors.filter((vendor) => vendor.status === filter);
  }, [vendors, filter]);

  const filteredCommissions = useMemo(() => {
    if (filter === "all") return commissions;
    return commissions.filter((item) => item.displayStatus === filter);
  }, [commissions, filter]);

  const handleMarkPaid = async (id) => {
    setBusyId(id);
    try {
      await markCommissionPaid(id);
      toast.success("Commission marked as paid");
      await loadCommissions();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to mark as paid");
    } finally {
      setBusyId("");
    }
  };

  const handleMarkUnpaid = async (id) => {
    setBusyId(id);
    try {
      await markCommissionUnpaid(id);
      toast.success("Commission marked as unpaid");
      await loadCommissions();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to mark as unpaid");
    } finally {
      setBusyId("");
    }
  };

  const handleMarkVendorPaid = async (vendorId, storeName) => {
    const confirmed = window.confirm(
      `Mark all unpaid commissions for "${storeName}" as paid?`
    );
    if (!confirmed) return;

    setBusyId(vendorId);
    try {
      const res = await markVendorCommissionsPaid(vendorId);
      toast.success(res.message || "Vendor commissions marked as paid");
      await loadCommissions();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update vendor commissions");
    } finally {
      setBusyId("");
    }
  };

  return (
    <section className="min-h-screen bg-[var(--bg-main)] px-5 pb-10 pt-8 text-[var(--text-primary)] md:px-10 md:pb-12">
      <div className="mx-auto max-w-7xl">
        <PageHeader
          eyebrow="Finance"
          title="Commission"
          description={`Vendors owe ${(commissionRate * 100).toFixed(0)}% platform commission on each settled sale. Track paid, unpaid, and overdue balances.`}
          meta={
            stats
              ? `${stats.overdueVendors || 0} overdue · ${money(stats.totalUnpaid)} unpaid`
              : undefined
          }
        />

        {stats && (
          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={BadgePercent}
              label="Total Commission"
              value={money(stats.totalCommission)}
              tone="bg-orange-50 text-[var(--color-primary)]"
            />
            <StatCard
              icon={Wallet}
              label="Collected"
              value={money(stats.totalCollected)}
              tone="bg-emerald-50 text-emerald-600"
            />
            <StatCard
              icon={Clock3}
              label="Unpaid"
              value={money(stats.totalUnpaid)}
              tone="bg-amber-50 text-amber-600"
            />
            <StatCard
              icon={AlertTriangle}
              label="Overdue"
              value={money(stats.totalOverdue)}
              tone="bg-red-50 text-red-600"
            />
          </div>
        )}

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "All" },
              { id: "unpaid", label: "Unpaid" },
              { id: "overdue", label: "Overdue" },
              { id: "paid", label: "Paid" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                  filter === tab.id
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                    : "border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-[var(--color-primary)]/40"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex rounded-full border border-[var(--border)] bg-[var(--bg-card)] p-1">
            {[
              { id: "vendors", label: "By Vendor" },
              { id: "orders", label: "By Order" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setView(tab.id)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  view === tab.id
                    ? "bg-[var(--bg-main)] text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-10 text-center text-sm text-[var(--text-secondary)]">
            Loading commissions...
          </div>
        ) : view === "vendors" ? (
          <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-[var(--border)] bg-[var(--bg-main)] text-xs uppercase tracking-wide text-[var(--text-secondary)]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Vendor</th>
                    <th className="px-4 py-3 font-semibold">Orders</th>
                    <th className="px-4 py-3 font-semibold">Gross Sales</th>
                    <th className="px-4 py-3 font-semibold">Commission Due</th>
                    <th className="px-4 py-3 font-semibold">Unpaid</th>
                    <th className="px-4 py-3 font-semibold">Overdue</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVendors.map((vendor) => (
                    <tr key={vendor.vendorId} className="border-b border-[var(--border)] last:border-0">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Store size={16} className="text-[var(--color-primary)]" />
                          <div>
                            <p className="font-semibold text-[var(--text-primary)]">{vendor.storeName}</p>
                            <p className="text-xs text-[var(--text-secondary)]">{vendor.email || "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 tabular-nums">{vendor.orderCount}</td>
                      <td className="px-4 py-3 tabular-nums">{money(vendor.grossSales)}</td>
                      <td className="px-4 py-3 tabular-nums font-semibold">{money(vendor.commissionDue)}</td>
                      <td className="px-4 py-3 tabular-nums">{money(vendor.unpaidAmount)}</td>
                      <td className="px-4 py-3 tabular-nums text-red-600">{money(vendor.overdueAmount)}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={vendor.status} />
                      </td>
                      <td className="px-4 py-3">
                        {vendor.unpaidCount > 0 ? (
                          <button
                            type="button"
                            disabled={busyId === vendor.vendorId}
                            onClick={() => handleMarkVendorPaid(vendor.vendorId, vendor.storeName)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-3 py-1.5 text-xs font-bold text-white disabled:opacity-60"
                          >
                            <CheckCircle2 size={13} />
                            Mark paid
                          </button>
                        ) : (
                          <span className="text-xs text-[var(--text-secondary)]">Settled</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredVendors.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-10 text-center text-sm text-[var(--text-secondary)]">
                        No vendor commissions match this filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-[var(--border)] bg-[var(--bg-main)] text-xs uppercase tracking-wide text-[var(--text-secondary)]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Order</th>
                    <th className="px-4 py-3 font-semibold">Vendor</th>
                    <th className="px-4 py-3 font-semibold">Sale</th>
                    <th className="px-4 py-3 font-semibold">Commission (2%)</th>
                    <th className="px-4 py-3 font-semibold">Due Date</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCommissions.map((item) => (
                    <tr key={item._id} className="border-b border-[var(--border)] last:border-0">
                      <td className="px-4 py-3">
                        <p className="font-semibold">#{String(item.order?._id || item.order).slice(-6).toUpperCase()}</p>
                        <p className="text-xs text-[var(--text-secondary)]">
                          {item.order?.paymentMethod || "—"} · {item.order?.status || "—"}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        {item.vendor?.storeName || item.vendor?.name || "Vendor"}
                      </td>
                      <td className="px-4 py-3 tabular-nums">{money(item.orderTotal)}</td>
                      <td className="px-4 py-3 tabular-nums font-semibold">{money(item.commissionAmount)}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">
                        {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={item.displayStatus} />
                      </td>
                      <td className="px-4 py-3">
                        {item.displayStatus === "paid" || item.status === "waived" ? (
                          <button
                            type="button"
                            disabled={busyId === item._id}
                            onClick={() => handleMarkUnpaid(item._id)}
                            className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:border-[var(--color-primary)]/40 disabled:opacity-60"
                          >
                            Mark unpaid
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={busyId === item._id}
                            onClick={() => handleMarkPaid(item._id)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-3 py-1.5 text-xs font-bold text-white disabled:opacity-60"
                          >
                            <CheckCircle2 size={13} />
                            Mark paid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredCommissions.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-sm text-[var(--text-secondary)]">
                        No commission records match this filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
