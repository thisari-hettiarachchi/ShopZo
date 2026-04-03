import { Link } from "react-router-dom";

export default function AdminProfilePage() {
  const admin = (() => {
    try {
      return JSON.parse(localStorage.getItem("admin"));
    } catch {
      return null;
    }
  })();

  return (
    <section className="px-6 md:px-10 pt-8 pb-10 bg-[var(--bg-main)] text-[var(--text-primary)] min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Profile</h1>
        <Link
          to="/profile/edit"
          className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white font-semibold"
        >
          Edit Profile
        </Link>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 space-y-2">
        <p><span className="font-semibold">Name:</span> {admin?.name || "Admin User"}</p>
        <p><span className="font-semibold">Email:</span> {admin?.email || "admin@shopzo.com"}</p>
        <p><span className="font-semibold">Role:</span> Super Admin</p>
      </div>
    </section>
  );
}
