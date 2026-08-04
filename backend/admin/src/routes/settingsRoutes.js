import express from "express";
import {
  getSettings,
  updateFlashSaleStatus,
  getFlashSaleProducts,
} from "../controllers/settingsController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protectAdmin);

router.get("/", getSettings);
router.patch("/flash-sale", updateFlashSaleStatus);
router.get("/flash-sale/products", getFlashSaleProducts);

export default router;
