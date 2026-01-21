import "dotenv/config";

const PORT = Number(process.env.PORT);

if (!PORT) {
  throw new Error("❌ PORT is not defined in environment variables");
}

interface Config {
  PORT: number;
  JWT_SECRET: string;
}
export const Config: Config = {
  PORT: PORT,
  JWT_SECRET: process.env.JWT_SECRET!,
};
