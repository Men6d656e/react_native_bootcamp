import "dotenv/config";
const config = {
    PORT: parseInt(process.env.PORT) || 5001,
    NODE_ENV: (process.env.NODE_ENV || "development"),
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    REDIS_URL: process.env.REDIS_URL,
    API_URL: process.env.API_URL,
};
export default config;
