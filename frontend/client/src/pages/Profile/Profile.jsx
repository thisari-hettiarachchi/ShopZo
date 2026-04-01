import React, { useState, useEffect } from "react";
import { User, Mail, Lock, LogOut } from "lucide-react";
import { getUserProfile, updateUserProfile } from "../../services/userService";

export default function ProfilePage() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    accountType: "",
    password: "",
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getUserProfile();
        setUserData({
          name: res.data.name,
          email: res.data.email,
          accountType: res.data.role,
          password: "",
        });
      } catch (err) {
        alert(err.response?.data?.message || "Failed to fetch profile");
      }
    };

    fetchProfile();

    const handleWindowClose = () => {
      localStorage.removeItem("token");
    };
    window.addEventListener("beforeunload", handleWindowClose);

    return () => {
      window.removeEventListener("beforeunload", handleWindowClose);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const updateData = { ...userData };
      if (!updateData.password) delete updateData.password;
      const res = await updateUserProfile(updateData);
      setUserData({
        ...res.data.user,
        password: "",
        accountType: res.data.user.role,
      });
      alert(res.data.message);
      setEditMode(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] px-4 pb-10 pt-4 md:px-6">
      <div className="mx-auto w-full max-w-4xl rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[0_24px_60px_-36px_var(--shadow)] md:p-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]">
              Account Center
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-[var(--text-primary)]">Profile</h1>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-900 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        <div className="flex flex-col gap-8 md:flex-row md:items-start">
          <div className="flex-shrink-0">
            <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-[var(--border)] bg-[linear-gradient(145deg,var(--bg-muted),var(--bg-card))] text-6xl font-bold text-[var(--text-primary)] shadow-[0_18px_40px_-28px_var(--shadow)]">
              <span>{userData.name.charAt(0)}</span>
              <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.26),transparent_58%)]" />
            </div>
          </div>

          <div className="flex-1 w-full">
            {/* Name */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-semibold text-[var(--text-secondary)]">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-3 text-[var(--text-muted)]" />
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className="w-full rounded-xl border px-11 py-3 text-sm text-[var(--text-primary)] outline-none transition disabled:cursor-not-allowed disabled:opacity-80"
                  style={{
                    borderColor: editMode ? "var(--color-primary)" : "var(--border)",
                    backgroundColor: "var(--bg-main)",
                  }}
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-semibold text-[var(--text-secondary)]">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-3 text-[var(--text-muted)]" />
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className="w-full rounded-xl border px-11 py-3 text-sm text-[var(--text-primary)] outline-none transition disabled:cursor-not-allowed disabled:opacity-80"
                  style={{
                    borderColor: editMode ? "var(--color-primary)" : "var(--border)",
                    backgroundColor: "var(--bg-main)",
                  }}
                />
              </div>
            </div>


            {/* Password */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-semibold text-[var(--text-secondary)]">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3 text-[var(--text-muted)]" />
                <input
                  type="password"
                  name="password"
                  value={userData.password}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className="w-full rounded-xl border px-11 py-3 text-sm text-[var(--text-primary)] outline-none transition disabled:cursor-not-allowed disabled:opacity-80"
                  style={{
                    borderColor: editMode ? "var(--color-primary)" : "var(--border)",
                    backgroundColor: "var(--bg-main)",
                  }}
                />
              </div>
            </div>

            <div className="mb-5 rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-4 py-3 text-sm text-[var(--text-secondary)]">
              Account type: <span className="font-semibold capitalize text-[var(--text-primary)]">{userData.accountType || "customer"}</span>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              {editMode ? (
                <>
                  <button
                    onClick={handleSave}
                    className="rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-6 py-2.5 font-semibold text-white shadow-md transition hover:opacity-90"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="rounded-xl border border-[var(--border)] px-6 py-2.5 font-semibold text-[var(--text-primary)] transition hover:bg-[var(--bg-main)]"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-6 py-2.5 font-semibold text-white shadow-md transition hover:opacity-90"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
