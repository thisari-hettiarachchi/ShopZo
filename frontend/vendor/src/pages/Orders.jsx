import { ShoppingBag } from "lucide-react";

const sampleOrders = [
  { id: 101, customer: "Alice", amount: 250, status: "Delivered" },
  { id: 102, customer: "Bob", amount: 120, status: "Pending" },
  { id: 103, customer: "Charlie", amount: 300, status: "Delivered" },
  { id: 104, customer: "Diana", amount: 180, status: "Cancelled" },
  { id: 105, customer: "Ethan", amount: 75, status: "Pending" },
];

export default function OrdersPage() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Orders</h2>
      <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border)] overflow-hidden">
        {sampleOrders.map((order) => (
          <div key={order.id} className="flex items-center justify-between p-4 border-b border-[var(--border)] last:border-b-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[var(--bg-muted)] rounded-lg">
                <ShoppingBag size={20} className="text-[var(--color-primary)]" />
              </div>
              <div>
                <p className="text-sm font-medium">Order #{order.id}</p>
                <p className="text-xs text-[var(--text-secondary)]">{order.customer}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-semibold">${order.amount}</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  order.status === "Delivered"
                    ? "bg-green-100 text-green-800"
                    : order.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
