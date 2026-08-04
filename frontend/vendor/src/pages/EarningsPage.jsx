import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Loader,
  Wallet,
  TrendingUp,
  Clock3,
  BadgePercent,
  ShoppingBag,
} from "lucide-react";
import { getDashboardAnalytics, getVendorEarnings } from "../services/analyticsService";
import PageHeader from "../components/shared/PageHeader";

const currency = (value) => `Rs. ${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "-";

function StatCard({ title, value, icon: Icon, tone, hint }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]">
            {title}
          </p>
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
  const [earnings, setEarnings] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [earningsRes, analyticsRes] = await Promise.all([
          getVendorEarnings(),
          getDashboardAnalytics(),
        ]);
        setEarnings(earningsRes.data || null);
        setRevenueData(analyticsRes.data?.revenueData || []);
      } catch (error) {
        console.error("Failed to fetch finance data", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[var(--text-secondary)]">
        <Loader className="mr-2 animate-spin" /> Loading finance...
      </div>
    );
  }

  const summary = earnings?.summary || {};
  const earningsTrend = earnings?.earningsTrend || [];
  const recentOrders = earnings?.recentSettledOrders || [];
  const ratePct = Math.round((summary.commissionRate || 0.02) * 100);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] px-5 pb-10 pt-8 md:px-10 md:pb-12">
      <div className="mx-auto max-w-7xl">
        <PageHeader
          eyebrow="Revenue & Settlements"
          title="Finance"
          description="Sales analytics, platform commission (2%), and your net earnings in one place."
          meta={`${summary.settledOrderCount || 0} settled orders`}
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Net Earnings"
            value={currency(summary.netEarnings)}
            icon={Wallet}
            tone="from-emerald-500 to-teal-400"
            hint={`After ${ratePct}% platform commission`}
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
            icon={BadgePercent}
            tone="from-blue-500 to-indigo-500"
            hint={`${ratePct}% of settled sales owed to ShopZo`}
          />
          <StatCard
            title="Pending Settlement"
            value={currency(summary.pendingAmount)}
            icon={Clock3}
            tone="from-slate-900 to-slate-700"
            hint="Awaiting payment confirmation or delivery"
          />
        </div>

        {/* Commission callout */}
        <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]">
                Commission summary
              </p>
              <h3 className="mt-1 text-lg font-semibold text-[var(--text-primary)]">
                {ratePct}% platform fee on every settled sale
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-[var(--text-secondary)]">
                Commission is calculated when an order is paid (Stripe) or delivered (COD).
                Pay this amount to the admin according to your settlement schedule.
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-4 py-3 text-right">
              <p className="text-xs text-[var(--text-secondary)]">You keep</p>
              <p className="text-2xl font-black text-emerald-600">{100 - ratePct}%</p>
              <p className="text-xs text-[var(--text-secondary)]">of settled sales</p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-4 py-3">
              <p className="text-xs text-[var(--text-secondary)]">Gross settled</p>
              <p className="mt-1 text-lg font-bold">{currency(summary.grossSettled)}</p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-4 py-3">
              <p className="text-xs text-[var(--text-secondary)]">Commission ({ratePct}%)</p>
              <p className="mt-1 text-lg font-bold text-[var(--color-primary)]">
                {currency(summary.commission)}
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-4 py-3">
              <p className="text-xs text-[var(--text-secondary)]">Net to you</p>
              <p className="mt-1 text-lg font-bold text-emerald-600">
                {currency(summary.netEarnings)}
              </p>
            </div>
          </div>
        </div>

        {/* Charts: analytics sales + net earnings */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
            <div className="mb-4 flex items-center gap-2">
              <ShoppingBag size={18} className="text-[var(--color-primary)]" />
              <div>
                <h3 className="text-lg font-semibold">Sales Analytics</h3>
                <p className="text-xs text-[var(--text-secondary)]">Gross revenue · last 14 days</p>
              </div>
            </div>
            {revenueData.length === 0 ? (
              <p className="py-10 text-center text-sm text-[var(--text-secondary)]">
                Not enough sales data yet.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="var(--text-secondary)" />
                  <YAxis tick={{ fontSize: 11 }} stroke="var(--text-secondary)" />
                  <Tooltip
                    formatter={(value) => [currency(value), "Sales"]}
                    contentStyle={{
                      backgroundColor: "var(--bg-card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    fill="url(#salesFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
            <div className="mb-4 flex items-center gap-2">
              <Wallet size={18} className="text-emerald-600" />
              <div>
                <h3 className="text-lg font-semibold">Net Earnings</h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  After {ratePct}% commission · last 14 days
                </p>
              </div>
            </div>
            {earningsTrend.length === 0 ? (
              <p className="py-10 text-center text-sm text-[var(--text-secondary)]">
                No settled earnings yet.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={earningsTrend}>
                  <defs>
                    <linearGradient id="earningsFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="var(--text-secondary)" />
                  <YAxis tick={{ fontSize: 11 }} stroke="var(--text-secondary)" />
                  <Tooltip
                    formatter={(value) => [currency(value), "Net earnings"]}
                    contentStyle={{
                      backgroundColor: "var(--bg-card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="earnings"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#earningsFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Settled orders with commission breakdown */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]">
          <div className="p-6 pb-0">
            <h3 className="text-lg font-semibold">Recent Settled Orders</h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Order total, platform commission, and your net payout.
            </p>
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
                    <th className="px-6 py-3">Commission</th>
                    <th className="px-6 py-3">Net Payout</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => {
                    const commissionAmount = Number(
                      (
                        (order.total || 0) * (summary.commissionRate || 0.02)
                      ).toFixed(2)
                    );
                    return (
                      <tr key={order._id} className="border-t border-[var(--border)]">
                        <td className="px-6 py-3 font-medium">
                          #{String(order._id).slice(-6).toUpperCase()}
                        </td>
                        <td className="px-6 py-3 text-[var(--text-secondary)]">
                          {order.customer}
                        </td>
                        <td className="px-6 py-3 text-[var(--text-secondary)]">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-6 py-3">
                          <span className="inline-flex rounded-full bg-[var(--bg-muted)] px-2.5 py-1 text-xs font-semibold capitalize">
                            {order.paymentMethod}
                          </span>
                        </td>
                        <td className="px-6 py-3">{currency(order.total)}</td>
                        <td className="px-6 py-3 font-medium text-[var(--color-primary)]">
                          {currency(commissionAmount)}
                        </td>
                        <td className="px-6 py-3 font-semibold text-emerald-600">
                          {currency(order.netAmount)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
