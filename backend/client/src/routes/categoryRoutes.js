import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({}).select("name image").lean();
    res.set("Cache-Control", "public, max-age=120");
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
