import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getVendorProfile,
  updateVendorProfile,
  getDashboardSummary,
} from "../controllers/vendorController.js";

const router = express.Router();

router.get("/profile", protect, getVendorProfile);
router.put("/profile", protect, updateVendorProfile);
router.get("/dashboard", protect, getDashboardSummary);

export default router;
