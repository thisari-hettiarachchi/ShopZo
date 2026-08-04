import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";
import Review from "../models/Review.js";

// Utility to get start of day
const getStartOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

// Platform commission taken from each settled sale before payout.
const PLATFORM_COMMISSION_RATE = 0.1;

const isOrderSettled = (order) =>
  order.paymentStatus === "paid" || (order.paymentMethod !== "stripe" && order.status === "Delivered");

const isOrderVoided = (order) => order.status === "Cancelled" || order.status === "Refunded" || order.paymentStatus === "refunded";

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

    const recentOrders = orders.slice(0, 5);

    // Group revenue by actual calendar date over the last 14 days (avoids
    // merging data from different weeks into the same weekday bucket).
    const DAYS = 14;
    const dayKeys = [];
    const revenueMap = {};
    for (let i = DAYS - 1; i >= 0; i -= 1) {
      const date = getStartOfDay(new Date());
      date.setDate(date.getDate() - i);
      const key = date.toISOString().slice(0, 10);
      dayKeys.push(key);
      revenueMap[key] = 0;
    }

    orders.forEach(order => {
      totalSales += order.total;
      if (order.user) uniqueCustomers.add(order.user._id.toString());

      const key = getStartOfDay(new Date(order.createdAt)).toISOString().slice(0, 10);
      if (revenueMap[key] !== undefined) {
        revenueMap[key] += order.total;
      }
    });

    const revenueData = dayKeys.map((key) => ({
      day: new Date(key).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      revenue: revenueMap[key],
    }));

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

export const getVendorEarnings = async (req, res) => {
  try {
    const vendorId = req.user?.id;
    if (!vendorId) return res.status(401).json({ message: "Unauthorized" });

    const orders = await Order.find({ vendor: vendorId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    let grossSettled = 0;
    let pendingAmount = 0;
    let voidedAmount = 0;
    const settledOrders = [];

    const DAYS = 14;
    const dayKeys = [];
    const earningsMap = {};
    for (let i = DAYS - 1; i >= 0; i -= 1) {
      const date = getStartOfDay(new Date());
      date.setDate(date.getDate() - i);
      const key = date.toISOString().slice(0, 10);
      dayKeys.push(key);
      earningsMap[key] = 0;
    }

    orders.forEach((order) => {
      if (isOrderVoided(order)) {
        voidedAmount += order.total || 0;
        return;
      }

      if (isOrderSettled(order)) {
        grossSettled += order.total || 0;
        settledOrders.push(order);

        const key = getStartOfDay(new Date(order.createdAt)).toISOString().slice(0, 10);
        if (earningsMap[key] !== undefined) {
          earningsMap[key] += (order.total || 0) * (1 - PLATFORM_COMMISSION_RATE);
        }
      } else {
        pendingAmount += order.total || 0;
      }
    });

    const commission = grossSettled * PLATFORM_COMMISSION_RATE;
    const netEarnings = grossSettled - commission;

    const earningsTrend = dayKeys.map((key) => ({
      day: new Date(key).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      earnings: Number(earningsMap[key].toFixed(2)),
    }));

    res.json({
      summary: {
        grossSettled: Number(grossSettled.toFixed(2)),
        commission: Number(commission.toFixed(2)),
        netEarnings: Number(netEarnings.toFixed(2)),
        pendingAmount: Number(pendingAmount.toFixed(2)),
        voidedAmount: Number(voidedAmount.toFixed(2)),
        commissionRate: PLATFORM_COMMISSION_RATE,
        settledOrderCount: settledOrders.length,
      },
      earningsTrend,
      recentSettledOrders: settledOrders.slice(0, 10).map((order) => ({
        _id: order._id,
        total: order.total,
        netAmount: Number(((order.total || 0) * (1 - PLATFORM_COMMISSION_RATE)).toFixed(2)),
        paymentMethod: order.paymentMethod || "cod",
        paymentStatus: order.paymentStatus || "pending",
        status: order.status,
        createdAt: order.createdAt,
        customer: order.user?.name || "Customer",
      })),
    });
  } catch (error) {
    console.error("Error generating earnings:", error);
    res.status(500).json({ message: "Failed to generate earnings" });
  }
};
