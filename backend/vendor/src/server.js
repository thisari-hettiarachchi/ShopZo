

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import Product from './models/Product.js';
import Order from './models/Order.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// TODO: Replace with real DB queries
// Sample data for dashboard only
const dashboard = {
	stats: [
		{ title: 'Sales', value: '$12,430', change: '+12%', up: true },
		{ title: 'Orders', value: '320', change: '-5%', up: false },
		{ title: 'Customers', value: '1,024', change: '+8%', up: true },
		{ title: 'Reviews', value: '85', change: '+2%', up: true },
	],
	categoryData: [
		{ name: 'Electronics', value: 45, color: '#F59E0B' },
		{ name: 'Clothing', value: 30, color: '#3B82F6' },
		{ name: 'Accessories', value: 25, color: '#10B981' },
	],
	revenueData: [
		{ day: 'Mon', revenue: 1200 },
		{ day: 'Tue', revenue: 2100 },
		{ day: 'Wed', revenue: 800 },
		{ day: 'Thu', revenue: 1600 },
		{ day: 'Fri', revenue: 900 },
		{ day: 'Sat', revenue: 1700 },
		{ day: 'Sun', revenue: 1100 },
	],
};

// API endpoints (products and orders to be replaced with DB queries)

// Get all products
app.get('/api/products', async (req, res) => {
	try {
		const products = await Product.find();
		res.json(products);
	} catch (err) {
		res.status(500).json({ message: 'Error fetching products', error: err.message });
	}
});


// Get all orders
app.get('/api/orders', async (req, res) => {
	try {
		const orders = await Order.find().populate('user').populate('items.product').populate('items.vendor');
		res.json(orders);
	} catch (err) {
		res.status(500).json({ message: 'Error fetching orders', error: err.message });
	}
});

app.get('/api/dashboard', (req, res) => {
	res.json(dashboard);
});

app.listen(PORT, () => {
	console.log(`Vendor backend server running on port ${PORT}`);
});
