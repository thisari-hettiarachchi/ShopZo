import express from "express";
import { getAdminProfile, loginAdmin, updateAdminProfile } from "../controllers/authController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/me", protectAdmin, getAdminProfile);
router.put("/me", protectAdmin, updateAdminProfile);

export default router;
