import dotenv from "dotenv";
// Load env before route modules import Stripe / DB configs.
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import connectCloudinary from "./config/cloudinary.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import { stripeWebhook } from "./controllers/checkoutController.js";

connectCloudinary();

const app = express();

const configuredOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const defaultOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://shop-zo.vercel.app",
];

const allowedOrigins = configuredOrigins.length > 0 ? configuredOrigins : defaultOrigins;

// Vite picks the next free port (5173, 5174, 5175, 5176, ...) when running the
// client/vendor/admin dev servers together, so allow any localhost port in dev
// instead of hardcoding a fixed list that breaks the moment a port is taken.
const isLocalDevOrigin = (origin) => /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || isLocalDevOrigin(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

// Stripe requires the raw, unparsed request body to verify webhook signatures,
// so this route must be registered before the JSON body parser below.
app.post("/api/checkout/webhook", express.raw({ type: "application/json" }), stripeWebhook);

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/user", userRoutes); 
app.use("/api/user/addresses", addressRoutes);
app.use("/api/user", orderRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/user/notifications", notificationRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/newsletter", newsletterRoutes);

app.get("/", (req, res) => res.send("ShopZo API running 🚀"));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Failed to start client backend", error.message);
    process.exit(1);
  }
};

startServer();
