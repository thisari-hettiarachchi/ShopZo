import express from "express";
import { createCheckoutSession, confirmCheckoutSession, validateCoupon } from "../controllers/checkoutController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-session", protect, createCheckoutSession);
router.get("/session/:id/confirm", protect, confirmCheckoutSession);
router.post("/validate-coupon", protect, validateCoupon);

export default router;
