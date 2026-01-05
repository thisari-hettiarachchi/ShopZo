import React from "react";

export default function MyOrders() {
  const orders = [
    { id: 1, product: "Men Running Shoes", date: "2026-01-01", status: "Delivered", amount: 8500, image: "https://via.placeholder.com/80" },
    { id: 2, product: "Laptop Pro 2026", date: "2026-01-03", status: "Shipped", amount: 1299.99, image: "https://via.placeholder.com/80" },
  ];

  return (
    <div className="p-6 rounded-2xl shadow-2xl" style={{ backgroundColor: "var(--bg-card)", boxShadow: "0 10px 40px var(--shadow)" }}>
      <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>My Orders</h2>
      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <div key={order.id} className="p-4 rounded-xl border-2 border-[var(--border)] flex items-center gap-4">
            <img src={order.image} alt={order.product} className="w-20 h-20 object-cover rounded-lg" />
            <div className="flex-1">
              <p className="font-semibold" style={{ color: "var(--text-primary)" }}>{order.product}</p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{order.date}</p>
            </div>
            <div className="text-right">
              <p className="text-sm" style={{ color: "var(--text-primary)" }}>{order.status}</p>
              <p className="font-semibold" style={{ color: "var(--text-primary)" }}>₹{order.amount}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
