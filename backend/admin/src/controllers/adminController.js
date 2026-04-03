import Order from "../models/Order.js";
import Product from "../models/Product.js";
import AdminUser from "../models/AdminUser.js";
import User from "../models/User.js";
import Vendor from "../models/Vendor.js";

export const getAdminOrders = async (_req, res) => {
	try {
		const orders = await Order.find({})
			.sort({ createdAt: -1 })
			.limit(200)
			.populate("user", "name email")
			.populate("vendor", "storeName")
			.populate("products.product", "name images price");

		res.json(orders);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const updateAdminOrderStatus = async (req, res) => {
	try {
		const { status } = req.body;
		const order = await Order.findById(req.params.id);

		if (!order) {
			return res.status(404).json({ message: "Order not found" });
		}

		if (typeof status === "string" && status.trim()) {
			order.status = status.trim();
		}

		await order.save();
		await order.populate("user", "name email");
		await order.populate("vendor", "storeName");
		await order.populate("products.product", "name images price");

		res.json(order);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const getAdminCustomers = async (_req, res) => {
	try {
		const [admins, users, vendors, orders] = await Promise.all([
			AdminUser.find({}).sort({ createdAt: -1 }).limit(200),
			User.find({}).sort({ createdAt: -1 }).limit(500),
			Vendor.find({}).sort({ createdAt: -1 }).limit(200),
			Order.find({}).select("user total createdAt").sort({ createdAt: -1 }),
		]);

		const customerMap = new Map();

		for (const admin of admins) {
			customerMap.set(String(admin._id), {
				id: admin._id,
				name: admin.name || "Admin",
				email: admin.email || "",
				role: "Admin",
				orderCount: 0,
				totalSpent: 0,
				lastOrderAt: null,
			});
		}

		for (const user of users) {
			customerMap.set(String(user._id), {
				id: user._id,
				name: user.name || "Customer",
				email: user.email || "",
				role: user.role === "vendor" ? "Vendor" : "User",
				orderCount: 0,
				totalSpent: 0,
				lastOrderAt: null,
			});
		}

		for (const vendor of vendors) {
			customerMap.set(String(vendor._id), {
				id: vendor._id,
				name: vendor.storeName || "Vendor",
				email: vendor.email || "",
				role: "Vendor",
				orderCount: 0,
				totalSpent: 0,
				lastOrderAt: null,
			});
		}

		for (const order of orders) {
			const userId = order.user ? String(order.user) : null;
			if (!userId) continue;

			if (!customerMap.has(userId)) {
				customerMap.set(userId, {
					id: userId,
					name: "Customer",
					email: "",
					role: "User",
					orderCount: 0,
					totalSpent: 0,
					lastOrderAt: null,
				});
			}

			const customer = customerMap.get(userId);
			customer.orderCount += 1;
			customer.totalSpent += Number(order.total || 0);
			customer.lastOrderAt = order.createdAt;
		}

		res.json(Array.from(customerMap.values()));
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const getAdminAnalytics = async (_req, res) => {
	try {
		const [orders, productCount, customerCount, categoryCounts, vendorCount] = await Promise.all([
			Order.find({})
				.sort({ createdAt: -1 })
				.populate("user", "name email")
				.populate("vendor", "storeName")
				.populate("products.product", "name price category images"),
			Product.countDocuments({}),
			User.countDocuments({}),
			Product.aggregate([
				{ $group: { _id: { $ifNull: ["$category", "Uncategorized"] }, count: { $sum: 1 } } },
				{ $sort: { count: -1 } },
			]),
			Vendor.countDocuments({}),
		]);

		let totalSales = 0;
		const revenueByDay = new Map();

		for (const order of orders) {
			totalSales += Number(order.total || 0);
			const day = new Date(order.createdAt).toLocaleDateString("en-US", { weekday: "short" });
			revenueByDay.set(day, (revenueByDay.get(day) || 0) + Number(order.total || 0));
		}

		res.json({
			stats: {
				sales: totalSales,
				orders: orders.length,
				customers: customerCount,
				products: productCount,
				vendors: vendorCount,
			},
			revenueData: Array.from(revenueByDay.entries()).map(([day, revenue]) => ({ day, revenue })),
			categoryData: categoryCounts.map((item, index) => ({
				name: item._id,
				value: item.count,
				color: ["#F59E0B", "#3B82F6", "#10B981", "#EF4444", "#8B5CF6"][index % 5],
			})),
			recentOrders: orders.slice(0, 5),
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const getAdminReviews = async (_req, res) => {
	try {
		const products = await Product.find({ rating: { $gt: 0 } })
			.sort({ rating: -1, updatedAt: -1 })
			.limit(100)
			.populate("vendor", "storeName");

		res.json(products);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const getAdminVendors = async (_req, res) => {
	try {
		const vendors = await Vendor.find({}).sort({ createdAt: -1 }).limit(200);
		res.json(vendors);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};