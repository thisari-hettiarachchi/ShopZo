import express from "express";
import { protectAdmin } from "../middleware/authMiddleware.js";
import {
	getAdminAnalytics,
	getAdminCustomers,
	getAdminOrders,
	getAdminInsights,
	getAdminReviews,
	getAdminVendors,
	streamAdminInsights,
	updateAdminOrderStatus,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(protectAdmin);

router.get("/orders", getAdminOrders);
router.patch("/orders/:id/status", updateAdminOrderStatus);
router.get("/customers", getAdminCustomers);
router.get("/analytics", getAdminAnalytics);
router.get("/reviews", getAdminReviews);
router.get("/vendors", getAdminVendors);
router.get("/insights", getAdminInsights);
router.get("/notifications/stream", streamAdminInsights);

export default router;