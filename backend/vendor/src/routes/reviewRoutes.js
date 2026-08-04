import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getVendorReviewInsights, getVendorReviews, replyToReview } from "../controllers/reviewController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getVendorReviews);
router.get("/insights", getVendorReviewInsights);
router.put("/:id/reply", replyToReview);

export default router;
