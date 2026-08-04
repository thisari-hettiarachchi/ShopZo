import express from "express";
import { getDashboardAnalytics, getVendorEarnings } from "../controllers/analyticsController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/dashboard", getDashboardAnalytics);
router.get("/earnings", getVendorEarnings);

export default router;
