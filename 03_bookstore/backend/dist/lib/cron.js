import { CronJob } from "cron";
import https from "https";
import { Config } from "../config/config.js";
const job = new CronJob("*/14 * * * *", function () {
    if (!Config.API_URL || Config.API_URL === "<TODO:After-development>") {
        console.log("API_URL not set, skipping cron job");
        return;
    }
    https
        .get(Config.API_URL, (res) => {
        if (res.statusCode === 200)
            console.log("GET request sent successfully");
        else
            console.log("GET request failed", res.statusCode);
    })
        .on("error", (e) => console.error("Error while sending request", e));
});
export default job;
//# sourceMappingURL=cron.js.map