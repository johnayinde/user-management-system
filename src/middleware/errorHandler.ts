import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

export class AppError extends Error {
  statusCode: number;
  errors?: any;

  constructor(message: string, statusCode: number, errors?: any) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`${err.name}: ${err.message}`, { stack: err.stack });

  const statusCode = "statusCode" in err ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";

  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    return res.status(400).json({
      status: "error",
      message: "Validation Error",
      errors: err.message,
    });
  }

  // Handle 404 errors
  if (statusCode === 404) {
    return res.status(404).json({
      status: "error",
      message,
    });
  }

  // Handle other errors
  return res.status(statusCode).json({
    status: "error",
    message,
    errors: "errors" in err ? err.errors : undefined,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error: any) {
      logger.error(`API Error: ${error.message}`, {
        path: req.path,
        method: req.method,
        error,
      });
      next(error);
    }
  };
};
