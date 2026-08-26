import type { Request, Response, NextFunction } from "express";
import env from "../../env.ts";

interface CustomError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

const globalErrorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.statusCode || 5000;
  const message = err.isOperational ? err.message : "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    message,
    stack: env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
export default globalErrorHandler;
