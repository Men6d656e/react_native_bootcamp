import type { NextFunction, Request, Response } from "express";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.auth().isAuthenticated) {
    return res
      .status(401)
      .json({ message: "Unauthorized you must be logged in" });
  }
  next();
};

export default authMiddleware;
