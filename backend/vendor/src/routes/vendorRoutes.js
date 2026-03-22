import express from "express";
import { getVendors, getVendorProfile, updateVendorProfile } from "../controllers/vendorController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getVendors);
router.get("/profile", authMiddleware, getVendorProfile);
router.put("/profile", authMiddleware, updateVendorProfile);

export default router;
