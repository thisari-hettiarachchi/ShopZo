import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  Lock,
  LogOut,
  Pencil,
  Shield,
  Eye,
  EyeOff,
  Check,
  X,
} from "lucide-react";
import { getUserProfile, updateUserProfile } from "../../../services/userService";
import ProfileSectionHeader from "./ProfileSectionHeader";

export default function ProfilePage() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    accountType: "",
    password: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [snapshot, setSnapshot] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getUserProfile();
        const next = {
          name: res.data.name || "",
          email: res.data.email || "",
          accountType: res.data.role || "customer",
          password: "",
        };
        setUserData(next);
        setSnapshot(next);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    if (snapshot) {
      setUserData({ ...snapshot, password: "" });
    }
    setEditMode(false);
    setShowPassword(false);
  };

  const handleSave = async () => {
    if (!userData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!userData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    setSaving(true);
    try {
      const updateData = {
        name: userData.name.trim(),
        email: userData.email.trim(),
      };
      if (userData.password) updateData.password = userData.password;

      const res = await updateUserProfile(updateData);
      const next = {
        name: res.data.user.name,
        email: res.data.user.email,
        accountType: res.data.user.role,
        password: "",
      };
      setUserData(next);
      setSnapshot(next);
      toast.success(res.data.message || "Profile updated");
      setEditMode(false);
      setShowPassword(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth";
  };

  const initials = (userData.name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] shadow-[0_24px_60px_-36px_var(--shadow)]">
        <p className="text-sm text-[var(--text-muted)]">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProfileSectionHeader
        icon={User}
        eyebrow="Account Center"
        title="My Profile"
        description="Update your personal details and sign-in credentials."
        actions={
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2.5 text-sm font-semibold text-[var(--text-secondary)] transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-500"
          >
            <LogOut size={16} />
            Logout
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        {/* Identity card */}
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[0_24px_60px_-36px_var(--shadow)] backdrop-blur-xl">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div
                className="absolute -inset-1 rounded-full opacity-90"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-primary), var(--color-secondary), var(--color-accent))",
                }}
              />
              <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-[var(--bg-card)] bg-[linear-gradient(145deg,var(--bg-muted),var(--bg-elevated))] text-3xl font-bold text-[var(--text-primary)] shadow-[0_18px_40px_-28px_var(--shadow)]">
                <span>{initials}</span>
                <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.28),transparent_58%)]" />
              </div>
            </div>

            <h2
              className="text-xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              {userData.name || "Your name"}
            </h2>
            <p className="mt-1 break-all text-sm text-[var(--text-muted)]">{userData.email}</p>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-main)] px-3 py-1.5 text-xs font-semibold capitalize text-[var(--text-secondary)]">
              <Shield size={13} className="text-[var(--color-primary)]" />
              {userData.accountType || "customer"}
            </div>
          </div>

          <div className="mt-6 space-y-3 border-t border-[var(--border)] pt-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--text-muted)]">Status</span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Active
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--text-muted)]">Mode</span>
              <span className="font-semibold text-[var(--text-primary)]">
                {editMode ? "Editing" : "Viewing"}
              </span>
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[0_24px_60px_-36px_var(--shadow)] backdrop-blur-xl md:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-5">
            <div>
              <h3
                className="text-xl font-semibold text-[var(--text-primary)]"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                Personal information
              </h3>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                {editMode
                  ? "Make your changes, then save when you're ready."
                  : "These details are used across checkout and order updates."}
              </p>
            </div>

            {!editMode && (
              <button
                type="button"
                onClick={() => setEditMode(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_-14px_rgba(249,115,22,0.55)] transition hover:opacity-90"
              >
                <Pencil size={15} />
                Edit Profile
              </button>
            )}
          </div>

          <div className="space-y-4">
            <Field
              label="Full Name"
              icon={User}
              name="name"
              type="text"
              value={userData.name}
              onChange={handleInputChange}
              disabled={!editMode}
              placeholder="Your full name"
            />

            <Field
              label="Email"
              icon={Mail}
              name="email"
              type="email"
              value={userData.email}
              onChange={handleInputChange}
              disabled={!editMode}
              placeholder="you@example.com"
            />

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[var(--text-secondary)]">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={userData.password}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  placeholder={editMode ? "Enter a new password (optional)" : "••••••••"}
                  className="w-full rounded-xl border bg-[var(--bg-main)] py-3 pl-11 pr-12 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] disabled:cursor-not-allowed disabled:opacity-75"
                  style={{
                    borderColor: editMode ? "var(--color-primary)" : "var(--border)",
                    boxShadow: editMode ? "var(--ring)" : "none",
                  }}
                />
                {editMode && (
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[var(--text-muted)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--color-primary)]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                )}
              </div>
              {editMode && (
                <p className="mt-1.5 text-xs text-[var(--text-muted)]">
                  Leave blank to keep your current password.
                </p>
              )}
            </div>
          </div>

          {editMode && (
            <div className="mt-7 flex flex-wrap gap-3 border-t border-[var(--border)] pt-6">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_-14px_rgba(249,115,22,0.55)] transition hover:opacity-90 disabled:opacity-60"
              >
                <Check size={16} />
                {saving ? "Saving..." : "Save changes"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--bg-main)] disabled:opacity-60"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, name, type, value, onChange, disabled, placeholder }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-[var(--text-secondary)]">
        {label}
      </label>
      <div className="relative">
        <Icon
          size={18}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
        />
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full rounded-xl border bg-[var(--bg-main)] py-3 pl-11 pr-4 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] disabled:cursor-not-allowed disabled:opacity-75"
          style={{
            borderColor: disabled ? "var(--border)" : "var(--color-primary)",
            boxShadow: disabled ? "none" : "var(--ring)",
          }}
        />
      </div>
    </div>
  );
}
