import Notification from "../models/Notification.js";
import Product from "../models/Product.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(40);

    const discountProducts = await Product.find({ discount: { $gt: 0 } })
      .sort({ discount: -1 })
      .limit(5)
      .select("name discount");

    const discountNotifications = discountProducts.map((product) => ({
      _id: `discount-${product._id}`,
      type: "discount",
      title: "New discount available",
      message: `${product.name} now has ${product.discount}% off`,
      metadata: { productId: product._id },
      isRead: false,
      createdAt: new Date(),
    }));

    res.json([...discountNotifications, ...notifications]);
  } catch (error) {
    res.status(500).json({ message: "Failed to load notifications" });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: "Failed to update notification" });
  }
};

export const clearNotifications = async (req, res) => {
  try {
    const result = await Notification.deleteMany({ user: req.user._id });
    res.json({ message: "Notifications cleared", deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear notifications" });
  }
};