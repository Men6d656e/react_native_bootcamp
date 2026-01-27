import "dotenv/config";
const PORT = Number(process.env.PORT);
if (!PORT) {
    throw new Error("❌ PORT is not defined in environment variables");
}
export const Config = {
    PORT: PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    MONGO_URI: process.env.MONGO_URI,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    API_URL: process.env.API_URL,
};
//# sourceMappingURL=config.js.map