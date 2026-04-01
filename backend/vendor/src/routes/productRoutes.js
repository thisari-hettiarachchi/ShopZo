import express from "express";
import { 
  getVendorProducts, 
  addVendorProduct, 
  updateVendorProduct, 
  deleteVendorProduct, 
  getVendorProductById
} from "../controllers/productController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.route("/")
  .get(getVendorProducts)
  .post(addVendorProduct);

router.route("/:id")
  .get(getVendorProductById)
  .put(updateVendorProduct)
  .delete(deleteVendorProduct);

export default router;
