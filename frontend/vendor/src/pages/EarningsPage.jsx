import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Loader, Wallet, TrendingUp, Clock3, PercentCircle } from "lucide-react";
import { getVendorEarnings } from "../services/analyticsService";
import PageHeader from "../components/shared/PageHeader";

const currency = (value) => `$${Number(value || 0).toFixed(2)}`;
const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "-";

function StatCard({ title, value, icon: Icon, tone, hint }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]">{title}</p>
          <p className="mt-2 text-2xl font-black text-[var(--text-primary)]">{value}</p>
          {hint && <p className="mt-1 text-xs text-[var(--text-secondary)]">{hint}</p>}
        </div>
        <div className={`rounded-xl bg-gradient-to-br ${tone} p-2.5 text-white`}>
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

export default function EarningsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEarnings = async () => {
      try {
        const res = await getVendorEarnings();
        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch earnings", error);
      } finally {
        setLoading(false);
      }
    };
    loadEarnings();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-[var(--text-secondary)]">
        <Loader className="animate-spin mr-2" /> Loading earnings...
      </div>
    );
  }

  const summary = data?.summary || {};
  const trend = data?.earningsTrend || [];
  const recentOrders = data?.recentSettledOrders || [];

  return (
    <div className="min-h-screen bg-[var(--bg-main)] px-5 pb-10 pt-8 md:px-10 md:pb-12">
      <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="Payouts & Settlements"
        title="Earnings"
        description="Track settled sales, platform commission, and your net payout."
        meta={`${summary.settledOrderCount || 0} settled orders`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Net Earnings"
          value={currency(summary.netEarnings)}
          icon={Wallet}
          tone="from-emerald-500 to-teal-400"
          hint={`After ${Math.round((summary.commissionRate || 0) * 100)}% platform commission`}
        />
        <StatCard
          title="Gross Settled Sales"
          value={currency(summary.grossSettled)}
          icon={TrendingUp}
          tone="from-orange-500 to-amber-400"
          hint={`${summary.settledOrderCount || 0} settled orders`}
        />
        <StatCard
          title="Platform Commission"
          value={currency(summary.commission)}
          icon={PercentCircle}
          tone="from-blue-500 to-indigo-500"
        />
        <StatCard
          title="Pending Settlement"
          value={currency(summary.pendingAmount)}
          icon={Clock3}
          tone="from-slate-900 to-slate-700"
          hint="Awaiting payment confirmation or delivery"
        />
      </div>

      <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
        <h3 className="mb-4 text-lg font-semibold">Net Earnings - Last 14 Days</h3>
        {trend.length === 0 ? (
          <p className="text-sm text-[var(--text-secondary)]">No settled earnings yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="earningsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => [currency(value), "Net earnings"]} />
              <Area type="monotone" dataKey="earnings" stroke="#10b981" strokeWidth={2} fill="url(#earningsFill)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
        <div className="p-6 pb-0">
          <h3 className="text-lg font-semibold">Recent Settled Orders</h3>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">Payout breakdown for your most recently settled orders.</p>
        </div>
        {recentOrders.length === 0 ? (
          <p className="p-6 text-sm text-[var(--text-secondary)]">No settled orders yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-t border-[var(--border)] text-left text-xs uppercase tracking-[0.1em] text-[var(--text-secondary)]">
                  <th className="px-6 py-3">Order</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Payment</th>
                  <th className="px-6 py-3">Order Total</th>
                  <th className="px-6 py-3">Net Payout</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-t border-[var(--border)]">
                    <td className="px-6 py-3 font-medium">#{String(order._id).slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-3 text-[var(--text-secondary)]">{order.customer}</td>
                    <td className="px-6 py-3 text-[var(--text-secondary)]">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-3">
                      <span className="inline-flex rounded-full bg-[var(--bg-muted)] px-2.5 py-1 text-xs font-semibold capitalize">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-3">{currency(order.total)}</td>
                    <td className="px-6 py-3 font-semibold text-emerald-600">{currency(order.netAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
