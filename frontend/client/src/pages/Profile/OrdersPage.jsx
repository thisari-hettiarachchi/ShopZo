import React, { useState, useEffect } from "react";
import axios from "axios";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/user/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="p-6 rounded-2xl shadow-2xl bg-[var(--bg-card)]">
      <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">
        My Orders
      </h2>

      {orders.length === 0 ? (
        <p className="text-center text-[var(--text-secondary)] py-10">
          No orders found 🛒
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="p-4 rounded-xl border border-[var(--border)] flex items-center gap-4"
            >
              <img
                src={order.items[0]?.product?.image || "https://via.placeholder.com/80"}
                alt=""
                className="w-20 h-20 rounded-lg object-cover"
              />

              <div className="flex-1">
                <p className="font-semibold text-[var(--text-primary)]">
                  {order.items[0]?.product?.name}
                </p>
                <p className="text-sm text-[var(--text-secondary)]">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-[var(--text-primary)]">{order.status}</p>
                <p className="font-semibold text-[var(--text-primary)]">
                  ₹{order.totalAmount}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
