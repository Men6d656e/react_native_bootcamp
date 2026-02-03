import "dotenv/config";

type Config = {
  PORT: number | string;
  API_URL: string;
  DATABASE_URL: string;
};

const config: Config = {
  PORT: process.env.PORT || 3000,
  API_URL: process.env.API_URL!,
  DATABASE_URL: process.env.DATABASE_URL!,
};

export default config;
