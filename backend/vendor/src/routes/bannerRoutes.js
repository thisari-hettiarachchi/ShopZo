import express from "express";
import {
  getVendorBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  requestBannerApproval,
} from "../controllers/bannerController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getVendorBanners);
router.post("/", createBanner);
router.put("/:id", updateBanner);
router.delete("/:id", deleteBanner);
router.patch("/:id/request-approval", requestBannerApproval);

export default router;
