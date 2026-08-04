import Order from "../models/Order.js";
import ReturnRequest from "../models/ReturnRequest.js";
import Notification from "../models/Notification.js";
import Coupon from "../models/Coupon.js";

const TRACKING_FLOW = ["Placed", "Processing", "Shipped", "Delivered"];
const RETURN_WINDOW_DAYS = 7;
const CANCEL_WINDOW_HOURS = 24;
const CANCELLABLE_STATUSES = new Set(["Placed", "Pending", "Processing"]);

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
      .sort({ createdAt: -1 })
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
    const { items, shippingAddress, couponCode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

    let appliedCoupon = null;
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.trim().toUpperCase(), isActive: true });
      const now = new Date();
      const withinWindow = coupon && (!coupon.startsAt || coupon.startsAt <= now) && (!coupon.expiresAt || coupon.expiresAt >= now);
      const underLimit = coupon && (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit);
      if (coupon && withinWindow && underLimit && subtotal >= (coupon.minOrderAmount || 0)) {
        let discount = coupon.type === "percentage" ? (subtotal * coupon.value) / 100 : coupon.value;
        if (coupon.maxDiscountAmount) discount = Math.min(discount, coupon.maxDiscountAmount);
        discountAmount = Math.min(discount, subtotal);
        appliedCoupon = coupon;
      }
    }
    const discountRatio = subtotal > 0 ? discountAmount / subtotal : 0;

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
    const ordersToInsert = Object.keys(vendorMap).map((vid) => {
      const vendorDiscount = Math.round(vendorMap[vid].total * discountRatio * 100) / 100;
      return {
        user: req.user._id,
        vendor: vid,
        products: vendorMap[vid].products,
        total: Math.max(vendorMap[vid].total - vendorDiscount, 0),
        status: "Pending",
        statusHistory: [{ status: "Placed", at: new Date() }],
        shippingAddress: shippingAddress || null,
        paymentMethod: "cod",
        paymentStatus: "pending",
        coupon: appliedCoupon ? { code: appliedCoupon.code, discountAmount: vendorDiscount } : undefined,
      };
    });

    const savedOrders = await Order.insertMany(ordersToInsert);

    if (appliedCoupon) {
      await Coupon.updateOne({ _id: appliedCoupon._id }, { $inc: { usedCount: 1 } });
    }

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

    const deliveredAt = Array.isArray(order.statusHistory)
      ? order.statusHistory.find((entry) => entry.status === "Delivered")?.at
      : null;
    const baseDate = deliveredAt || order.createdAt;
    const daysSinceBaseDate = Math.floor((Date.now() - new Date(baseDate).getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceBaseDate > RETURN_WINDOW_DAYS) {
      console.warn(`Return attempt failed: Order ${id} is ${daysSinceBaseDate} days old (max: ${RETURN_WINDOW_DAYS} days). Delivered at: ${baseDate}`);
      return res.status(400).json({ message: `Return window closed. Returns are allowed within ${RETURN_WINDOW_DAYS} days of delivery.` });
    }

    const existing = await ReturnRequest.findOne({ order: order._id, user: req.user._id });
    if (existing) {
      return res.status(409).json({ message: "Return request already submitted for this order" });
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

    console.log(`Return request created for order ${id} by user ${req.user._id}: ${reason}`);
    res.status(201).json(request);
  } catch (error) {
    console.error("Error requesting return:", error);
    res.status(500).json({ message: "Failed to request return" });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ _id: id, user: req.user._id });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const currentStatus = normalizeStatus(order.status);
    if (!CANCELLABLE_STATUSES.has(currentStatus)) {
      return res.status(400).json({ message: "Order cannot be cancelled at this stage" });
    }

    const orderAgeHours = (Date.now() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60);
    if (orderAgeHours > CANCEL_WINDOW_HOURS) {
      console.warn(`Cancel attempt failed: Order ${id} is ${orderAgeHours.toFixed(1)} hours old (max: ${CANCEL_WINDOW_HOURS}h)`);
      return res.status(400).json({ message: `Cancel window closed. Orders can be cancelled within ${CANCEL_WINDOW_HOURS} hours.` });
    }

    order.status = "Cancelled";
    order.statusHistory = [...(order.statusHistory || []), { status: "Cancelled", at: new Date() }];
    await order.save();

    await Notification.create({
      user: req.user._id,
      type: "order",
      title: "Order cancelled",
      message: `Your order ${String(order._id).slice(-6).toUpperCase()} has been cancelled.`,
      metadata: { orderId: order._id },
    });

    console.log(`Order ${id} cancelled by user ${req.user._id}`);
    res.json({ message: "Order cancelled", order });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ message: "Failed to cancel order" });
  }
};
