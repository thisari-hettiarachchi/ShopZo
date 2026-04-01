import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import vendorRoutes from './routes/vendorRoutes.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

app.use('/api/vendor/products', productRoutes);
app.use('/api/vendor/orders', orderRoutes);
app.use('/api/vendor', analyticsRoutes);
app.use('/api/vendor', vendorRoutes);

app.use('/api/auth', authRoutes);


app.listen(PORT, () => {
	console.log(`Vendor backend server running on port ${PORT}`);
});
