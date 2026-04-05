import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function SkeletonProfile() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="h-20 w-20 rounded-full bg-[var(--border)]" />
        <div className="space-y-2">
          <div className="h-5 w-40 rounded bg-[var(--border)]" />
          <div className="h-3 w-28 rounded bg-[var(--border)]" />
        </div>
      </div>
      {/* Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-[var(--border)]" />
        ))}
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg-main)] p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-secondary)]">
          {label}
        </p>
        <p className="mt-0.5 truncate text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

function Avatar({ name }) {
  const initials = (name || "A")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]/15 text-[var(--color-primary)] text-2xl font-bold ring-4 ring-[var(--color-primary)]/20">
      {initials}
      {/* Online dot */}
      <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-[var(--bg-card)] bg-emerald-400" />
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
        const { data } = await api.get("/api/admin/auth/me");
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

  return (
    <section className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] px-6 md:px-10 pt-8 pb-16">

      {/* ── Header ── */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-[var(--color-primary)] mb-1">
            Account
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Admin Profile</h1>
        </div>

        <Link
          to="/profile/edit"
          className="inline-flex items-center gap-2 self-start sm:self-auto px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-sm font-semibold shadow-lg shadow-[var(--color-primary)]/20 hover:opacity-90 active:scale-95 transition-all duration-150"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 1 1 3.182 3.182L7.5 19.213l-4.5 1.25 1.25-4.5L16.862 3.487z" />
          </svg>
          Edit Profile
        </Link>
      </div>

      {/* ── Warning banner (shows cached data notice) ── */}
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-400/30 bg-amber-500/10 p-4 text-sm text-amber-400">
          <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          </svg>
          <span>{error} — showing cached data.</span>
        </div>
      )}

      {/* ── Profile card ── */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 space-y-6">
        {loading ? (
          <SkeletonProfile />
        ) : (
          <>
            {/* ── Identity row ── */}
            <div className="flex items-center gap-5">
              <Avatar name={name} />
              <div>
                <h2 className="text-xl font-bold leading-tight">{name}</h2>
                <span className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-2.5 py-0.5 text-xs font-semibold capitalize text-[var(--color-primary)]">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-7 9a7 7 0 1 1 14 0H3z" clipRule="evenodd" />
                  </svg>
                  {role}
                </span>
              </div>
            </div>

            {/* ── Divider ── */}
            <div className="border-t border-[var(--border)]" />

            {/* ── Info grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoCard
                label="Full Name"
                value={name}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A8.966 8.966 0 0 1 12 15c2.21 0 4.232.797 5.879 2.104M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                  </svg>
                }
              />
              <InfoCard
                label="Email"
                value={email}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H4.5a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5H4.5a2.25 2.25 0 0 0-2.25 2.25m19.5 0-9.75 6.75L2.25 6.75" />
                  </svg>
                }
              />
              <InfoCard
                label="Role"
                value={role.charAt(0).toUpperCase() + role.slice(1)}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                }
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}