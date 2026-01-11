import express from "express";
import { getCards, addCard, setDefaultCard, updateCard } from "../controllers/cardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getCards);
router.post("/", protect, addCard);
router.patch("/:id/default", protect, setDefaultCard);
router.put("/:id", protect, updateCard);

export default router;
