import express from "express";
import { protectAdmin } from "../middleware/authMiddleware.js";
import {
	getAdminAnalytics,
	getAdminCustomers,
	getAdminOrders,
	getAdminPayments,
	refundOrder,
	getAdminInsights,
	getAdminReviews,
	getAdminAllReviews,
	deleteAdminReview,
	getAdminVendors,
	streamAdminInsights,
	updateVendorApproval,
	updateVendorStatus,
	updateVendorDocumentVerification,
	suspendCustomer,
	updateAdminOrderStatus,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(protectAdmin);

router.get("/orders", getAdminOrders);
router.patch("/orders/:id/status", updateAdminOrderStatus);
router.get("/payments", getAdminPayments);
router.post("/orders/:id/refund", refundOrder);
router.get("/customers", getAdminCustomers);
router.patch("/customers/:id/suspend", suspendCustomer);
router.get("/analytics", getAdminAnalytics);
router.get("/reviews", getAdminReviews);
router.get("/reviews/all", getAdminAllReviews);
router.delete("/reviews/:id", deleteAdminReview);
router.get("/vendors", getAdminVendors);
router.patch("/vendors/:id/approval", updateVendorApproval);
router.patch("/vendors/:id/status", updateVendorStatus);
router.patch("/vendors/:id/documents", updateVendorDocumentVerification);
router.get("/insights", getAdminInsights);
router.get("/notifications/stream", streamAdminInsights);

export default router;