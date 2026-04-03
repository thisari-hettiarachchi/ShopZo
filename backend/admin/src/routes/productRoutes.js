import express from "express";
import { createProduct, getProductById, getProducts, updateProduct } from "../controllers/productController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protectAdmin, getProducts);
router.post("/", protectAdmin, createProduct);
router.get("/:id", protectAdmin, getProductById);
router.put("/:id", protectAdmin, updateProduct);

export default router;
