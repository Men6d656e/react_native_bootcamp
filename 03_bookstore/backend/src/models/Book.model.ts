import mongoose, { Model, Schema, Types } from "mongoose";

export interface IBook {
  title: string;
  caption: string;
  image: string;
  rating: number;
  user: Types.ObjectId;
}

export interface BookDocument extends IBook, mongoose.Document {}

const BookSchema = new mongoose.Schema<BookDocument>(
  {
    title: { type: String, required: true },
    caption: { type: String, required: true },
    image: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

const Book: Model<BookDocument> =
  mongoose.models.Book || mongoose.model<BookDocument>("Book", BookSchema);

export default Book;
