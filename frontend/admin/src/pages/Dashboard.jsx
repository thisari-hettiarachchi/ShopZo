import { BarChart3, ShoppingBag, Users, Package } from "lucide-react";

const cards = [
  { title: "Total Orders", value: "1,248", icon: ShoppingBag },
  { title: "Active Products", value: "318", icon: Package },
  { title: "Customers", value: "4,902", icon: Users },
  { title: "Revenue", value: "Rs. 1.2M", icon: BarChart3 },
];

export default function Dashboard() {
  return (
    <section className="px-6 md:px-10 pt-8 pb-10 bg-[var(--bg-main)] text-[var(--text-primary)] min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Admin Overview</h1>

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
