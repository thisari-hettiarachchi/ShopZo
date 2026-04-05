import express from "express";
import {
	getVendors,
	getVendorProfile,
	getVendorNotifications,
	markVendorNotificationRead,
	sendApprovalRequest,
	submitVendorDocumentsVerification,
	submitVendorEmailVerification,
	updateVendorProfile,
} from "../controllers/vendorController.js";
import { getUsers } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getVendors);
router.get("/users", getUsers); // Get all registered users (customers)
router.get("/profile", authMiddleware, getVendorProfile);
router.put("/profile", authMiddleware, updateVendorProfile);
router.post("/approval-request", authMiddleware, sendApprovalRequest);
router.get("/notifications", authMiddleware, getVendorNotifications);
router.patch("/notifications/:id/read", authMiddleware, markVendorNotificationRead);
router.patch("/verification/documents", authMiddleware, submitVendorDocumentsVerification);
router.patch("/verification/email", authMiddleware, submitVendorEmailVerification);

export default router;
