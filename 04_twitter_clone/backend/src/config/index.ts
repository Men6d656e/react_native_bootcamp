import "dotenv/config";

type Config = {
  PORT: number;
  MONGO_URI?: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  ARCJET_KEY: string;
};

const config: Config = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 4000,
  MONGO_URI: process.env.MONGO_URI!,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET!,
  ARCJET_KEY: process.env.ARCJET_KEY!,
};

export default config;
