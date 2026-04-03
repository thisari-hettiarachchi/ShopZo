import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createCoupon, deleteCoupon, getVendorCoupons, updateCoupon } from "../controllers/couponController.js";

const router = express.Router();

router.use(authMiddleware);

router.route("/")
  .get(getVendorCoupons)
  .post(createCoupon);

router.route("/:id")
  .put(updateCoupon)
  .delete(deleteCoupon);

export default router;
