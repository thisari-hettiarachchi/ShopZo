import express from "express";
import { getChatMessages, sendChatMessage } from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/messages", getChatMessages);
router.post("/messages", sendChatMessage);

export default router;