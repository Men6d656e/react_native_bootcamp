import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  createComment,
  deleteComment,
  getComments,
} from "../controllers/comment.controller.js";

const router = Router();

// public routes
router.get("/post/:postId", getComments);

// protected routes
router.post("/post/:postId", authMiddleware, createComment);
router.delete("/:commentId", authMiddleware, deleteComment);

export default router;
