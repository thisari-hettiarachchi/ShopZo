import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Moon,
  Sun,
  BarChart3,
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  Star,
  Settings,
  LogOut,
} from "lucide-react";
import Assets from '../../assets/assets'

export default function Sidebar({ active }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });
  const navigate = useNavigate();

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const admin = (() => {
    try {
      return JSON.parse(localStorage.getItem("admin"));
    } catch {
      return null;
    }
  })();
  const initials = admin?.name
    ? admin.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "A";

    return (
      <aside className="w-64 h-screen fixed top-0 left-0 bg-[var(--bg-card)] border-r border-[var(--border)] p-6 flex flex-col z-40">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <img src={Assets.logo} alt="ShopZo" className="h-8 w-auto" />
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-[var(--color-primary)]">ShopZo</h1>
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        {[
          { id: "overview", label: "Overview", icon: BarChart3, path: "/" },
          { id: "products", label: "Products", icon: Package, path: "/products" },
          { id: "orders", label: "Orders", icon: ShoppingBag, path: "/orders" },
          { id: "customers", label: "Customers", icon: Users, path: "/customers" },
          { id: "analytics", label: "Analytics", icon: TrendingUp, path: "/analytics" },
          { id: "reviews", label: "Reviews", icon: Star, path: "/reviews" },
          { id: "profile", label: "Profile", icon: Settings, path: "/profile" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              navigate(item.path);
            }}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${
              active === item.id
                ? "bg-[var(--bg-muted)] text-[var(--color-primary)] font-medium"
                : "hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]"
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Profile & Logout */}
      <div className="mt-auto pt-6 border-t border-[var(--border)]">
        <button
          type="button"
          onClick={() => {
            navigate("/profile");
          }}
          className="w-full flex items-center gap-3 mb-4 p-3 rounded-lg bg-[var(--bg-muted)] hover:bg-[var(--bg-hover)] transition"
        >
          <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-bold">
            {initials}
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium text-sm">{admin?.name || "Admin User"}</p>
            <p className="text-xs text-[var(--text-secondary)]">{admin?.email || "admin@shopzo.com"}</p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem("adminToken");
            localStorage.removeItem("admin");
            localStorage.removeItem("token");
            navigate("/auth");
          }}
          className="w-full flex items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-lg transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}
