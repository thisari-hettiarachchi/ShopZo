import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { getAnalytics } from "../services/adminService";
import PageHeader from "../components/shared/PageHeader";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await getAnalytics();
        setAnalytics(data);
      } catch (requestError) {
        setError(requestError?.response?.data?.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  return (
    <section className="min-h-screen bg-[var(--bg-main)] px-5 pb-10 pt-8 text-[var(--text-primary)] md:px-10 md:pb-12">
      <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="Performance Insights"
        title="Analytics"
        description="Track sales, orders, customers, and category mix across the platform."
        meta={analytics ? `${analytics.stats?.orders || 0} orders` : undefined}
      />

      {error && <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div>}

      {loading || !analytics ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 text-[var(--text-secondary)]">
          Loading analytics...
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {[
              ["Sales", `$${Number(analytics.stats.sales || 0).toFixed(2)}`],
              ["Orders", analytics.stats.orders || 0],
              ["Customers", analytics.stats.customers || 0],
              ["Products", analytics.stats.products || 0],
              ["Vendors", analytics.stats.vendors || 0],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
                <p className="text-sm text-[var(--text-secondary)]">{label}</p>
                <p className="mt-2 text-2xl font-bold">{value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
              <h2 className="mb-4 text-lg font-semibold">Revenue - Last 14 Days</h2>
              {(analytics.revenueData || []).length === 0 ? (
                <p className="text-sm text-[var(--text-secondary)]">No revenue data yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={analytics.revenueData}>
                    <defs>
                      <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, "Revenue"]} />
                    <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2} fill="url(#revenueFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
              <h2 className="mb-4 text-lg font-semibold">Category Mix</h2>
              {(analytics.categoryData || []).length === 0 ? (
                <p className="text-sm text-[var(--text-secondary)]">No category data yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={analytics.categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={2}
                    >
                      {analytics.categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
            <h2 className="mb-4 text-lg font-semibold">Recent Orders</h2>
            <div className="space-y-3">
              {(analytics.recentOrders || []).length === 0 ? (
                <p className="text-sm text-[var(--text-secondary)]">No recent orders found.</p>
              ) : (
                analytics.recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--bg-main)] px-4 py-3">
                    <div>
                      <p className="font-medium">Order #{order._id.slice(-6).toUpperCase()}</p>
                      <p className="text-sm text-[var(--text-secondary)]">{order.user?.name || "Unknown customer"}</p>
                    </div>
                    <span className="font-semibold">${Number(order.total || 0).toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </section>
  );
}
