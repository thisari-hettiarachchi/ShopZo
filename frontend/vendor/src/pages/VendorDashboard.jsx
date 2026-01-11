import { useState } from "react";
import { ShoppingBag, Package, DollarSign, Users, LogOut } from "lucide-react";

export default function VendorDashboard() {
  const [active, setActive] = useState("overview");

  const stats = [
    { title: "Total Products", value: 128, icon: Package },
    { title: "Orders", value: 342, icon: ShoppingBag },
    { title: "Revenue", value: "$4,560", icon: DollarSign },
    { title: "Customers", value: 210, icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] font-[Poppins] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--bg-card)] border-r border-[var(--border)] p-6">
        <h1 className="text-2xl font-bold text-[var(--color-primary)] mb-8">Vendor Panel</h1>
        <nav className="space-y-4">
          {["overview", "products", "orders", "analytics", "settings"].map((item) => (
            <button
              key={item}
              onClick={() => setActive(item)}
              className={`w-full text-left px-4 py-2 rounded-lg capitalize transition ${
                active === item
                  ? "bg-[var(--bg-muted)] text-[var(--color-primary)]"
                  : "hover:bg-[var(--bg-hover)]"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
        <button className="mt-10 flex items-center gap-2 text-red-500 hover:opacity-80">
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold capitalize">{active}</h2>
          <button className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg shadow hover:opacity-90">
            + Add Product
          </button>
        </div>

        {/* Overview */}
        {active === "overview" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-[var(--bg-card)] p-6 rounded-2xl shadow border border-[var(--border)]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--text-secondary)]">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  </div>
                  <stat.icon className="text-[var(--color-primary)]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products */}
        {active === "products" && (
          <div className="bg-[var(--bg-card)] rounded-2xl p-6 shadow border border-[var(--border)]">
            <h3 className="text-xl font-semibold mb-4">Your Products</h3>
            <table className="w-full text-left">
              <thead className="text-[var(--text-secondary)]">
                <tr className="border-b border-[var(--border)]">
                  <th className="py-2">Product</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map((p) => (
                  <tr key={p} className="border-b border-[var(--border)]">
                    <td className="py-3">Product {p}</td>
                    <td>$120</td>
                    <td className="text-green-600">Active</td>
                    <td>
                      <button className="text-[var(--color-primary)] hover:underline">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Orders */}
        {active === "orders" && (
          <div className="bg-[var(--bg-card)] rounded-2xl p-6 shadow border border-[var(--border)]">
            <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
            <ul className="space-y-4">
              {[1012, 1013, 1014].map((id) => (
                <li
                  key={id}
                  className="flex justify-between items-center bg-[var(--bg-muted)] p-4 rounded-lg"
                >
                  <span>Order #{id}</span>
                  <span className="font-semibold">$250</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Analytics */}
        {active === "analytics" && (
          <div className="bg-[var(--bg-card)] rounded-2xl p-6 shadow border border-[var(--border)]">
            <h3 className="text-xl font-semibold mb-4">Sales Analytics</h3>
            <p className="text-[var(--text-secondary)]">
              Charts and graphs can be added here (Recharts / Chart.js).
            </p>
          </div>
        )}

        {/* Settings */}
        {active === "settings" && (
          <div className="bg-[var(--bg-card)] rounded-2xl p-6 shadow border border-[var(--border)] max-w-xl">
            <h3 className="text-xl font-semibold mb-4">Store Settings</h3>
            <label className="block mb-3">
              <span className="text-sm">Store Name</span>
              <input
                className="w-full mt-1 p-2 rounded-lg border border-[var(--border)] bg-transparent"
                placeholder="My Store"
              />
            </label>
            <button className="mt-4 bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg">
              Save Changes
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
