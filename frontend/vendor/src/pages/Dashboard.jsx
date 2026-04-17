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
  Bell,
  Send,
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
import { getLowStockAlerts, getVendorNotifications, sendApprovalRequest } from "../services/featureService";
import { getVendorProfile } from "../services/vendorService";
import { readVendorSession, saveVendorSession } from "../utils/authStorage";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [profile, setProfile] = useState(() => readVendorSession());
  const [notifications, setNotifications] = useState([]);
  const [requesting, setRequesting] = useState(false);

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

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        const res = await getVendorProfile();
        const vendor = res.data?.vendor;
        if (cancelled || !vendor) return;
        setProfile(vendor);
        saveVendorSession({ token: sessionStorage.getItem("token"), vendor });
      } catch {
        // Keep session fallback.
      }
    };

    const loadNotifications = async () => {
      try {
        const res = await getVendorNotifications();
        if (!cancelled) {
          setNotifications(Array.isArray(res.data) ? res.data : []);
        }
      } catch {
        if (!cancelled) setNotifications([]);
      }
    };

    loadProfile();
    loadNotifications();

    return () => {
      cancelled = true;
    };
  }, []);

  const accountStatus = String(profile?.accountStatus || profile?.stats?.status || (profile?.isApproved ? "approved" : "pending")).toLowerCase();
  const canAddProducts = accountStatus === "approved";
  const approvalRequest = profile?.approvalRequest || {};
  const formatRequestDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? "-"
      : date.toLocaleString([], { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const handleSendRequest = async () => {
    setRequesting(true);
    try {
      const message = window.prompt("Add a short note for your approval request:", "Please review my vendor account.") || "Please review my vendor account.";
      const res = await sendApprovalRequest({ message });
      if (res.data?.approvalRequest) {
        setProfile((prev) => ({
          ...(prev || {}),
          approvalRequest: res.data.approvalRequest,
          accountStatus: res.data.accountStatus || prev?.accountStatus || "pending",
        }));
      }
      alert("Approval request sent.");
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to send approval request");
    } finally {
      setRequesting(false);
    }
  };

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
  ];

  return (
    <section className="bg-[var(--bg-main)] text-[var(--text-primary)] px-6 mt-10 pb-8 md:px-10 md:pt-1 md:pb-10">
      <div className="space-y-8">
        <div className={`rounded-3xl border px-5 py-5 shadow-lg ${
          canAddProducts
            ? "border-emerald-500/40 bg-emerald-500/10"
            : "border-amber-500/40 bg-amber-500/10"
        }`}>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]">
                Vendor approval
              </p>
              <h2 className="mt-1 text-2xl font-extrabold">
                {canAddProducts
                  ? "Your store is approved"
                  : "Your store is waiting for approval"}
              </h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                {canAddProducts
                  ? "You can add and manage products now."
                  : "Product creation is disabled until an admin approves your request. You can send a reminder from here."}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  canAddProducts
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {accountStatus}
              </span>

              <button
                type="button"
                onClick={handleSendRequest}
                disabled={requesting}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={16} />
                {requesting ? "Sending..." : "Send approval request"}
              </button>
            </div>
          </div>

          <div className="my-5 border-t border-[var(--border)]" />

          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]">
                  Vendor request
                </p>
                <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">
                  Approval request status
                </h3>
              </div>

              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  String(approvalRequest.status || accountStatus).toLowerCase() === "approved"
                    ? "bg-emerald-100 text-emerald-700"
                    : String(approvalRequest.status || accountStatus).toLowerCase() === "rejected"
                    ? "bg-rose-100 text-rose-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {String(approvalRequest.status || accountStatus || "pending").toLowerCase()}
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-main)] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)]">
                  Requested at
                </p>
                <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">
                  {formatRequestDate(approvalRequest.requestedAt)}
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-main)] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)]">
                  Reviewed at
                </p>
                <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">
                  {formatRequestDate(approvalRequest.reviewedAt)}
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-main)] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)]">
                  Message
                </p>
                <p className="mt-1 text-sm font-semibold text-[var(--text-primary)] line-clamp-2">
                  {approvalRequest.message || "No request message yet."}
                </p>
              </div>
            </div>

            {approvalRequest.status === "pending" && (
              <p className="mt-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-[var(--text-primary)]">
                Your request is waiting for admin review. You can resend it from the button above if needed.
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
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

        <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-8 shadow-lg">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold">Vendor notifications</h3>
              <p className="text-sm text-[var(--text-secondary)]">Approval, rejection, suspension, and verification updates.</p>
            </div>
            <Bell className="text-[var(--text-secondary)]" size={18} />
          </div>

          {notifications.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)]">No notifications yet.</p>
          ) : (
            <div className="space-y-3">
              {notifications.slice(0, 5).map((item) => (
                <div key={item._id} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-main)] px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[var(--text-primary)]">{item.title}</p>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">{item.message}</p>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${item.isRead ? "bg-[var(--bg-muted)] text-[var(--text-secondary)]" : "bg-emerald-100 text-emerald-700"}`}>
                      {item.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
