import Order from "../models/Order.js";
import Product from "../models/Product.js";
import AdminUser from "../models/AdminUser.js";
import User from "../models/User.js";
import Vendor from "../models/Vendor.js";

const populateOrderRelations = (query) =>
	query
		.populate("user", "name email")
		.populate("vendor", "storeName")
		.populate({
			path: "products.product",
			select: "name images price category vendor",
			populate: { path: "vendor", select: "storeName" },
		});

const toNumber = (value) => Number(value || 0);

const buildOrderFlags = (order, userOrderTotals = new Map()) => {
	const flags = [];
	const products = Array.isArray(order.products) ? order.products : [];
	const productTotal = products.reduce((sum, item) => sum + toNumber(item.price) * toNumber(item.quantity), 0);
	const hasMissingUser = !order.user;
	const largeOrder = toNumber(order.total) >= 5000;
	const manyItems = products.length >= 8;
	const amountMismatch = products.length > 0 && Math.abs(productTotal - toNumber(order.total)) > 0.01;
	const repeatedHighValue = order.user && (userOrderTotals.get(String(order.user?._id || order.user)) || 0) >= 3 && toNumber(order.total) >= 1000;

	if (hasMissingUser) flags.push("Missing customer");
	if (largeOrder) flags.push("High order value");
	if (manyItems) flags.push("Large item count");
	if (amountMismatch) flags.push("Amount mismatch");
	if (repeatedHighValue) flags.push("Repeated high-value orders");

	return flags;
};

const buildAdminInsights = async () => {
	const [orders, vendors, products, customerCount, vendorCount] = await Promise.all([
		populateOrderRelations(Order.find({}).sort({ createdAt: -1 }).limit(300)),
		Vendor.find({}).sort({ createdAt: -1 }).limit(200),
		Product.find({}).sort({ createdAt: -1 }).limit(500),
		User.countDocuments({}),
		Vendor.countDocuments({}),
	]);

	const totalSales = orders.reduce((sum, order) => sum + toNumber(order.total), 0);
	const revenueByVendorMap = new Map();
	const topProductsMap = new Map();
	const userHighValueCounts = new Map();

	for (const order of orders) {
		const userId = order.user ? String(order.user._id || order.user) : null;
		if (userId) {
			const current = userHighValueCounts.get(userId) || 0;
			if (toNumber(order.total) >= 1000) {
				userHighValueCounts.set(userId, current + 1);
			}
		}
	}

	const ordersWithFlags = orders
		.map((order) => ({
			order,
			flags: buildOrderFlags(order, userHighValueCounts),
		}))
		.filter((item) => item.flags.length > 0);

	for (const order of orders) {
		const vendorId = order.vendor ? String(order.vendor._id || order.vendor) : "unknown";
		const vendorName = order.vendor?.storeName || "Unknown vendor";
		revenueByVendorMap.set(vendorId, {
			vendorId,
			vendorName,
			revenue: (revenueByVendorMap.get(vendorId)?.revenue || 0) + toNumber(order.total),
			orders: (revenueByVendorMap.get(vendorId)?.orders || 0) + 1,
		});

		for (const item of Array.isArray(order.products) ? order.products : []) {
			const productId = item.product ? String(item.product._id || item.product) : null;
			if (!productId) continue;
			const productName = item.product?.name || "Product";
			const quantity = toNumber(item.quantity) || 0;
			const revenue = toNumber(item.price) * quantity;
			const current = topProductsMap.get(productId) || { productId, productName, quantity: 0, revenue: 0 };
			topProductsMap.set(productId, {
				...current,
				productName,
				quantity: current.quantity + quantity,
				revenue: current.revenue + revenue,
				image: item.product?.images?.[0] || current.image || null,
			});
		}
	}

	const revenuePerVendor = Array.from(revenueByVendorMap.values()).sort((a, b) => b.revenue - a.revenue);
	const topSellingProducts = Array.from(topProductsMap.values())
		.sort((a, b) => b.quantity - a.quantity)
		.slice(0, 8);
	const newOrders = orders.slice(0, 8);
	const vendorRequests = vendors.filter((vendor) => !vendor.isApproved).slice(0, 8);

	const notifications = [
		...newOrders.map((order) => ({
			id: `order-${order._id}`,
			type: "order",
			title: `New order #${String(order._id).slice(-6).toUpperCase()}`,
			description: `${order.user?.name || "Unknown customer"} placed an order worth $${toNumber(order.total).toFixed(2)}`,
			severity: "info",
			createdAt: order.createdAt,
		})),
		...vendorRequests.map((vendor) => ({
			id: `vendor-${vendor._id}`,
			type: "vendor-request",
			title: "Vendor request pending",
			description: `${vendor.storeName || "Vendor"} is waiting for approval.`,
			severity: "warning",
			createdAt: vendor.createdAt,
		})),
		...ordersWithFlags.slice(0, 8).map(({ order, flags }) => ({
			id: `fraud-${order._id}`,
			type: "suspicious-order",
			title: `Suspicious order #${String(order._id).slice(-6).toUpperCase()}`,
			description: flags.join(" • "),
			severity: "danger",
			createdAt: order.createdAt,
		})),
	].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

	const revenueByDayMap = new Map();
	for (const order of orders) {
		const day = new Date(order.createdAt).toLocaleDateString("en-US", { weekday: "short" });
		revenueByDayMap.set(day, (revenueByDayMap.get(day) || 0) + toNumber(order.total));
	}

	return {
		stats: {
			sales: totalSales,
			orders: orders.length,
			customers: customerCount,
			products: products.length,
			vendors: vendorCount,
			vendorRequests: vendorRequests.length,
			suspiciousOrders: ordersWithFlags.length,
		},
		revenueData: Array.from(revenueByDayMap.entries()).map(([day, revenue]) => ({ day, revenue })),
		revenuePerVendor,
		topSellingProducts,
		newOrders,
		vendorRequests,
		suspiciousOrders: ordersWithFlags,
		notifications,
	};
};

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

export const getAdminInsights = async (_req, res) => {
	try {
		const insights = await buildAdminInsights();
		res.json(insights);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const streamAdminInsights = async (req, res) => {
	try {
		res.setHeader("Content-Type", "text/event-stream");
		res.setHeader("Cache-Control", "no-cache");
		res.setHeader("Connection", "keep-alive");
		res.flushHeaders?.();

		let cancelled = false;
		const pushUpdate = async () => {
			if (cancelled) return;
			try {
				const payload = await buildAdminInsights();
				res.write(`data: ${JSON.stringify(payload)}\n\n`);
			} catch (error) {
				res.write(`event: error\ndata: ${JSON.stringify({ message: error.message })}\n\n`);
			}
		};

		await pushUpdate();
		const interval = setInterval(pushUpdate, 10000);

		req.on("close", () => {
			cancelled = true;
			clearInterval(interval);
			res.end();
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};