import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getVendorChatMessages, getVendorChatThreads, sendVendorChatMessage } from "../controllers/chatController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/threads", getVendorChatThreads);
router.get("/messages/:userId", getVendorChatMessages);
router.post("/messages/:userId", sendVendorChatMessage);

export default router;
