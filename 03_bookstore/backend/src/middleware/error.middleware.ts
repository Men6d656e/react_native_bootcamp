import type { Request, Response, NextFunction } from "express";

export class AppError extends Error {
    constructor(
        public message: string,
        public statusCode: number = 500,
    ) {
        super(message);
        this.name = "AppError";
    }
}

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    console.error(err);

    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        status: "error",
        statusCode,
        message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};
