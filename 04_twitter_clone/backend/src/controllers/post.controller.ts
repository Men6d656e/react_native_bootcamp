import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import { getAuth } from "@clerk/express";

import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";
import cloudinary, { uploadToCloudinary } from "../lib/cloudinary.js";
import Notification from "../models/notification.js";

/**
 * @desc    Get all posts with populated data
 * @route   GET /api/posts
 */

export const getPosts = asyncHandler(async (req: Request, res: Response) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate("user", "username firstName lastName profilePicture")
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "username firstName lastName profilePicture",
      },
    })
    .lean();

  res.status(200).json(posts);
});

/**
 * @desc    Get single post by ID
 */
export const getPost = asyncHandler(async (req: Request, res: Response) => {
  const { postId } = req.params;
  if (
    !postId ||
    typeof postId !== "string" ||
    !mongoose.Types.ObjectId.isValid(postId)
  ) {
    res.status(400);
    throw new Error("Invalid Post ID");
  }
  const post = await Post.findById(postId)
    .sort({ createdAt: -1 })
    .populate("user", "username firstName lastName profilePicture")
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "username firstName lastName profilePicture",
      },
    })
    .lean();

  if (!post) throw new Error("Post not found");

  res.status(200).json(post);
});

/**
 * @desc    Get all posts belonging to a specific user by username
 * @route   GET /api/posts/user/:username
 * @access  Public
 */
export const getUserPosts = asyncHandler(
  async (req: Request, res: Response) => {
    const username = req.params.username as string;

    if (!username) {
      throw new Error("Username parameter is required");
    }
    const user = await User.findOne({ username }).select("_id").lean();
    if (!user) throw new Error("User not found");

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate("user", "username firstName lastName profilePicture")
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "user",
          select: "username firstName lastName profilePicture",
        },
      })
      .lean();

    res.status(200).json({ posts });
  },
);

/**
 * @desc    Create a new post with optional image upload
 * @route   POST /api/posts
 */
export const createPost = asyncHandler(async (req: Request, res: Response) => {
  const { userId: clerkId } = getAuth(req);
  const { content } = req.body;
  const imageFile = req.file;

  if (!content && !imageFile) {
    res.status(400);
    throw new Error("Post must contain either text or image");
  }

  const user = await User.findOne({ clerkId });
  if (!user) {
    res.status(404);
    throw new Error("User record not found");
  }

  let imageUrl = "";

  if (imageFile) {
    const uploadResponse = await uploadToCloudinary(
      imageFile,
      "twitter_clone_posts",
      [{ width: 1000, crop: "limit" }, { quality: "auto" }],
    );
    imageUrl = uploadResponse.secure_url;
  }

  const post = await Post.create({
    user: user._id,
    content: content || "",
    image: imageUrl,
  });

  res.status(201).json(post);
});

/**
 * @desc    Like/Unlike a post (Atomic)
 */
export const likePost = asyncHandler(async (req: Request, res: Response) => {
  const { userId: clerkId } = getAuth(req);
  const postId = req.params.postId as string;

  if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
    res.status(400);
    throw new Error("Invalid Post ID");
  }
  const user = await User.findOne({ clerkId });
  const post = await Post.findById(postId);

  if (!user || !post) {
    res.status(404);
    throw new Error("Post or User not found");
  }

  const isLiked = post.likes.includes(user._id as mongoose.Types.ObjectId);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (isLiked) {
      await Post.findByIdAndUpdate(
        postId,
        { $pull: { likes: user._id } },
        { session },
      );
    } else {
      await Post.findByIdAndUpdate(
        postId,
        { $push: { likes: user._id } },
        { session },
      );

      // Only notify if liking someone else's post
      if (post.user.toString() !== user._id.toString()) {
        await Notification.create(
          [
            {
              from: user._id,
              to: post.user,
              type: "like",
              post: new mongoose.Types.ObjectId(postId),
            },
          ],
          { session },
        );
      }
    }

    await session.commitTransaction();
    res.status(200).json({ message: isLiked ? "Unliked" : "Liked" });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

/**
 * @desc    Delete post and associated data (Transaction)
 */
export const deletePost = asyncHandler(async (req: Request, res: Response) => {
  const { userId: clerkId } = getAuth(req);
  const postId = req.params.postId as string;

  if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
    res.status(400);
    throw new Error("Invalid Post ID");
  }

  const user = await User.findOne({ clerkId });
  const post = await Post.findById(postId);

  if (!user || !post) {
    res.status(404);
    throw new Error("Resource not found");
  }

  if (post.user.toString() !== user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this post");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const validPostId = new mongoose.Types.ObjectId(postId);
    await Comment.deleteMany({ post: validPostId }, { session });
    await Notification.deleteMany({ post: validPostId }, { session });
    await Post.findByIdAndDelete(validPostId, { session });

    if (post.image) {
      const publicId = post.image.split("/").pop()?.split(".")[0];
      if (publicId)
        await cloudinary.uploader.destroy(`twitter_clone_posts/${publicId}`);
    }

    await session.commitTransaction();
    res.status(200).json({ message: "Post and associated data deleted" });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

/**
 * @desc    Search posts by content
 * @route   GET /api/posts/search?q=query
 */
export const searchPosts = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query.q as string;

  if (!query) {
    res.status(400);
    throw new Error("Search query is required");
  }

  const posts = await Post.find({
    content: { $regex: query, $options: "i" },
  })
    .sort({ createdAt: -1 })
    .populate("user", "username firstName lastName profilePicture")
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "username firstName lastName profilePicture",
      },
    })
    .lean();

  res.status(200).json(posts);
});
