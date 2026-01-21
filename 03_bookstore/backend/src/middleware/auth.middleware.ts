import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import type { NextFunction, Request, Response } from "express";
import { Config } from "../config/config.js";

const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  if (!token)
    return res
      .status(401)
      .json({ message: "No authentication token, access denied" });

  const decoded = jwt.verify(token, Config.JWT_SECRET);
};

export default protectRoute;
