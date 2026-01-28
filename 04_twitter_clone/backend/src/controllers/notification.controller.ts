import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import { getAuth } from "@clerk/express";
import User from "../models/user.model.js";
import Notification from "../models/notification.js";

/**
 * @desc    Get all notifications for the authenticated user
 * @route   GET /api/notifications
 * @access  Private
 */
export const getNotifications = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId: clerkId } = getAuth(req);

    const user = await User.findOne({ clerkId }).select("_id").lean();
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const notifications = await Notification.find({ to: user._id })
      .sort({ createdAt: -1 })
      .populate("from", "username firstName lastName profilePicture")
      .populate("post", "content image")
      .populate("comment", "content")
      .lean();

    res.status(200).json(notifications);
  },
);

/**
 * @desc    Delete a specific notification
 * @route   DELETE /api/notifications/:notificationId
 * @access  Private (Owner only)
 */
export const deleteNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId: clerkId } = getAuth(req);
    const notificationId = req.params.notificationId as string;

    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      res.status(400);
      throw new Error("Invalid Notification ID format");
    }

    const user = await User.findOne({ clerkId }).select("_id").lean();
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      to: user._id,
    });

    if (!notification) {
      res.status(404);
      throw new Error("Notification not found or unauthorized");
    }

    res.status(200).json({ message: "Notification deleted successfully" });
  },
);
