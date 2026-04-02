import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Assets from "../assets/assets";

export default function AuthPages() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@shopzo.com");
  const [password, setPassword] = useState("admin123");

  const onSubmit = (e) => {
    e.preventDefault();

    localStorage.setItem("adminToken", "demo-admin-token");
    localStorage.setItem(
      "admin",
      JSON.stringify({
        name: "ShopZo Admin",
        email,
      })
    );

    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] p-8 shadow-sm"
      >
        <div className="flex items-center justify-center gap-2 mb-6">
          <img src={Assets.logo} alt="ShopZo" className="h-8 w-auto" />
          <h1 className="text-2xl font-bold text-[var(--color-primary)]">Admin Login</h1>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-[var(--text-secondary)]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border)]"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-[var(--text-secondary)]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border)]"
            />
          </div>
        </div>

        <button className="mt-6 w-full px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white font-semibold">
          Sign In
        </button>
      </form>
    </div>
  );
}
