import express from "express";
import {
	getNotifications,
	markNotificationRead,
	clearNotifications,
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/", getNotifications);
router.delete("/clear", clearNotifications);
router.patch("/:id/read", markNotificationRead);

export default router;