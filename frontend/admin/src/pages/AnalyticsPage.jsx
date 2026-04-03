import { useEffect, useMemo, useState } from "react";
import { getAnalytics } from "../services/adminService";

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

  const maxRevenue = useMemo(() => {
    return Math.max(0, ...(analytics?.revenueData || []).map((point) => point.revenue || 0));
  }, [analytics]);

  return (
    <section className="px-6 md:px-10 pt-8 pb-10 bg-[var(--bg-main)] text-[var(--text-primary)] min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>

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
              <h2 className="mb-4 text-lg font-semibold">Revenue by Day</h2>
              <div className="space-y-3">
                {(analytics.revenueData || []).length === 0 ? (
                  <p className="text-sm text-[var(--text-secondary)]">No revenue data yet.</p>
                ) : (
                  analytics.revenueData.map((point) => (
                    <div key={point.day}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span>{point.day}</span>
                        <span className="text-[var(--text-secondary)]">${Number(point.revenue || 0).toFixed(2)}</span>
                      </div>
                      <div className="h-2 rounded-full bg-[var(--bg-main)]">
                        <div
                          className="h-2 rounded-full bg-[var(--color-primary)]"
                          style={{ width: `${maxRevenue ? ((point.revenue || 0) / maxRevenue) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
              <h2 className="mb-4 text-lg font-semibold">Category Mix</h2>
              <div className="space-y-3">
                {(analytics.categoryData || []).length === 0 ? (
                  <p className="text-sm text-[var(--text-secondary)]">No category data yet.</p>
                ) : (
                  analytics.categoryData.map((item) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="flex-1 text-sm">{item.name}</span>
                      <span className="text-sm text-[var(--text-secondary)]">{item.value}</span>
                    </div>
                  ))
                )}
              </div>
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
    </section>
  );
}
