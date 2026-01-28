import app from "./app.js";
import config from "./config/index.js";
import connectDB from "./lib/db.js";

try {
  await connectDB().then(() => {
    app.listen(config.PORT, () => {
      console.log(`Server is running on PORT: ${config.PORT}`);
    });
  });
} catch (error) {
  console.error("Failed to start the server:", error);
  process.exit(1);
}
