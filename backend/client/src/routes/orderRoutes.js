import express from "express";
import {
  cancelOrder,
  confirmReceipt,
  createOrder,
  getOrderById,
  getOrders,
  getReturns,
  getCancellations,
  requestReturn,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/orders", protect, getOrders);
router.get("/orders/:id", protect, getOrderById);
router.post("/orders/:id/returns", protect, requestReturn);
router.post("/orders/:id/cancel", protect, cancelOrder);
router.post("/orders/:id/confirm-receipt", protect, confirmReceipt);
router.get("/returns", protect, getReturns);
router.get("/cancellations", protect, getCancellations);
router.post("/orders", protect, createOrder);

export default router;
