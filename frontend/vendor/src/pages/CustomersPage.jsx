import React from "react";
import { Users } from "lucide-react";

const sampleCustomers = [
  { id: 1, name: "Alice", email: "alice@email.com", totalOrders: 5 },
  { id: 2, name: "Bob", email: "bob@email.com", totalOrders: 3 },
  { id: 3, name: "Charlie", email: "charlie@email.com", totalOrders: 7 },
  { id: 4, name: "Diana", email: "diana@email.com", totalOrders: 2 },
];

export default function CustomersPage({ active }) {
  return (
    <div className="p-6">
      {active === "customers" && (
        <>
          <h2 className="text-xl font-bold mb-4">Customers</h2>
          <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border)] overflow-hidden">
            {sampleCustomers.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between p-4 border-b border-[var(--border)] last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[var(--bg-muted)] rounded-lg">
                    <Users size={20} className="text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{customer.name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{customer.email}</p>
                  </div>
                </div>
                <div className="text-sm font-medium">{customer.totalOrders} Orders</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
