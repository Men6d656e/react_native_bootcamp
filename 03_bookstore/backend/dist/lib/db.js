import mongoose from "mongoose";
import { Config } from "../config/config.js";
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(Config.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};
//# sourceMappingURL=db.js.map