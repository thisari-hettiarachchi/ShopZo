import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import vendorRoutes from './routes/vendorRoutes.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

const allowedOrigins = [
  process.env.VENDOR_FRONTEND_URL,
  "http://localhost:5175",
  "http://localhost:5174",
  "http://localhost:5173",
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

app.use('/api/vendor/products', productRoutes);
app.use('/api/vendor/orders', orderRoutes);
app.use('/api/vendor', analyticsRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/vendor/coupons', couponRoutes);
app.use('/api/vendor/chat', chatRoutes);
app.use('/api/vendor/reviews', reviewRoutes);

app.use('/api/auth', authRoutes);


app.listen(PORT, () => {
	console.log(`Vendor backend server running on port ${PORT}`);
});
