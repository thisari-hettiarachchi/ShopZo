import React from "react";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

const salesData = [
  { month: "Jan", sales: 4000 },
  { month: "Feb", sales: 3000 },
  { month: "Mar", sales: 5000 },
  { month: "Apr", sales: 4000 },
];

export default function AnalyticsPage({ active }) {
  return (
    <div className="p-6">
      {active === "analytics" && (
        <>
          <h2 className="text-xl font-bold mb-4">Analytics</h2>
          <div className="bg-[var(--bg-card)] p-6 rounded-xl shadow-sm border border-[var(--border)]">
            <h3 className="text-lg font-semibold mb-4">Monthly Sales</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--bg-card)', 
                    border: '1px solid var(--border)',
                    borderRadius: '8px'
                  }} 
                />
                <Area type="monotone" dataKey="sales" stroke="#F59E0B" fill="#FBBF24" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
