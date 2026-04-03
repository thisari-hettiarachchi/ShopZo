import express from "express";
import { getDashboardSummary } from "../controllers/dashboardController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/summary", protectAdmin, getDashboardSummary);

export default router;
