import express from "express";
import {
  getWishlist,
  getWishlistIds,
  addToWishlist,
  removeWishlistItem,
  clearWishlist,
} from "../controllers/wishlistController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getWishlist);
router.get("/ids", getWishlistIds);
router.post("/add", addToWishlist);
router.delete("/clear", clearWishlist);
router.delete("/remove/:productId", removeWishlistItem);

export default router;
