import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

const allowedOrigins = [
	process.env.ADMIN_FRONTEND_URL,
	"http://localhost:5175",
	"http://localhost:5173",
	"http://localhost:5174",
].filter(Boolean);

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin || allowedOrigins.includes(origin)) {
				return callback(null, true);
			}
			return callback(new Error(`CORS blocked for origin: ${origin}`));
		},
		credentials: true,
	})
);

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

app.get("/", (_req, res) => {
	res.send("ShopZo admin API running");
});

// Keep both prefixes so older frontends that call /api/auth/login continue to work.
app.use("/api/auth", authRoutes);
app.use("/api/admin/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/admin/products", productRoutes);

const startServer = async () => {
	try {
		await connectDB();
		app.listen(PORT, () => {
			console.log(`Admin backend server running on port ${PORT}`);
		});
	} catch (error) {
		console.error("Failed to start admin backend", error.message);
		process.exit(1);
	}
};

startServer();
