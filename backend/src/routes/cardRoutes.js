import express from "express";
import { getCards, addCard, setDefaultCard } from "../controllers/cardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getCards);
router.post("/", protect, addCard);
router.patch("/:id/default", protect, setDefaultCard);

export default router;
