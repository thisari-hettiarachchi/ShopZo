import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getAddresses,
  addAddress,
  updateAddress,
  setDefaultAddress
} from "../controllers/addressController.js";

const router = express.Router();

router.get("/", protect, getAddresses); // GET /api/users/addresses
router.post("/", protect, addAddress); // POST /api/users/addresses
router.put("/:id", protect, updateAddress); // PUT /api/users/addresses/:id
router.patch("/:id/default", protect, setDefaultAddress); // PATCH /api/users/addresses/:id/default

export default router;
