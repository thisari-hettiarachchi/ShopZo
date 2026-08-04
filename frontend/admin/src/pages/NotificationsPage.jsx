import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  Bell,
  Clock3,
  Loader,
  ShoppingBag,
  Store,
} from "lucide-react";
import { getDashboardInsights } from "../services/adminService";
import PageHeader from "../components/shared/PageHeader";

const SEVERITY_STYLES = {
  info: "border-[var(--border)] bg-[var(--bg-main)]",
  warning: "border-amber-200 bg-amber-50/60",
  danger: "border-rose-200 bg-rose-50/60",
};

const formatDate = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const data = await getDashboardInsights();
      setNotifications(Array.isArray(data?.notifications) ? data.notifications : []);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
    const poll = setInterval(loadNotifications, 30000);
    return () => clearInterval(poll);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] px-5 pb-10 pt-8 text-[var(--text-primary)] md:px-10 md:pb-12">
      <div className="mx-auto max-w-7xl">
        <PageHeader
          eyebrow="Inbox"
          title="Notifications"
          description="New orders, vendor requests, and suspicious activity across the platform."
          meta={`${notifications.length} alerts`}
          actions={
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--bg-muted)]"
            >
              <ArrowLeft size={16} />
              Back to Profile
            </button>
          }
        />

        <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-[0_20px_50px_-34px_var(--shadow)] md:p-6">
          <div className="mb-5 flex items-center gap-2">
            <Bell size={18} className="text-[var(--color-primary)]" />
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Live feed</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-[var(--text-secondary)]">
              <Loader className="animate-spin" size={18} />
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <p className="py-12 text-center text-sm text-[var(--text-secondary)]">
              No live notifications yet.
            </p>
          ) : (
            <div className="space-y-3">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-2xl border px-4 py-3.5 ${SEVERITY_STYLES[item.severity] || SEVERITY_STYLES.info}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-xl bg-[var(--bg-card)] p-2 text-[var(--text-primary)] shadow-sm">
                      {item.type === "order" && <ShoppingBag size={16} />}
                      {item.type === "vendor-request" && <Store size={16} />}
                      {item.type === "suspicious-order" && <AlertTriangle size={16} />}
                      {!["order", "vendor-request", "suspicious-order"].includes(item.type) && (
                        <Bell size={16} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold text-[var(--text-primary)]">{item.title}</p>
                        <span className="inline-flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                          <Clock3 size={12} />
                          {formatDate(item.createdAt)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
