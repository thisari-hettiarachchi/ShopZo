import React, { useState, useEffect } from "react";
import { cancelOrder, fetchOrders as fetchOrdersApi, fetchReturns, requestReturn } from "../../../api/ordersApi";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [returnsByOrderId, setReturnsByOrderId] = useState({});
  const [expandedOrderId, setExpandedOrderId] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [loading, setLoading] = useState(true);

  const refreshOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setOrders([]);
      setReturnsByOrderId({});
      setLoading(false);
      return;
    }

    try {
      const [ordersRes, returnsRes] = await Promise.all([fetchOrdersApi(), fetchReturns()]);
      const list = Array.isArray(ordersRes.data) ? ordersRes.data : [];
      const returns = Array.isArray(returnsRes.data) ? returnsRes.data : [];

      const returnMap = returns.reduce((acc, item) => {
        const orderId = item?.order?._id;
        if (orderId) {
          acc[orderId] = item;
        }
        return acc;
      }, {});

      setOrders(list);
      setReturnsByOrderId(returnMap);
      if (!expandedOrderId && list[0]?._id) {
        setExpandedOrderId(list[0]._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;

  const canCancelOrder = (order) => {
    const status = String(order.status || "").toLowerCase();
    if (!["placed", "pending", "processing"].includes(status)) return false;

    const referenceDate = order.createdAt ? new Date(order.createdAt).getTime() : Date.now();
    const hoursFromOrder = (Date.now() - referenceDate) / (1000 * 60 * 60);
    return hoursFromOrder <= 24;
  };

  const canReturnOrder = (order) => {
    const status = String(order.status || "").toLowerCase();
    if (["cancelled", "requested", "rejected", "refunded"].includes(status)) return false;

    const hasReturnRequest = Boolean(returnsByOrderId[order._id]);
    if (hasReturnRequest) return false;

    const referenceDate = order.createdAt ? new Date(order.createdAt).getTime() : Date.now();
    const daysFromOrder = (Date.now() - referenceDate) / (1000 * 60 * 60 * 24);
    return daysFromOrder <= 7;
  };

  const handleRequestReturn = async (orderId) => {
    const reason = prompt("Reason for return:");
    if (!reason) return;
    try {
      setActionLoadingId(orderId);
      await requestReturn(orderId, { reason, details: "Requested from profile" });
      alert("Return request submitted");
      await refreshOrders();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to request return");
    } finally {
      setActionLoadingId("");
    }
  };

  const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm("Do you want to cancel this order?");
    if (!confirmed) return;

    try {
      setActionLoadingId(orderId);
      await cancelOrder(orderId);
      alert("Order cancelled");
      await refreshOrders();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to cancel order");
    } finally {
      setActionLoadingId("");
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
              className="p-4 rounded-xl border border-[var(--border)] cursor-pointer"
              onClick={() => setExpandedOrderId((prev) => (prev === order._id ? "" : order._id))}
            >
              <div className="flex items-center gap-4">
                <img
                  src={order.products?.[0]?.product?.images?.[0] || "https://via.placeholder.com/80"}
                  alt=""
                  className="w-20 h-20 rounded-lg object-cover"
                />

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--text-primary)] truncate">
                    {order.products?.map((item) => item?.product?.name).filter(Boolean).join(", ") || "Product"}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Ordered on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Vendor: {order.vendor?.storeName || order.vendor?.name || "Vendor"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{order.status}</p>
                  <p className="font-semibold text-[var(--text-primary)]">₹{order.total}</p>
                  {returnsByOrderId[order._id] && (
                    <p className="text-[11px] text-amber-600 mt-1">Return: {returnsByOrderId[order._id].status}</p>
                  )}
                </div>
              </div>

              {expandedOrderId === order._id && (
                <div className="w-full mt-4 border-t border-[var(--border)] pt-4" onClick={(event) => event.stopPropagation()}>
                  <p className="text-xs text-[var(--text-secondary)] mb-2">Order ID: {order._id}</p>

                  <div className="space-y-2 mb-4">
                    {(order.products || []).map((item, idx) => (
                      <div key={`${order._id}-${idx}`} className="flex items-center justify-between rounded-lg bg-[var(--bg-main)] px-3 py-2">
                        <div className="min-w-0 pr-3">
                          <p className="text-sm font-medium text-[var(--text-primary)] truncate">{item?.product?.name || "Product"}</p>
                          <p className="text-xs text-[var(--text-secondary)]">Qty: {item?.quantity || 1}</p>
                        </div>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">₹{item?.price || 0}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {(order.trackingTimeline || []).map((step) => (
                      <div key={step.status} className="text-center">
                        <div className={`mx-auto h-2.5 w-2.5 rounded-full ${step.completed ? "bg-[var(--color-primary)]" : "bg-[var(--border)]"}`} />
                        <p className="mt-1 text-[10px] text-[var(--text-secondary)]">{step.status}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      disabled={!canCancelOrder(order) || actionLoadingId === order._id}
                      onClick={() => handleCancelOrder(order._id)}
                      className="rounded-md border border-red-500 px-3 py-1 text-xs text-red-600 disabled:opacity-40"
                    >
                      {actionLoadingId === order._id ? "Updating..." : canCancelOrder(order) ? "Cancel Order" : "Cancel expired"}
                    </button>

                    <button
                      disabled={!canReturnOrder(order) || actionLoadingId === order._id}
                      onClick={() => handleRequestReturn(order._id)}
                      className="rounded-md border border-[var(--color-primary)] px-3 py-1 text-xs text-[var(--color-primary)] disabled:opacity-40"
                    >
                      {canReturnOrder(order) ? "Request Return (within 7 days)" : "Return expired"}
                    </button>

                    {!canReturnOrder(order) && !returnsByOrderId[order._id] && (
                      <p className="text-[11px] text-[var(--text-secondary)] self-center">
                        Return option expires after 7 days
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
