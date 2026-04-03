import { useEffect, useMemo, useState } from "react";
import { BarChart3, ShoppingBag, Users, Package } from "lucide-react";
import api from "../services/api";

export default function Dashboard() {
  const [summary, setSummary] = useState({
    totalOrders: 0,
    activeProducts: 0,
    customers: 0,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await api.get("/api/admin/dashboard/summary");
        setSummary(data);
      } catch (requestError) {
        const message = requestError?.response?.data?.message || "Failed to load dashboard summary";
        setError(message);
      }
    };

    fetchSummary();
  }, []);

  const cards = useMemo(
    () => [
      { title: "Total Orders", value: summary.totalOrders.toLocaleString(), icon: ShoppingBag },
      { title: "Active Products", value: summary.activeProducts.toLocaleString(), icon: Package },
      { title: "Customers", value: summary.customers.toLocaleString(), icon: Users },
      { title: "Revenue", value: "Connected", icon: BarChart3 },
    ],
    [summary]
  );

  return (
    <section className="px-6 md:px-10 pt-8 pb-10 bg-[var(--bg-main)] text-[var(--text-primary)] min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Admin Overview</h1>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-[var(--text-secondary)]">{card.title}</p>
              <card.icon size={18} className="text-[var(--color-primary)]" />
            </div>
            <p className="mt-4 text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
