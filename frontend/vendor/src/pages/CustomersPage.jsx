import { useState, useEffect } from "react";
import { Users, Loader } from "lucide-react";
import { getDashboardAnalytics } from "../services/analyticsService";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await getDashboardAnalytics();
        const customersArr = res.data?.customers || [];
        console.log("Fetched customers:", customersArr);
        setCustomers(customersArr);
      } catch (error) {
        console.error("Failed to fetch customers", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Customers</h2>
      <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border)] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-[var(--text-secondary)]">
            <Loader className="animate-spin mr-2" />
            Loading customers...
          </div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center text-[var(--text-secondary)]">
            No customers found.<br />
            <span className="text-xs text-gray-400">(Customers will appear here after they place an order.)</span>
          </div>
        ) : (
          customers.map((customer) => {
            const key = customer._id || customer.id;
            return (
              <div key={key} className="flex items-center justify-between p-4 border-b border-[var(--border)] last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[var(--bg-muted)] rounded-lg">
                    <Users size={20} className="text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{customer.name || "Anonymous Customer"}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{customer.email}</p>
                  </div>
                </div>
                <div className="text-sm font-medium">{customer.totalOrders} Orders</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
