import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import vendorRoutes from './routes/vendorRoutes.js';
import authRoutes from './routes/authRoutes.js';
import Product from './models/Product.js';
import Order from './models/Order.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}));
app.use(express.json());

app.use('/api/vendor', vendorRoutes);

app.use('/api/auth', authRoutes);


app.listen(PORT, () => {
	console.log(`Vendor backend server running on port ${PORT}`);
});
