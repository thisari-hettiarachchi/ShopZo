import express from "express";
import { getOrders, getReturns, getCancellations } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/orders", protect, getOrders);
router.get("/returns", protect, getReturns);
router.get("/cancellations", protect, getCancellations);

export default router;
