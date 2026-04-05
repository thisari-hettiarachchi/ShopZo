import express from "express";
import { getChatMessages, getChatThreads, sendChatMessage } from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/threads", getChatThreads);
router.get("/messages", getChatMessages);
router.post("/messages", sendChatMessage);

export default router;