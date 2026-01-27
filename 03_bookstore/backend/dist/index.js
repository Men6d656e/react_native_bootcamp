import app from "./app.js";
import { Config } from "./config/config.js";
import { connectDB } from "./lib/db.js";
import job from "./lib/cron.js";
app.listen(Config.PORT, () => {
    console.log(`Server is running on PORT: ${Config.PORT}`);
    connectDB();
    job.start();
});
//# sourceMappingURL=index.js.map