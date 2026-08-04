import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, CheckCircle2, Loader } from "lucide-react";
import { getVendorNotifications, markVendorNotificationRead } from "../services/featureService";
import PageHeader from "../components/shared/PageHeader";

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

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications]
  );

  const loadNotifications = async () => {
    try {
      const res = await getVendorNotifications();
      setNotifications(Array.isArray(res.data) ? res.data : []);
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

  const markOneRead = async (notificationId) => {
    try {
      await markVendorNotificationRead(notificationId);
      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notificationId ? { ...item, isRead: true } : item
        )
      );
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] px-5 pb-10 pt-8 md:px-10 md:pb-12">
      <div className="mx-auto max-w-7xl">
        <PageHeader
          eyebrow="Inbox"
          title="Notifications"
          description="Approval, rejection, suspension, and verification updates for your store."
          meta={`${unreadCount} unread`}
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
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">All updates</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-[var(--text-secondary)]">
              <Loader className="animate-spin" size={18} />
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <p className="py-12 text-center text-sm text-[var(--text-secondary)]">
              No notifications yet.
            </p>
          ) : (
            <div className="space-y-3">
              {notifications.map((item) => (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => !item.isRead && markOneRead(item._id)}
                  className={`w-full rounded-2xl border px-4 py-3.5 text-left transition ${
                    item.isRead
                      ? "border-[var(--border)] bg-[var(--bg-main)] opacity-80"
                      : "border-[var(--color-primary)]/40 bg-[var(--bg-main)] hover:border-[var(--color-primary)]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-[var(--text-primary)]">{item.title}</p>
                        <span className="rounded-xl bg-[var(--bg-muted)] px-2 py-0.5 text-[10px] font-semibold capitalize text-[var(--text-secondary)]">
                          {item.type || "update"}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">{item.message}</p>
                      <p className="mt-2 text-xs text-[var(--text-secondary)]">{formatDate(item.createdAt)}</p>
                    </div>
                    {item.isRead ? (
                      <CheckCircle2 size={18} className="shrink-0 text-emerald-500" />
                    ) : (
                      <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
