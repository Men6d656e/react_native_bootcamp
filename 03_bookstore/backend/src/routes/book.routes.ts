import { Router } from "express";
import Book from "../models/Book.model.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { title, caption, image, rating, user } = req.body;
    const newBook = new Book({ title, caption, image, rating, user });
    await newBook.save();
    return res.status(201).json(newBook);
  } catch (error) {
    return res.status(400).json({ message: "Error creating book", error });
  }
});

export default router;
