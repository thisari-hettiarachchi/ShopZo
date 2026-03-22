import express from "express";
import { 
  getVendorProducts, 
  addVendorProduct, 
  updateVendorProduct, 
  deleteVendorProduct 
} from "../controllers/productController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.route("/")
  .get(getVendorProducts)
  .post(addVendorProduct);

router.route("/:id")
  .put(updateVendorProduct)
  .delete(deleteVendorProduct);

export default router;
