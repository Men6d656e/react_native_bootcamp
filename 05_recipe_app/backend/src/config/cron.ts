import cron from "cron";
import https from "https";
import config from "./env.js";

/**
 * Cron job to ping the API every 14 minutes to keep it alive (useful for free tiers like Render).
 */
const job = new cron.CronJob("*/14 * * * *", function () {
    if (!config.API_URL) {
        console.log("API_URL not defined, skipping cron ping.");
        return;
    }

    https
        .get(config.API_URL, (res) => {
            if (res.statusCode === 200) {
                console.log("Health check ping sent successfully");
            } else {
                console.log("Health check ping failed with status:", res.statusCode);
            }
        })
        .on("error", (e) => {
            console.error("Error during health check ping:", e.message);
        });
});

export default job;
