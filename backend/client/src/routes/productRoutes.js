import express from "express";
import {
  addProductReview,
  getProducts,
  getProductById,
  getFlashSaleProducts,
  getProductReviews,
  getProductSuggestions,
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/search/suggestions", getProductSuggestions);
router.get("/flash-sale", getFlashSaleProducts); 
router.get("/:id/reviews", getProductReviews);
router.post("/:id/reviews", protect, addProductReview);
router.get("/:id", getProductById);

export default router;
