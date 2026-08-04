import express from "express";
import { protectAdmin } from "../middleware/authMiddleware.js";
import {
	getAdminAnalytics,
	getAdminCustomers,
	getAdminOrders,
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
import {
	getCommissions,
	markCommissionPaid,
	markCommissionUnpaid,
	markVendorCommissionsPaid,
} from "../controllers/commissionController.js";

const router = express.Router();

router.use(protectAdmin);

router.get("/orders", getAdminOrders);
router.patch("/orders/:id/status", updateAdminOrderStatus);
router.get("/commissions", getCommissions);
router.patch("/commissions/:id/paid", markCommissionPaid);
router.patch("/commissions/:id/unpaid", markCommissionUnpaid);
router.patch("/commissions/vendor/:vendorId/paid", markVendorCommissionsPaid);
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