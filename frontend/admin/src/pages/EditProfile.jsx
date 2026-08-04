import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Save, User } from "lucide-react";
import { getAdminProfile, updateAdminProfile } from "../services/adminService";
import PageHeader from "../components/shared/PageHeader";

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--bg-main)] py-2.5 pl-10 pr-3 text-sm focus:border-[var(--color-primary)] focus:outline-none";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getAdminProfile();
        setName(data?.name || "Admin User");
        setEmail(data?.email || "admin@shopzo.com");
      } catch {
        try {
          const existing = JSON.parse(sessionStorage.getItem("admin")) || {};
          setName(existing.name || "Admin User");
          setEmail(existing.email || "admin@shopzo.com");
        } catch {
          setName("Admin User");
          setEmail("admin@shopzo.com");
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const updated = await updateAdminProfile({ name, email });
      sessionStorage.setItem("admin", JSON.stringify(updated));
      navigate("/profile");
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] px-5 pb-10 pt-8 text-[var(--text-primary)] md:px-10 md:pb-12">
      <div className="mx-auto max-w-7xl">
        <PageHeader
          eyebrow="Account"
          title="Edit Profile"
          description="Update your admin name and login email."
          actions={
            <>
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--bg-muted)]"
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <button
                type="submit"
                form="edit-admin-profile-form"
                disabled={saving || loading}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_28px_-18px_var(--shadow)] transition hover:opacity-90 disabled:opacity-50"
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </>
          }
        />

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form
          id="edit-admin-profile-form"
          onSubmit={onSubmit}
          className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-[0_20px_50px_-34px_var(--shadow)] md:p-6"
        >
          {loading ? (
            <p className="text-sm text-[var(--text-secondary)]">Loading profile...</p>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Name</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClass}
                      placeholder="Admin name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Email</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClass}
                      placeholder="admin@shopzo.com"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-[var(--border)] pt-6">
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium transition hover:bg-[var(--bg-muted)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_28px_-18px_var(--shadow)] transition hover:opacity-90 disabled:opacity-60"
                >
                  <Save size={18} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
