import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { uploadImageMiddleware } from "../middlewares/upload.middleware.js";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  getUserPosts,
  likePost,
  searchPosts,
} from "../controllers/post.controller.js";

const router = Router();

// public routes
router.get("/", getPosts);
router.get("/search", searchPosts);
router.get("/:postId", getPost);
router.get("/user/:username", getUserPosts);

// private routes
router.post("/", authMiddleware, uploadImageMiddleware, createPost);
router.post("/:postId/like", authMiddleware, likePost);
router.delete("/:postId", authMiddleware, deletePost);

export default router;
