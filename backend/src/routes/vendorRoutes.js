import express from "express";
import { getVendors } from "../controllers/vendorController.js";

const router = express.Router();

router.get("/", getVendors);

export default router;
