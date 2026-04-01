import Order from "../models/Order.js";
import Product from "../models/Product.js";

// Utility to get start of day
const getStartOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const getDashboardAnalytics = async (req, res) => {
  try {
    const vendorId = req.user?.id;
    if (!vendorId) return res.status(401).json({ message: "Unauthorized" });

    // 1. Fetch all orders and products for this vendor
    const [orders, productsCount] = await Promise.all([
      Order.find({ vendor: vendorId }).populate("user", "name email").populate("products.product", "name price").sort({ createdAt: -1 }),
      Product.countDocuments({ vendor: vendorId })
    ]);

    // 2. Compute Dashboard KPIs
    const totalOrders = orders.length;
    let totalSales = 0;
    const uniqueCustomers = new Set();
    
    // Group weekly revenue. For simplicity, just last 5 days
    const revenueMap = {};
    const recentOrders = orders.slice(0, 5); // Latest 5 orders

    orders.forEach(order => {
      totalSales += order.total;
      if (order.user) uniqueCustomers.add(order.user._id.toString());
      
      const orderDay = new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
      revenueMap[orderDay] = (revenueMap[orderDay] || 0) + order.total;
    });

    const revenueData = Object.keys(revenueMap).map(day => ({
      day,
      revenue: revenueMap[day]
    }));

    // Generate basic category distribution
    const categoryData = [
      { name: "General", value: 45, color: "#F59E0B" },
      { name: "Electronics", value: 30, color: "#3B82F6" },
      { name: "Accessories", value: 25, color: "#10B981" }
    ]; // Can aggregate from products in a real app, placeholder for now.

    const stats = {
      sales: totalSales,
      orders: totalOrders,
      customers: uniqueCustomers.size,
      products: productsCount
    };

    // Extract unique customers data array for CustomersPage
    const customersMap = {};
    orders.forEach(order => {
       if(order.user && !customersMap[order.user._id]) {
           customersMap[order.user._id] = { id: order.user._id, name: order.user.name, email: order.user.email, totalOrders: 0 };
       }
       if(order.user) customersMap[order.user._id].totalOrders += 1;
    });
    const customersArray = Object.values(customersMap);

    res.json({
      stats,
      revenueData,
      recentOrders,
      categoryData,
      customers: customersArray
    });

  } catch (error) {
    console.error("Error generating analytics:", error);
    res.status(500).json({ message: "Failed to generate analytics" });
  }
};
