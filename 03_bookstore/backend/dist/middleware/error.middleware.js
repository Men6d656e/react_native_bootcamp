export class AppError extends Error {
    message;
    statusCode;
    constructor(message, statusCode = 500) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.name = "AppError";
    }
}
export const errorHandler = (err, req, res, next) => {
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
//# sourceMappingURL=error.middleware.js.map