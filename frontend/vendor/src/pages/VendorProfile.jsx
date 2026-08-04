import { useEffect, useMemo, useState } from "react";
import {
  Phone,
  MapPin,
  Edit,
  Package,
  Star,
  MessageSquare,
  Users,
  ShieldCheck,
  Mail,
  Bell,
} from "lucide-react";
import { getVendorProfile } from "../services/vendorService";
import { useNavigate } from "react-router-dom";
import { getVendorToken, readVendorSession, saveVendorSession } from "../utils/authStorage";
import { getVendorNotifications } from "../services/featureService";

const STORAGE_KEY = "vendorProfile";

const safeParseJson = (value) => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

function StatCard({ title, value, icon: Icon, tone }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]">
            {title}
          </p>
          <p className="mt-2 text-2xl font-black text-[var(--text-primary)]">{value}</p>
        </div>
        <div className={`rounded-xl bg-gradient-to-br ${tone} p-2.5 text-white`}>
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

export default function VendorProfilePage() {
  const navigate = useNavigate();

  const initialProfile = useMemo(() => {
    const stored = safeParseJson(localStorage.getItem(STORAGE_KEY));
    const vendor = readVendorSession();

    return {
      storeName: stored?.storeName || vendor?.storeName || "John's Store",
      email: stored?.email || vendor?.email || "vendor@email.com",
      phone: stored?.phone || "",
      address: stored?.address || "",
      description: stored?.description || "",
      profileImage: stored?.profileImage || vendor?.profileImage || "",
      isApproved: Boolean(stored?.isApproved ?? vendor?.isApproved),
      joined: stored?.joined || vendor?.joined || "",
      stats: stored?.stats || vendor?.stats || { products: 0, rating: 0, reviews: 0, followers: 0, status: "Pending" },
    };
  }, []);

  const [profile, setProfile] = useState(initialProfile);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const token = getVendorToken();
    if (!token) return;

    let cancelled = false;
    getVendorProfile()
      .then((res) => {
        if (cancelled) return;
        const vendor = res.data?.vendor;
        if (!vendor) return;
        setProfile({
          storeName: vendor.storeName || "",
          email: vendor.email || "",
          phone: vendor.phone || "",
          address: vendor.address || "",
          description: vendor.description || "",
          profileImage: vendor.profileImage || "",
          isApproved: Boolean(vendor.isApproved),
          joined: vendor.joined || "",
          stats: vendor.stats || { products: 0, rating: 0, reviews: 0, followers: 0, status: "Pending" },
        });
        saveVendorSession({ token, vendor });
      })
      .catch(() => {
      });

    getVendorNotifications()
      .then((res) => {
        if (cancelled) return;
        const list = Array.isArray(res.data) ? res.data : [];
        setUnreadCount(list.filter((item) => !item.isRead).length);
      })
      .catch(() => {
        if (!cancelled) setUnreadCount(0);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const initials = useMemo(() => {
    const words = (profile.storeName || "V").trim().split(/\s+/).filter(Boolean);
    const first = words[0]?.[0] || "V";
    const second = words[1]?.[0] || "";
    return (first + second).toUpperCase();
  }, [profile.storeName]);

  const memberSince = profile.joined
    ? new Date(profile.joined).toLocaleDateString("en-US", { year: "numeric", month: "long" })
    : null;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] px-5 pb-10 pt-8 md:px-10 md:pb-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-[0_20px_50px_-34px_var(--shadow)] md:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]">
                Vendor Identity
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-[var(--color-primary)]">Store Profile</h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                View your store details and public appearance.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/notifications")}
              className="relative inline-flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-main)] p-2.5 text-[var(--text-secondary)] transition hover:bg-[var(--bg-muted)] hover:text-[var(--color-primary)]"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-5 rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-[0_20px_50px_-34px_var(--shadow)] md:flex-row md:items-center md:justify-between md:p-6">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-main)] shadow-sm">
              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={profile.storeName || "Vendor"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-2xl font-bold text-white">
                  {initials}
                </div>
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">
                  {profile.storeName || "Vendor"}
                </h1>
                <span
                  className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-[11px] font-semibold ${
                    profile.isApproved
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  <ShieldCheck size={12} />
                  {profile.isApproved ? "Approved" : "Pending Approval"}
                </span>
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                <Mail size={14} />
                {profile.email || "No email"}
              </p>
              <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                {memberSince ? `Member since ${memberSince}` : "Member since —"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/profile/edit")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_28px_-18px_var(--shadow)] transition hover:opacity-90"
          >
            <Edit size={18} />
            Edit Profile
          </button>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            title="Products"
            value={Number(profile.stats?.products || 0)}
            icon={Package}
            tone="from-orange-500 to-amber-400"
          />
          <StatCard
            title="Rating"
            value={`${Number(profile.stats?.rating || 0).toFixed(1)}★`}
            icon={Star}
            tone="from-amber-500 to-yellow-400"
          />
          <StatCard
            title="Reviews"
            value={Number(profile.stats?.reviews || 0)}
            icon={MessageSquare}
            tone="from-sky-500 to-cyan-400"
          />
          <StatCard
            title="Followers"
            value={Number(profile.stats?.followers || 0)}
            icon={Users}
            tone="from-emerald-500 to-teal-400"
          />
          <StatCard
            title="Status"
            value={profile.stats?.status || "Pending"}
            icon={ShieldCheck}
            tone="from-slate-800 to-slate-600"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-[0_16px_44px_-32px_var(--shadow)] md:p-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]">
              Contact Information
            </h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-main)] p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--bg-muted)]">
                  <Phone size={18} className="text-[var(--color-primary)]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--text-secondary)]">Phone Number</p>
                  <p className="mt-0.5 text-sm font-semibold text-[var(--text-primary)]">
                    {profile.phone || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-main)] p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--bg-muted)]">
                  <MapPin size={18} className="text-[var(--color-primary)]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--text-secondary)]">Address</p>
                  <p className="mt-0.5 text-sm font-semibold text-[var(--text-primary)]">
                    {profile.address || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-main)] p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--bg-muted)]">
                  <Mail size={18} className="text-[var(--color-primary)]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--text-secondary)]">Email</p>
                  <p className="mt-0.5 text-sm font-semibold text-[var(--text-primary)]">
                    {profile.email || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-[0_16px_44px_-32px_var(--shadow)] md:p-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]">
              About the Store
            </h3>
            <div className="mt-4 min-h-[180px] rounded-2xl border border-[var(--border)] bg-[var(--bg-main)] p-5">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-primary)]">
                {profile.description || "No description provided."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
