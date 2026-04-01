import Order from "../models/Order.js";

// Get all orders for logged-in user
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("products.product", "name images") 
      .populate("vendor", "name");      
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// Get all returned orders
export const getReturns = async (req, res) => {
  try {
    const returns = await Order.find({ user: req.user._id, status: "Returned" })
      .populate("products.product", "name images")
      .populate("vendor", "name");
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
    }));

    const savedOrders = await Order.insertMany(ordersToInsert);
    res.status(201).json({ message: "Orders created successfully", count: savedOrders.length, orders: savedOrders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create order" });
  }
};
