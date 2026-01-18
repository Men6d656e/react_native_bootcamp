import express, { type Request, type Response } from "express";
import { initDB } from "./config/db.js";
import config from "./config/env.js";
import transactionRoutes from "./routes/transactionsRoute.js";
import job from "./config/cron.js";
import ratelimiter from "./middlewares/rateLimiter.js";

const app = express();

if (process.env.NODE_ENV === "production") job.start();

app.use(express.json());
app.use(ratelimiter);

app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/transactions", transactionRoutes);

// Export it for the test runner
export default app;

// Only start the server if we are NOT in a test environment
if (config.NODE_ENV !== "test") {
  initDB().then(() => {
    app.listen(config.PORT, () => {
      console.log("Server is up and running on PORT:", config.PORT);
    });
  });
}
