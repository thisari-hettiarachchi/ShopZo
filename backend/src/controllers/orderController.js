import Order from "../models/Order.js";

// Get all orders for logged-in user
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "name image") // get product name & image
      .populate("items.vendor", "name");      // get vendor name
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// Get all returned orders
export const getReturns = async (req, res) => {
  try {
    const returns = await Order.find({ user: req.user._id, status: "returned" })
      .populate("items.product", "name image")
      .populate("items.vendor", "name");
    res.json(returns);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch returns" });
  }
};

// Get all cancelled orders
export const getCancellations = async (req, res) => {
  try {
    const cancellations = await Order.find({ user: req.user._id, status: "cancelled" })
      .populate("items.product", "name image")
      .populate("items.vendor", "name");
    res.json(cancellations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch cancellations" });
  }
};
