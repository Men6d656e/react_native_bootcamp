import asyncHandler from "express-async-handler";
import { getAuth } from "@clerk/express";
import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.js";
import type { Request, Response } from "express";
import mongoose from "mongoose";

/**
 * @desc    Get all comments for a specific post
 * @route   GET /api/posts/:postId/comments
 * @access  Public
 */
export const getComments = asyncHandler(async (req: Request, res: Response) => {
  const postId = req.params.postId as string;
  if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
    res.status(400);
    throw new Error("Invalid Post ID format");
  }

  const comments = await Comment.find({ post: postId })
    .sort({ createdAt: -1 })
    .populate("user", "username firstName lastName profilePicture")
    .lean();

  res.status(200).json({ comments });
});

/**
 * @desc    Create a new comment on a post and notify the author
 * @route   POST /api/posts/:postId/comments
 * @access  Private
 */
export const createComment = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId: clerkId } = getAuth(req);
    const postId = req.params.postId as string;
    const { content } = req.body;

    if (!content || content.trim() === "") {
      res.status(400);
      throw new Error("Comment content cannot be empty");
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      res.status(400);
      throw new Error("Invalid Post ID format");
    }

    const user = await User.findOne({ clerkId });
    const post = await Post.findById(postId);

    if (!user || !post) {
      res.status(404);
      throw new Error("User or Post not found");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const [newComment] = await Comment.create(
        [{ user: user._id, post: postId, content }],
        { session },
      );
      if (!newComment) {
        throw new Error("Failed to create comment");
      }

      await Post.findByIdAndUpdate(
        postId,
        { $push: { comments: newComment._id } },
        { session },
      );

      if (post.user.toString() !== user._id.toString()) {
        await Notification.create(
          [
            {
              from: user._id,
              to: post.user,
              type: "comment",
              post: postId,
              comment: newComment._id,
            },
          ],
          { session },
        );
      }

      await session.commitTransaction();

      // Populate user info for immediate frontend display
      const populatedComment = await newComment.populate(
        "user",
        "username firstName lastName profilePicture",
      );

      res.status(201).json(populatedComment);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },
);

/**
 * @desc    Delete a comment and remove its reference from the post
 * @route   DELETE /api/comments/:commentId
 * @access  Private (Owner only)
 */
export const deleteComment = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId: clerkId } = getAuth(req);
    const commentId = req.params.commentId as string;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      res.status(400);
      throw new Error("Invalid Comment ID format");
    }

    const user = await User.findOne({ clerkId });
    const comment = await Comment.findById(commentId);

    if (!user || !comment) {
      res.status(404);
      throw new Error("User or Comment not found");
    }

    // Authorization check
    if (comment.user.toString() !== user._id.toString()) {
      res.status(403);
      throw new Error("Unauthorized to delete this comment");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Remove reference from Post
      await Post.findByIdAndUpdate(
        comment.post,
        { $pull: { comments: commentId } },
        { session },
      );

      // 2. Remove associated notifications
      await Notification.deleteMany({ comment: commentId }, { session });

      // 3. Delete the actual comment
      await Comment.findByIdAndDelete(commentId, { session });

      await session.commitTransaction();
      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },
);
