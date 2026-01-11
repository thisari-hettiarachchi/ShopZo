import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeWishlistItem,
} from "../controllers/wishlistController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getWishlist);
router.post("/add", addToWishlist);
router.delete("/remove/:productId", removeWishlistItem);

export default router;
