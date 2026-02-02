import asyncHandler from "express-async-handler";
import User, { type IUser } from "../models/user.model.js";
import Notification from "../models/notification.js";
import type { Request, Response } from "express";
import { clerkClient, getAuth } from "@clerk/express";
import mongoose from "mongoose";
import { uniqueNameGenrator } from "../lib/utils.js";
import cloudinary, { uploadToCloudinary } from "../lib/cloudinary.js";

/**
 * @desc    Get user profile by username
 * @route   GET /api/users/profile/:username
 * @access  Public
 */
export const getUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const username = req.params.username as string;
    if (!username) {
      res.status(400);
      throw new Error("Username is required");
    }
    const user = await User.findOne({ username }).select("-password").lean();
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.status(200).json(user);
  },
);

/**
 * @desc    Update user profile with optional image uploads
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = getAuth(req);
    const { firstName, lastName, bio, location } = req.body;
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const updateData: any = {
      firstName,
      lastName,
      bio,
      location,
    };

    if (files?.profilePicture?.[0]) {
      const uploadResponse = await uploadToCloudinary(
        files.profilePicture[0],
        "twitter_clone_profiles",
        [{ width: 400, height: 400, crop: "fill" }],
      );
      updateData.profilePicture = uploadResponse.secure_url;
    }

    if (files?.bannerImage?.[0]) {
      const uploadResponse = await uploadToCloudinary(
        files.bannerImage[0],
        "twitter_clone_banners",
        [{ width: 1200, height: 400, crop: "fill" }],
      );
      updateData.bannerImage = uploadResponse.secure_url;
    }

    const updatedUser = await User.findOneAndUpdate(
      { clerkId: userId },
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    if (!updatedUser) {
      res.status(404);
      throw new Error("User not found");
    }

    res.status(200).json(updatedUser);
  },
);

/**
 * @desc    Sync Clerk User with MongoDB (Idempotent)
 * @route   POST /api/users/sync
 * @access  Private
 */
export const syncUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  try {
    let user = await User.findOne({ clerkId: userId });

    if (user) {
      res.status(200).json({ user, message: "User already synced" });
      return;
    }

    const clerkUser = await clerkClient.users.getUser(userId);

    const primaryEmail =
      clerkUser.emailAddresses?.[0]?.emailAddress || `user_${userId}`;

    const userData: Partial<IUser> = {
      clerkId: userId,
      email: primaryEmail,
      firstName: clerkUser.firstName || "",
      lastName: clerkUser.lastName || "",
      username:
        clerkUser.username ||
        primaryEmail.split("@")[0] ||
        uniqueNameGenrator(),
      profilePicture: clerkUser.imageUrl || "",
    };

    user = await User.create(userData);
    res.status(201).json({ user, message: "User created successfully" });
  } catch (error: any) {
    console.error("SYNC ERROR:", error.message);
    res
      .status(500)
      .json({ error: "Backend Sync Failed", details: error.message });
  }
});

/**
 * @desc    Get current authenticated user profile
 * @route   GET /api/users/me
 * @access  Private
 */
export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = getAuth(req);

    if (!userId) {
      res.status(401);
      throw new Error("Unauthorized access");
    }

    const user = await User.findOne({ clerkId: userId }).lean();

    if (!user) {
      res.status(404);
      throw new Error("User record does not exist in our database");
    }

    res.status(200).json(user);
  },
);

/**
 * @desc    Follow/Unfollow User (Atomic Transaction)
 * @route   POST /api/users/follow/:targetUserId
 * @access  Private
 */
export const followUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId: clerkId } = getAuth(req);
  const { targetUserId } = req.params;

  if (!targetUserId || typeof targetUserId !== "string") {
    res.status(400);
    throw new Error("Invalid User ID");
  }

  if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
    res.status(400);
    throw new Error("Invalid User ID format");
  }
  const currentUser = await User.findOne({ clerkId });
  if (!currentUser) {
    res.status(404);
    throw new Error("Current user not found");
  }

  if (currentUser._id.toString() === targetUserId) {
    res.status(400);
    throw new Error("You cannot follow yourself");
  }

  const isFollowing = currentUser.following.some(
    (id: any) => id.toString() === targetUserId,
  );
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (isFollowing) {
      // UNFOLLOW logic
      await User.findByIdAndUpdate(
        currentUser._id,
        { $pull: { following: targetUserId } },
        { session },
      );
      await User.findByIdAndUpdate(
        targetUserId,
        { $pull: { followers: currentUser._id } },
        { session },
      );
    } else {
      // FOLLOW logic
      await User.findByIdAndUpdate(
        currentUser._id,
        { $push: { following: targetUserId } },
        { session },
      );
      await User.findByIdAndUpdate(
        targetUserId,
        { $push: { followers: currentUser._id } },
        { session },
      );

      await Notification.create(
        [
          {
            from: currentUser._id,
            to: targetUserId,
            type: "follow",
          },
        ],
        { session },
      );
    }

    await session.commitTransaction();
    res.status(200).json({
      success: true,
      message: isFollowing ? "Unfollowed" : "Followed",
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});
