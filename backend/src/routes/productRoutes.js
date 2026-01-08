import express from "express";
import {
  getProducts,
  getProductById,
  getFlashSaleProducts
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/flash-sale", getFlashSaleProducts); 
router.get("/:id", getProductById);

export default router;
