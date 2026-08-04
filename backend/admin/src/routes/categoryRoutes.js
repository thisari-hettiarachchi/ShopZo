import express from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public read so vendor/client apps can load the admin-managed catalog.
router.get("/", getCategories);
router.get("/public", getCategories);

router.use(protectAdmin);

router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
