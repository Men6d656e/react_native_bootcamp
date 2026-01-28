import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
import notificationRoutes from "./routes/notification.route.js";
import { arcjetMiddleware } from "./middlewares/arcjet.middleware.js";

const app = express();

app.use(clerkMiddleware());
app.use(arcjetMiddleware);
app.use(cors());
app.use(express.json());

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Welcome to the Twitter Clone API!");
});

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);

app.use(errorHandler);

export default app;
