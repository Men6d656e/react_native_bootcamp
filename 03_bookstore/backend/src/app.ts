import express, { type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import bookRoutes from "./routes/book.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import swaggerUi from "swagger-ui-express";
import specs from "./config/swagger.js";
import redoc from "redoc-express";

const app = express();

// Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "cdn.redoc.ly",
          "unpkg.com",
          "cdn.jsdelivr.net",
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "fonts.googleapis.com",
          "cdn.jsdelivr.net",
        ],
        fontSrc: ["'self'", "fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "res.cloudinary.com"],
        connectSrc: ["'self'"],
      },
    },
  }),
);
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
app.use("/api/", limiter);

app.get("/swagger.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(specs);
});

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    customSiteTitle: "Bookstore API - Interactive Docs",
    customCss: ".swagger-ui .topbar { display: none }", // Hiding header for a cleaner look
  }),
);

app.get(
  "/api-reference",
  (redoc as any)({
    title: "Bookstore API Reference",
    specUrl: "/swagger.json",
  }),
);

app.get("/", (_req: Request, res: Response) => {
  res.send("Server is running 🚀");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/books", bookRoutes);

// Error Handling
app.use(errorHandler);

export default app;
