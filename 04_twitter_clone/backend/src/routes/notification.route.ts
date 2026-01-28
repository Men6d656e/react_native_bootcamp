import { Router } from "express";
import {
  deleteNotification,
  getNotifications,
} from "../controllers/notification.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, getNotifications);
router.delete("/:notificationId", authMiddleware, deleteNotification);

export default router;
