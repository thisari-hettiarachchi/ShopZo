import { useState } from "react";
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

export default function Sidebar({ active, setActive }) {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <aside className="w-64 h-screen sticky top-0 bg-[var(--bg-card)] border-r border-[var(--border)] p-6 flex flex-col mt-[-60px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-primary)]">VendorHub</h1>
        <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-[var(--bg-muted)] transition">
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        {[
          { id: "overview", label: "Overview", icon: BarChart3 },
          { id: "products", label: "Products", icon: Package },
          { id: "orders", label: "Orders", icon: ShoppingBag },
          { id: "customers", label: "Customers", icon: Users },
          { id: "analytics", label: "Analytics", icon: TrendingUp },
          { id: "reviews", label: "Reviews", icon: Star },
          { id: "settings", label: "Settings", icon: Settings },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
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
        <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-[var(--bg-muted)]">
          <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-bold">
            JD
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">John's Store</p>
            <p className="text-xs text-[var(--text-secondary)]">Vendor</p>
          </div>
        </div>
        <button className="w-full flex items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-lg transition">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}
