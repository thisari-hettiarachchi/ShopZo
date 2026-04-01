import express from "express";
import { getVendorOrders, updateOrderStatus } from "../controllers/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.route("/")
  .get(getVendorOrders);

router.route("/:id/status")
  .put(updateOrderStatus);

export default router;
