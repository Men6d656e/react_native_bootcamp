import express from "express";
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

export default app;
