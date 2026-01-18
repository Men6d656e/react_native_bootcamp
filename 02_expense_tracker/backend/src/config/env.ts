import "dotenv/config";
type Config = {
  PORT: number;
  NODE_ENV: "production" | "development" | "test";
  CLERK_PUBLISHABLE_KEY: string;
  CLERK_SECRET_KEY: string;
  DATABASE_URL: string;
  REDIS_URL: string;
  API_URL: string;
};

const config: Config = {
  PORT: parseInt(process.env.PORT!) || 5001,
  NODE_ENV: (process.env.NODE_ENV || "development") as
    | "production"
    | "development"
    | "test",
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY!,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY!,
  DATABASE_URL: process.env.DATABASE_URL!,
  REDIS_URL: process.env.REDIS_URL!,
  API_URL: process.env.API_URL!,
};
export default config;
