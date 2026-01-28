import mongoose, { Document, Model, Schema } from "mongoose";

export type NotificationType = "follow" | "like" | "comment";

export interface INotification extends Document {
  from: mongoose.Types.ObjectId;
  to: mongoose.Types.ObjectId;
  type: NotificationType;
  post?: mongoose.Types.ObjectId | null;
  comment?: mongoose.Types.ObjectId | null;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}
const notificationSchema = new Schema<INotification>(
  {
    from: { type: Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["follow", "like", "comment"],
      required: true,
    },
    post: { type: Schema.Types.ObjectId, ref: "Post", default: null },
    comment: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
    read: { type: Boolean, default: false },
  },

  { timestamps: true },
);

const Notification: Model<INotification> =
  mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", notificationSchema);

export default Notification;
