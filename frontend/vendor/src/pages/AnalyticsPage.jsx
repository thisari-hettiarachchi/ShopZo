import { useState, useEffect } from "react";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { Loader } from "lucide-react";
import { getDashboardAnalytics } from "../services/analyticsService";

export default function AnalyticsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await getDashboardAnalytics();
        setData(res.data?.revenueData || []);
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Analytics</h2>
      <div className="bg-[var(--bg-card)] p-6 rounded-xl shadow-sm border border-[var(--border)]">
        <h3 className="text-lg font-semibold mb-4">Monthly Sales</h3>
        {loading ? (
          <div className="flex items-center justify-center p-12 text-[var(--text-secondary)]">
            <Loader className="animate-spin mr-2" />
            Loading chart data...
          </div>
        ) : data.length === 0 ? (
          <div className="p-12 text-center text-[var(--text-secondary)]">
            Not enough data available yet to generate charts.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--bg-card)', 
                  border: '1px solid var(--border)',
                  borderRadius: '8px'
                }} 
              />
              <Area type="monotone" dataKey="revenue" stroke="#F59E0B" fill="#FBBF24" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
