import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error";
import { logger } from "../utils/logger";
import { appConfig } from "../config/app-config";

export const errorHandler = (err: Error | AppError, req: Request, res: Response, _next: NextFunction): void => {
  let error = { ...err } as AppError;
  error.message = err.message;

  if (err.name === "CastError") {
    const message = "Resource not found";
    error = new AppError(message, 404);
  }

  if (err.name === "ValidationError") {
    const message = Object.values((err as any).errors)
      .map((val: any) => val.message)
      .join(", ");
    error = new AppError(message, 400);
  }

  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token";
    error = new AppError(message, 401);
  }

  if (err.name === "TokenExpiredError") {
    const message = "Token expired";
    error = new AppError(message, 401);
  }

  if (err.name === "MongoServerError" && (err as any).code === 11000) {
    const message = "Duplicate field value entered";
    error = new AppError(message, 400);
  }

  logger.error(`Error: ${error.message}`, {
    statusCode: error.statusCode || 500,
    stack: error.stack,
    path: req.path,
    method: req.method,
  });

  const statusCode = error.statusCode || 500;
  const message = error.message || "Server Error";

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(appConfig.env === "development" && { stack: error.stack }),
  });
};
