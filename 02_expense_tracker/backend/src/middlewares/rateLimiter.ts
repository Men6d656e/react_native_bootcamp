import type { NextFunction, Request, Response } from "express";
import ratelimit from "../config/upstash.js";

const ratelimiter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { success } = await ratelimit.limit("my-rate-limit");
    if (!success) {
      return res
        .status(429)
        .json({ message: "Too many requests, please try again later." });
    }
    next();
  } catch (error) {
    console.log("Rate limit error", error);
    next(error);
  }
};

export default ratelimiter;
