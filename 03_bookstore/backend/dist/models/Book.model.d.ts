import mongoose, { Model, Types } from "mongoose";
export interface IBook {
    title: string;
    caption: string;
    image: string;
    rating: number;
    user: Types.ObjectId;
}
export interface BookDocument extends IBook, mongoose.Document {
}
declare const Book: Model<BookDocument>;
export default Book;
//# sourceMappingURL=Book.model.d.ts.map