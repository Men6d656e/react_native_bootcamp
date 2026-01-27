import type { Request, Response } from "express";
import Book from "../models/Book.model.js";
import cloudinary from "../lib/cloudinary.js";
import type { Types } from "mongoose";

interface CreateBookRequestBody {
  title: string;
  caption: string;
  rating: number;
  image: string;
}

// Helper function to extract public ID from Cloudinary URL
const getPublicIdFromUrl = (url: string): string => {
  if (!url) return "";

  const parts = url.split("/");
  const fileName = parts[parts.length - 1];
  if (!fileName) return "";
  return fileName.split(".")[0] || "";
};

export const createBook = async (
  req: Request<{}, {}, CreateBookRequestBody>,
  res: Response
): Promise<Response> => {
  try {
    const { title, caption, rating, image } = req.body;

    if (!image || !title || !caption || !rating) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    // upload the image to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image);
    const imageUrl = uploadResponse.secure_url;

    // save to the database
    const newBook = new Book({
      title,
      caption,
      rating,
      image: imageUrl,
      user: req.user!._id,
    });

    await newBook.save();

    return res.status(201).json(newBook);
  } catch (error) {
    console.log("Error creating book", error);
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const getAllBooks = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 2;
    const skip = (page - 1) * limit;

    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImage");

    const totalBooks = await Book.countDocuments();

    return res.status(200).json({
      books,
      currentPage: page,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    console.log("Error in get all books route", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserBooks = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const books = await Book.find({ user: req.user!._id }).sort({
      createdAt: -1,
    });
    return res.status(200).json(books);
  } catch (error) {
    console.error("Get user books error:", (error as Error).message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteBook = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<Response> => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // check if user is the creator of the book
    if (book.user.toString() !== req.user!._id.toString())
      return res.status(401).json({ message: "Unauthorized" });

    // delete image from cloudinary as well
    if (book.image && book.image.includes("cloudinary")) {
      try {
        const publicId = getPublicIdFromUrl(book.image);
        await cloudinary.uploader.destroy(publicId);
      } catch (deleteError) {
        console.log("Error deleting image from cloudinary", deleteError);
      }
    }

    await book.deleteOne();

    return res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.log("Error deleting book", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};