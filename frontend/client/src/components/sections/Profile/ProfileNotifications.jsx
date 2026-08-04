import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Bell, CheckCircle2 } from "lucide-react";
import { API_BASE_URL, authHeaders } from "../../../api/base";
import { useNavigate } from "react-router-dom";
import ProfileSectionHeader from "./ProfileSectionHeader";

export default function ProfileNotifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications]
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to continue");
      navigate("/auth");
      return;
    }

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

    // Load notifications immediately
    loadNotifications();

    // Set up polling to refresh notifications every 30 seconds
    const pollInterval = setInterval(loadNotifications, 30000);

    // Cleanup interval on unmount
    return () => clearInterval(pollInterval);
  }, [navigate]);

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
    <div className="space-y-6">
      <ProfileSectionHeader
        icon={Bell}
        eyebrow="Communication"
        title="My Notifications"
        description="Alerts and updates about your account and orders."
        actions={
          <>
            <span className="text-sm font-medium text-[var(--text-secondary)]">
              Unread: {unreadCount}
            </span>
            <button
              type="button"
              onClick={clearAllNotifications}
              disabled={clearing || notifications.length === 0}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2.5 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--bg-muted)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {clearing ? "Clearing..." : "Clear All"}
            </button>
          </>
        }
      />

      {loading ? (
        <p className="text-sm text-[var(--text-muted)]">Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] py-16 text-center shadow-[0_24px_60px_-36px_var(--shadow)]">
          <p className="text-[var(--text-secondary)]">No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-3 rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[0_24px_60px_-36px_var(--shadow)] backdrop-blur-xl">
          {notifications.map((item) => (
            <button
              key={item._id}
              type="button"
              onClick={() => markOneRead(item._id)}
              className={`w-full rounded-xl border-2 p-4 text-left transition ${
                item.isRead
                  ? "border-[var(--border)] opacity-80"
                  : "border-[var(--color-primary)]"
              }`}
              style={{ backgroundColor: "var(--bg-muted)" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">{item.title}</p>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">{item.message}</p>
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
