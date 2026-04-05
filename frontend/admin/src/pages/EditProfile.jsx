import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminProfile, updateAdminProfile } from "../services/adminService";

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
    <section className="px-6 md:px-10 pt-8 pb-10 bg-[var(--bg-main)] text-[var(--text-primary)] min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>

      {error && <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div>}

      <form
        onSubmit={onSubmit}
        className="max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 space-y-4"
      >
        {loading ? (
          <p className="text-[var(--text-secondary)]">Loading profile...</p>
        ) : (
          <>
            <div>
              <label className="block text-sm mb-1 text-[var(--text-secondary)]">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border)]"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-[var(--text-secondary)]">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border)]"
              />
            </div>

            <button disabled={saving} className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white font-semibold disabled:opacity-60">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </>
        )}
      </form>
    </section>
  );
}
