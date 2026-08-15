import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import { getNotifications, getUnreadNotificationCount, markNotificationAsRead } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/notifications" , authMiddleware, getNotifications);

router.get("/notifications/unread-count", authMiddleware, getUnreadNotificationCount);

router.patch("/notifications/:notification_id" , authMiddleware, markNotificationAsRead);

export default router;