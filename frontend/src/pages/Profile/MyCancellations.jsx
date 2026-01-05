import React from "react";

export default function MyCancellations() {
  const cancellations = [
    { id: 1, product: "Wireless Headphones", date: "2026-01-03", reason: "Changed Mind", status: "Refunded", amount: 4999, image: "https://via.placeholder.com/80" },
    { id: 2, product: "Smart Watch", date: "2026-01-05", reason: "Found Cheaper", status: "Pending", amount: 2999, image: "https://via.placeholder.com/80" },
  ];

  return (
    <div className="p-6 rounded-2xl shadow-2xl" style={{ backgroundColor: "var(--bg-card)", boxShadow: "0 10px 40px var(--shadow)" }}>
      <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>My Cancellations</h2>
      <div className="flex flex-col gap-4">
        {cancellations.map((cancel) => (
          <div key={cancel.id} className="p-4 rounded-xl border-2 border-[var(--border)] flex items-center gap-4">
            <img src={cancel.image} alt={cancel.product} className="w-20 h-20 object-cover rounded-lg" />
            <div className="flex-1">
              <p className="font-semibold" style={{ color: "var(--text-primary)" }}>{cancel.product}</p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{cancel.date} | Reason: {cancel.reason}</p>
            </div>
            <div className="text-right">
              <p className="text-sm" style={{ color: "var(--text-primary)" }}>{cancel.status}</p>
              <p className="font-semibold" style={{ color: "var(--text-primary)" }}>₹{cancel.amount}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
