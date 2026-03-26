import { useState, useEffect } from "react";
import { ShoppingBag, Loader } from "lucide-react";
import { getOrders, updateOrderStatus } from "../services/orderService";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrders();
      setOrders(res.data || []);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateOrderStatus(id, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: newStatus } : o))
      );
    } catch (error) {
      console.error("Failed to update order status", error);
    }
  };
  return (
    <div className="p-6 md:p-10 bg-[var(--bg-main)] min-h-screen">
      <h2 className="text-3xl font-extrabold mb-8 text-[var(--color-primary)]">Orders</h2>
      <div className="bg-[var(--bg-card)] rounded-3xl shadow-lg border border-[var(--border)] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-16 text-[var(--text-secondary)]">
            <Loader className="animate-spin mr-2" />
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center text-[var(--text-secondary)]">
            No orders found.
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="hover:bg-[var(--bg-muted)] transition-all duration-200">
              <div
                className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-[var(--border)] last:border-b-0 gap-4 cursor-pointer"
                onClick={() => setExpandedOrderId(expandedOrderId === order._id ? null : order._id)}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[var(--bg-muted)] rounded-xl shadow-sm">
                    <ShoppingBag size={20} className="text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <p className="text-base font-semibold">Order #{order._id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{order.user?.name || "Unknown Customer"}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  <span className="font-bold text-lg">${order.total}</span>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className={`px-4 py-2 rounded-xl text-base font-semibold border-0 cursor-pointer outline-none focus:ring-2 focus:ring-[var(--color-primary)] shadow-sm ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                    onClick={e => e.stopPropagation()}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              {expandedOrderId === order._id && (
                <div className="bg-[var(--bg-muted)] p-6 border-b border-[var(--border)] rounded-b-2xl">
                  <div className="mb-3">
                    <span className="font-semibold">Customer:</span> {order.user?.name || "Unknown Customer"} ({order.user?.email || "No email"})
                  </div>
                  <div className="mb-3">
                    <span className="font-semibold">Order Date:</span> {order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}
                  </div>
                  <div className="mb-3">
                    <span className="font-semibold">Products:</span>
                    <ul className="ml-0">
                      {order.products?.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-4 mb-2">
                          {item.product?.images?.[0] && (
                            <img
                              src={item.product.images[0]}
                              alt={item.product?.name || "Product"}
                              className="w-14 h-14 object-cover rounded-xl border"
                            />
                          )}
                          <div>
                            <div className="font-semibold text-base">{item.product?.name || "Product"}</div>
                            <div className="text-xs text-[var(--text-secondary)]">x{item.quantity} (${item.price} each)</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-3">
                    <span className="font-semibold">Total:</span> ${order.total}
                  </div>
                  <div>
                    <span className="font-semibold">Status:</span> {order.status}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
