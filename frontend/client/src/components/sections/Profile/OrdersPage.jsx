import React, { useState, useEffect } from "react";
import { fetchOrders, requestReturn } from "../../../api/ordersApi";

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
        const res = await fetchOrders();
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

  const handleRequestReturn = async (orderId) => {
    const reason = prompt("Reason for return:");
    if (!reason) return;
    try {
      await requestReturn(orderId, { reason, details: "Requested from profile" });
      alert("Return request submitted");
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to request return");
    }
  };

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
                src={order.products?.[0]?.product?.images?.[0] || "https://via.placeholder.com/80"}
                alt=""
                className="w-20 h-20 rounded-lg object-cover"
              />

              <div className="flex-1">
                <p className="font-semibold text-[var(--text-primary)]">
                  {order.products?.[0]?.product?.name || "Product"}
                </p>
                <p className="text-sm text-[var(--text-secondary)]">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-[var(--text-primary)]">{order.status}</p>
                <p className="font-semibold text-[var(--text-primary)]">
                  ₹{order.total}
                </p>
                <button
                  onClick={() => handleRequestReturn(order._id)}
                  className="mt-2 rounded-md border border-[var(--color-primary)] px-2 py-1 text-xs text-[var(--color-primary)]"
                >
                  Request Return
                </button>
              </div>

              <div className="w-full mt-3">
                <div className="grid grid-cols-4 gap-2">
                  {(order.trackingTimeline || []).map((step) => (
                    <div key={step.status} className="text-center">
                      <div className={`mx-auto h-2.5 w-2.5 rounded-full ${step.completed ? "bg-[var(--color-primary)]" : "bg-[var(--border)]"}`} />
                      <p className="mt-1 text-[10px] text-[var(--text-secondary)]">{step.status}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
