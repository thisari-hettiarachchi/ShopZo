import Order from "../models/Order.js";
import ReturnRequest from "../models/ReturnRequest.js";
import Notification from "../models/Notification.js";

const TRACKING_FLOW = ["Placed", "Processing", "Shipped", "Delivered"];

const normalizeStatus = (status) => {
  if (!status) return "Placed";
  const candidate = String(status).trim();
  if (candidate === "Pending") return "Placed";
  return candidate;
};

// Get all orders for logged-in user
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("products.product", "name images") 
      .populate("vendor", "name storeName");

    const normalized = orders.map((order) => {
      const currentStatus = normalizeStatus(order.status);
      const existing = Array.isArray(order.statusHistory) ? [...order.statusHistory] : [];

      if (!existing.find((entry) => entry.status === currentStatus)) {
        existing.push({ status: currentStatus, at: order.updatedAt || order.createdAt });
      }

      const trackingTimeline = TRACKING_FLOW.map((step) => {
        const hit = existing.find((entry) => entry.status === step);
        return {
          status: step,
          at: hit?.at || null,
          completed: Boolean(hit),
          active: step === currentStatus,
        };
      });

      return {
        ...order.toObject(),
        status: currentStatus,
        statusHistory: existing,
        trackingTimeline,
      };
    });

    res.json(normalized);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// Get all returned orders
export const getReturns = async (req, res) => {
  try {
    const returns = await ReturnRequest.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "order",
        populate: [
          { path: "products.product", select: "name images" },
          { path: "vendor", select: "name storeName" },
        ],
      });
    res.json(returns);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch returns" });
  }
};

// Get all cancelled orders
export const getCancellations = async (req, res) => {
  try {
    const cancellations = await Order.find({ user: req.user._id, status: "Cancelled" })
      .populate("products.product", "name images")
      .populate("vendor", "name");
    res.json(cancellations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch cancellations" });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    // Group items by vendor
    const vendorMap = {};
    items.forEach((item) => {
      const vid = item.vendor;
      if (!vendorMap[vid]) {
        vendorMap[vid] = { products: [], total: 0 };
      }
      vendorMap[vid].products.push({
        product: item.product,
        quantity: item.qty,
        price: item.price,
      });
      vendorMap[vid].total += item.price * item.qty;
    });

    // Create an Order for each vendor
    const ordersToInsert = Object.keys(vendorMap).map((vid) => ({
      user: req.user._id,
      vendor: vid,
      products: vendorMap[vid].products,
      total: vendorMap[vid].total,
      status: "Pending",
      statusHistory: [{ status: "Placed", at: new Date() }],
    }));

    const savedOrders = await Order.insertMany(ordersToInsert);

    await Notification.create({
      user: req.user._id,
      type: "order",
      title: "Order placed successfully",
      message: `Your order has been placed (${savedOrders.length} vendor shipment${savedOrders.length > 1 ? "s" : ""}).`,
      metadata: { orderIds: savedOrders.map((order) => order._id) },
    });

    res.status(201).json({ message: "Orders created successfully", count: savedOrders.length, orders: savedOrders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

export const requestReturn = async (req, res) => {
  try {
    const { reason, details } = req.body;
    const { id } = req.params;

    if (!reason) {
      return res.status(400).json({ message: "Return reason is required" });
    }

    const order = await Order.findOne({ _id: id, user: req.user._id });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const request = await ReturnRequest.create({
      order: order._id,
      user: req.user._id,
      reason,
      details: details || "",
      status: "Requested",
    });

    await Notification.create({
      user: req.user._id,
      type: "return",
      title: "Return requested",
      message: `Your return request for order ${String(order._id).slice(-6).toUpperCase()} is submitted.`,
      metadata: { orderId: order._id, returnRequestId: request._id },
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: "Failed to request return" });
  }
};
