import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Users,
  Star,
  Loader,
  AlertTriangle,
  TicketPercent,
} from "lucide-react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getDashboardAnalytics } from "../services/analyticsService";
import { getLowStockAlerts } from "../services/featureService";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await getDashboardAnalytics();
        setData(res.data);
        const lowStockRes = await getLowStockAlerts(10);
        setLowStockAlerts(lowStockRes.data?.alerts || []);
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen text-[var(--text-secondary)]">
        <Loader className="animate-spin mr-2" /> Loading dashboard...
      </div>
    );
  }

  const { stats, revenueData, categoryData, recentOrders } = data;

  const displayStats = [
    { title: "Sales", value: `$${stats.sales.toFixed(2)}`, change: "--", up: true, bg: "bg-yellow-100", icon: TrendingUp, iconColor: "text-yellow-500" },
    { title: "Orders", value: stats.orders, change: "--", up: true, bg: "bg-red-100", icon: ShoppingBag, iconColor: "text-red-500" },
    { title: "Customers", value: stats.customers, change: "--", up: true, bg: "bg-green-100", icon: Users, iconColor: "text-green-500" },
    { title: "Products", value: stats.products, change: "--", up: true, bg: "bg-blue-100", icon: Star, iconColor: "text-blue-500" },
    { title: "Active Coupons", value: stats.activeCoupons || 0, change: "--", up: true, bg: "bg-purple-100", icon: TicketPercent, iconColor: "text-purple-500" },
    { title: "Low Stock Alerts", value: stats.lowStock || 0, change: "--", up: false, bg: "bg-rose-100", icon: AlertTriangle, iconColor: "text-rose-500" },
    { title: "Avg Rating", value: stats.averageRating || 0, change: `${stats.totalReviews || 0} reviews`, up: true, bg: "bg-amber-100", icon: Star, iconColor: "text-amber-500" },
  ];

  return (
    <section className="bg-[var(--bg-main)] text-[var(--text-primary)] px-6 mt-10 pb-8 md:px-10 md:pt-1 md:pb-10">
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-5">
          {displayStats.map((stat, i) => (
            <div
              key={i}
              className="bg-[var(--bg-card)] p-6 rounded-3xl shadow-lg border border-[var(--border)] hover:shadow-2xl transition-all duration-200 group"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm text-[var(--text-secondary)] mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-extrabold mb-2 group-hover:text-[var(--color-primary)] transition-colors">{stat.value}</h3>
                  <div className="flex items-center gap-1">
                    {stat.up ? <TrendingUp size={14} className="text-green-600" /> : <TrendingDown size={14} className="text-red-600" />}
                    <span className={`text-xs font-medium ${stat.up ? "text-green-600" : "text-red-600"}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-2xl ${stat.bg} shadow-md group-hover:scale-110 transition-transform`}>
                  <stat.icon className={stat.iconColor} size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[var(--bg-card)] p-8 rounded-3xl shadow-lg border border-[var(--border)]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Category Distribution</h3>
              <button className="text-sm text-[var(--color-primary)] hover:underline">Details</button>
            </div>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {categoryData.map((cat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                  <span className="text-sm text-[var(--text-secondary)]">{cat.name}</span>
                  <span className="text-sm font-medium ml-auto">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[var(--bg-card)] p-8 rounded-3xl shadow-lg border border-[var(--border)]">
            <h3 className="text-lg font-semibold mb-4">Inventory Alerts</h3>
            {lowStockAlerts.length === 0 ? (
              <p className="text-sm text-[var(--text-secondary)]">No low-stock warnings. Great inventory health.</p>
            ) : (
              <div className="space-y-3">
                {lowStockAlerts.slice(0, 6).map((item) => (
                  <div key={item._id} className="rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-xs text-[var(--text-secondary)]">Stock: {item.stock}</p>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${item.severity === "critical" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>
                      {item.severity}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-[var(--bg-card)] p-8 rounded-3xl shadow-lg border border-[var(--border)]">
            <h3 className="text-lg font-semibold mb-6">Weekly Revenue</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="revenue" fill="#F59E0B" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-[var(--bg-card)] p-8 rounded-3xl shadow-lg border border-[var(--border)]">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentOrders.length === 0 ? (
                <p className="text-sm text-[var(--text-secondary)]">No recent orders found.</p>
              ) : recentOrders.map((order) => (
                <div key={order._id} className="flex items-start gap-3 pb-3 border-b border-[var(--border)] last:border-0 last:pb-0">
                  <div className="p-2 bg-[var(--bg-muted)] rounded-lg">
                    <ShoppingBag size={16} className="text-[var(--color-primary)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Order #{order._id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{order.user?.name || "Unknown Customer"}</p>
                  </div>
                  <span className="text-sm font-semibold">${order.total}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
