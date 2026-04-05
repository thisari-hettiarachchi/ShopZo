import express from "express";
import {
	followVendor,
	getVendorFollowStatus,
	getVendors,
	unfollowVendor,
} from "../controllers/vendorController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getVendors);
router.get("/:id/follow-status", protect, getVendorFollowStatus);
router.post("/:id/follow", protect, followVendor);
router.delete("/:id/follow", protect, unfollowVendor);

export default router;
