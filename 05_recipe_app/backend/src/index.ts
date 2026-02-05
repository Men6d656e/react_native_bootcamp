import app from "./app.js";
import config from "./config/env.js";
import job from "./config/cron.js";

const PORT = config.PORT || 5000;

/**
 * Start the keep-alive cron job if in production.
 */
if (process.env.NODE_ENV === "production") {
  job.start();
  console.log("Keep-alive cron job started.");
}

/**
 * Start the Express server.
 */
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});
