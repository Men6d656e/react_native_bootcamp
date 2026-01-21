import express, { type Request, type Response } from "express";
import bookRoutes from "./routes/book.routes.js";

const app = express();

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("Server is running 🚀");
});

app.use("/api/v1/books", bookRoutes);

export default app;
