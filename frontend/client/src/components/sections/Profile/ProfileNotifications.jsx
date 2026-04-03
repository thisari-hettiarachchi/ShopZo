import React, { useEffect, useMemo, useState } from "react";
import { Bell, CheckCircle2 } from "lucide-react";
import { API_BASE_URL, authHeaders } from "../../../api/base";

export default function ProfileNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications]
  );

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/user/notifications`, {
          headers: authHeaders(),
        });

        if (!res.ok) {
          throw new Error(`Failed to load notifications (${res.status})`);
        }

        const data = await res.json();
        setNotifications(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Notification load error:", error);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const markOneRead = async (notificationId) => {
    if (String(notificationId).startsWith("discount-")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/user/notifications/${notificationId}/read`, {
        method: "PATCH",
        headers: authHeaders(),
      });

      if (!res.ok) return;

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notificationId ? { ...item, isRead: true } : item
        )
      );
    } catch (error) {
      console.error("Mark read error:", error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      setClearing(true);
      const res = await fetch(`${API_BASE_URL}/user/notifications/clear`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      if (!res.ok) {
        throw new Error(`Failed to clear notifications (${res.status})`);
      }

      // Keep only synthetic discount notifications; DB-backed items are cleared.
      setNotifications((prev) => prev.filter((item) => String(item._id).startsWith("discount-")));
    } catch (error) {
      console.error("Clear notifications error:", error);
    } finally {
      setClearing(false);
    }
  };

  return (
    <div
      className="p-6 rounded-2xl shadow-2xl"
      style={{
        backgroundColor: "var(--bg-card)",
        boxShadow: "0 10px 40px var(--shadow)",
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell className="text-[var(--color-primary)]" size={22} />
          <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            My Notifications
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Unread: {unreadCount}
          </span>
          <button
            onClick={clearAllNotifications}
            disabled={clearing || notifications.length === 0}
            className="px-3 py-1.5 rounded-lg border border-[var(--border)] text-sm font-medium hover:bg-[var(--bg-muted)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {clearing ? "Clearing..." : "Clear All"}
          </button>
        </div>
      </div>

      {loading ? (
        <p style={{ color: "var(--text-secondary)" }}>Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p style={{ color: "var(--text-secondary)" }}>No notifications yet.</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((item) => (
            <button
              key={item._id}
              onClick={() => markOneRead(item._id)}
              className={`w-full text-left p-4 rounded-xl border-2 transition ${
                item.isRead
                  ? "border-[var(--border)] opacity-80"
                  : "border-[var(--color-primary)]"
              }`}
              style={{ backgroundColor: "var(--bg-muted)" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
                    {item.title}
                  </p>
                  <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                    {item.message}
                  </p>
                </div>
                {item.isRead && <CheckCircle2 size={18} className="text-green-500" />}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
