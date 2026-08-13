import express from "express";
import {
  addVendorReview,
  followVendor,
  getVendorById,
  getVendorFollowStatus,
  getVendorProducts,
  getVendorReviewEligibility,
  getVendorReviews,
  getVendors,
  unfollowVendor,
} from "../controllers/vendorController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getVendors);
router.get("/:id", getVendorById);
router.get("/:id/products", getVendorProducts);
router.get("/:id/reviews", getVendorReviews);
router.get("/:id/review-eligibility", protect, getVendorReviewEligibility);
router.post("/:id/reviews", protect, addVendorReview);
router.get("/:id/follow-status", protect, getVendorFollowStatus);
router.post("/:id/follow", protect, followVendor);
router.delete("/:id/follow", protect, unfollowVendor);

export default router;
