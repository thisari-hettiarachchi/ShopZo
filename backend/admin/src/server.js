import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5002;

const allowedOrigins = [
	process.env.ADMIN_FRONTEND_URL,
	"http://localhost:5175",
	"http://localhost:5173",
].filter(Boolean);

app.use(
	cors({
		origin: allowedOrigins,
		credentials: true,
	})
);

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

app.get("/", (_req, res) => {
	res.send("ShopZo admin API running");
});

app.use("/api/admin/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/admin/products", productRoutes);

app.listen(PORT, () => {
	console.log(`Admin backend server running on port ${PORT}`);
});
