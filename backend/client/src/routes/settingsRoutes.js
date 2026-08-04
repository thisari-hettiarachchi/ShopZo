import express from "express";
import Settings from "../models/Settings.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const settings = await Settings.findOne({ key: "global" });
    res.json({ flashSaleEnabled: Boolean(settings?.flashSaleEnabled) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
