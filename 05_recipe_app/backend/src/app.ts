import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import favoritesRoutes from "./routes/favorites.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

/**
 * Health check endpoint.
 */
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy" });
});

// API Routes
app.use("/api/favorites", favoritesRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
