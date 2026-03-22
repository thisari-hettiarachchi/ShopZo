import Order from "../models/Order.js";

// Get all orders for the vendor
export const getVendorOrders = async (req, res) => {
  try {
    const vendorId = req.user?.id;
    if (!vendorId) return res.status(401).json({ message: "Unauthorized" });

    const orders = await Order.find({ vendor: vendorId })
      .populate("user", "name email")
      .populate("products.product", "name price image")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Error fetching vendor orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// Update the status of an order
export const updateOrderStatus = async (req, res) => {
  try {
    const vendorId = req.user?.id;
    const { id } = req.params;
    const { status } = req.body;

    if (!vendorId) return res.status(401).json({ message: "Unauthorized" });

    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findOneAndUpdate(
      { _id: id, vendor: vendorId },
      { status },
      { new: true }
    ).populate("user", "name email");

    if (!order) return res.status(404).json({ message: "Order not found or unauthorized" });

    res.json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
};
