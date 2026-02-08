import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";

dotenv.config();

const app = express();

app.use(
	cors({
		origin: process.env.CORS_ORIGINS
			? process.env.CORS_ORIGINS.split(",").map((o) => o.trim())
			: true,
		credentials: true,
	})
);

app.use(express.json());

app.get("/", (req, res) => res.send("ShopZo Vendor API running 🚀"));
app.use("/api/auth", authRoutes);
app.use("/api/vendor", vendorRoutes);

const PORT = process.env.PORT || 5002;

const start = async () => {
	await connectDB();
	app.listen(PORT, () => console.log(`Vendor server running on port ${PORT}`));
};

start().catch((err) => {
	console.error("Failed to start server ❌", err);
	process.exit(1);
});
