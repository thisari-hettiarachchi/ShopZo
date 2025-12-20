const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");

// GET all feedbacks
router.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST feedback
router.post("/", async (req, res) => {
  try {
    const { name, role, message, rating } = req.body;
    if (!name || !role || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const feedback = new Feedback({ name, role, message, rating });
    await feedback.save();
    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
