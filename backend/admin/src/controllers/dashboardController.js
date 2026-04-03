import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

export const getDashboardSummary = async (_req, res) => {
  try {
    const [totalOrders, activeProducts, customers] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments(),
    ]);

    res.json({
      totalOrders,
      activeProducts,
      customers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
