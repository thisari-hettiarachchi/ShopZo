import express from "express";
import {
  getBanners,
  updateBannerStatus,
  updateBannerActive,
  deleteBanner,
} from "../controllers/bannerController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protectAdmin);

router.get("/", getBanners);
router.patch("/:id/status", updateBannerStatus);
router.patch("/:id/active", updateBannerActive);
router.delete("/:id", deleteBanner);

export default router;
