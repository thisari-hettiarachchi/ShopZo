import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const existing = (() => {
    try {
      return JSON.parse(localStorage.getItem("admin")) || {};
    } catch {
      return {};
    }
  })();

  const [name, setName] = useState(existing.name || "Admin User");
  const [email, setEmail] = useState(existing.email || "admin@shopzo.com");

  const onSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("admin", JSON.stringify({ name, email }));
    navigate("/profile");
  };

  return (
    <section className="px-6 md:px-10 pt-8 pb-10 bg-[var(--bg-main)] text-[var(--text-primary)] min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>

      <form
        onSubmit={onSubmit}
        className="max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 space-y-4"
      >
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

        <button className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white font-semibold">
          Save Changes
        </button>
      </form>
    </section>
  );
}
