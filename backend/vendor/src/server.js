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

const app = express();
const PORT = process.env.PORT || 5001;

const configuredOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const defaultOrigins = [
  process.env.VENDOR_FRONTEND_URL || "https://shop-zo-vendor.vercel.app",
  "http://localhost:5175",
  "http://localhost:5174",
  "http://localhost:5173",
].filter(Boolean);

const allowedOrigins = [...new Set([...defaultOrigins, ...configuredOrigins])];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400,
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));
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


app.get('/', (req, res) => res.send('ShopZo vendor API running 🚀'));

export default app;

const startServer = async () => {
  try {
    await connectDB();
    if (process.env.VERCEL !== '1') {
      app.listen(PORT, () => {
        console.log(`Vendor backend server running on port ${PORT}`);
      });
    }
  } catch (error) {
    console.error('Failed to start vendor backend', error.message);
    if (process.env.VERCEL !== '1') {
      process.exit(1);
    }
  }
};

startServer();
