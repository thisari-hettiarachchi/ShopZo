import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Mail, ShieldCheck, User } from "lucide-react";
import api from "../services/api";
import PageHeader from "../components/shared/PageHeader";

function SkeletonProfile() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 rounded-2xl bg-[var(--border)]" />
        <div className="space-y-2">
          <div className="h-5 w-40 rounded bg-[var(--border)]" />
          <div className="h-3 w-28 rounded bg-[var(--border)]" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-[var(--border)]" />
        ))}
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value, tone }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]">
            {label}
          </p>
          <p className="mt-2 truncate text-lg font-black text-[var(--text-primary)]">{value}</p>
        </div>
        <div className={`rounded-xl bg-gradient-to-br ${tone} p-2.5 text-white`}>
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

export default function AdminProfilePage() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await api.get("/api/auth/me");
        setAdmin(data);
      } catch (requestError) {
        try {
          const cachedAdmin = JSON.parse(sessionStorage.getItem("admin"));
          setAdmin(cachedAdmin);
        } catch {
          setAdmin(null);
        }
        setError(
          requestError?.response?.data?.message || "Failed to load admin profile"
        );
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const name = admin?.name || "Admin User";
  const email = admin?.email || "admin@shopzo.com";
  const role = admin?.role || "admin";
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[var(--bg-main)] px-5 pb-10 pt-8 text-[var(--text-primary)] md:px-10 md:pb-12">
      <div className="mx-auto max-w-7xl">
        <PageHeader
          eyebrow="Account"
          title="Admin Profile"
          description="View your admin account details and access level."
          actions={
            <Link
              to="/profile/edit"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_28px_-18px_var(--shadow)] transition hover:opacity-90"
            >
              <Edit size={18} />
              Edit Profile
            </Link>
          }
        />

        {error && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {error} — showing cached data.
          </div>
        )}

        <div className="mb-6 flex flex-col gap-5 rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-[0_20px_50px_-34px_var(--shadow)] md:flex-row md:items-center md:justify-between md:p-6">
          {loading ? (
            <SkeletonProfile />
          ) : (
            <>
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-2xl font-bold text-white shadow-sm">
                  {initials}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-extrabold text-[var(--text-primary)]">{name}</h2>
                    <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold capitalize text-emerald-700">
                      <ShieldCheck size={12} />
                      {role}
                    </span>
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                    <Mail size={14} />
                    {email}
                  </p>
                </div>
              </div>

              <Link
                to="/profile/edit"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--bg-muted)]"
              >
                <Edit size={16} />
                Update details
              </Link>
            </>
          )}
        </div>

        {!loading && (
          <div className="grid gap-4 sm:grid-cols-3">
            <InfoCard
              label="Full Name"
              value={name}
              icon={User}
              tone="from-orange-500 to-amber-400"
            />
            <InfoCard
              label="Email"
              value={email}
              icon={Mail}
              tone="from-sky-500 to-cyan-400"
            />
            <InfoCard
              label="Role"
              value={role.charAt(0).toUpperCase() + role.slice(1)}
              icon={ShieldCheck}
              tone="from-slate-800 to-slate-600"
            />
          </div>
        )}
      </div>
    </div>
  );
}
