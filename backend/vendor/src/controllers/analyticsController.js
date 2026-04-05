import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";
import Review from "../models/Review.js";

// Utility to get start of day
const getStartOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const getDashboardAnalytics = async (req, res) => {
  try {
    const vendorId = req.user?.id;
    if (!vendorId) return res.status(401).json({ message: "Unauthorized" });

    // 1. Fetch vendor orders, products, coupons, and review stats from DB
    const [orders, products, lowStock, activeCoupons, reviewOverview] = await Promise.all([
      Order.find({ vendor: vendorId }).populate("user", "name email").populate("products.product", "name price").sort({ createdAt: -1 }),
      Product.find({ vendor: vendorId }).select("category").lean(),
      Product.countDocuments({ vendor: vendorId, stock: { $lte: 10 } }),
      Coupon.countDocuments({ vendor: vendorId, isActive: true }),
      (async () => {
        const vendorProducts = await Product.find({ vendor: vendorId }, { _id: 1 }).lean();
        const productIds = vendorProducts.map((item) => item._id);
        if (!productIds.length) return { averageRating: 0, totalReviews: 0 };
        const [grouped] = await Review.aggregate([
          { $match: { product: { $in: productIds } } },
          { $group: { _id: null, averageRating: { $avg: "$rating" }, totalReviews: { $sum: 1 } } },
        ]);
        return grouped || { averageRating: 0, totalReviews: 0 };
      })(),
    ]);

    // 2. Compute Dashboard KPIs
    const totalOrders = orders.length;
    let totalSales = 0;
    const uniqueCustomers = new Set();
    const productsCount = products.length;
    
    // Group weekly revenue by weekday
    const revenueMap = {};
    const recentOrders = orders.slice(0, 5);

    orders.forEach(order => {
      totalSales += order.total;
      if (order.user) uniqueCustomers.add(order.user._id.toString());
      
      const orderDay = new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
      revenueMap[orderDay] = (revenueMap[orderDay] || 0) + order.total;
    });

    const weekdayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const revenueData = weekdayOrder
      .filter((day) => revenueMap[day] !== undefined)
      .map((day) => ({ day, revenue: revenueMap[day] }));

    // Build category distribution from product categories in DB
    const categoryCounts = products.reduce((acc, item) => {
      const key = String(item.category || "Uncategorized").trim() || "Uncategorized";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const palette = ["#F59E0B", "#3B82F6", "#10B981", "#8B5CF6", "#EF4444", "#06B6D4", "#F97316"];
    const categoryTotal = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0) || 1;
    const categoryData = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count], index) => ({
        name,
        value: Number(((count / categoryTotal) * 100).toFixed(1)),
        color: palette[index % palette.length],
      }));

    const stats = {
      sales: totalSales,
      orders: totalOrders,
      customers: uniqueCustomers.size,
      products: productsCount,
      lowStock,
      activeCoupons,
      averageRating: Number((reviewOverview.averageRating || 0).toFixed(2)),
      totalReviews: reviewOverview.totalReviews || 0,
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
      customers: customersArray,
    });

  } catch (error) {
    console.error("Error generating analytics:", error);
    res.status(500).json({ message: "Failed to generate analytics" });
  }
};
