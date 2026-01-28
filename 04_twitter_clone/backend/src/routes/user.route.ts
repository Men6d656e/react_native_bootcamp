import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  followUser,
  getCurrentUser,
  getUserProfile,
  syncUser,
  updateProfile,
} from "../controllers/user.controller.js";

const router = Router();

// public routes
router.get("/profile/:username", getUserProfile);

// private routes
router.post("/sync", authMiddleware, syncUser);
router.get("/me", authMiddleware, getCurrentUser);
router.put("/profile", authMiddleware, updateProfile);
router.post("/follow/:targetUserId", authMiddleware, followUser);

export default router;
