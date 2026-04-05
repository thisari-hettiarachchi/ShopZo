import express from "express";
import { cancelOrder, getOrders, getReturns, getCancellations, requestReturn } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { createOrder } from "../controllers/orderController.js";

const router = express.Router();

router.get("/orders", protect, getOrders);
router.post("/orders/:id/returns", protect, requestReturn);
router.post("/orders/:id/cancel", protect, cancelOrder);
router.get("/returns", protect, getReturns);
router.get("/cancellations", protect, getCancellations);
router.post("/orders", protect, createOrder);

export default router;
