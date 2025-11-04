import { NextFunction, Request, Response } from "express";
import HttpStatus from "http-status";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Prevent double-send if headers are already sent
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
  const success = false;
  const message = err.message || "Something went wrong!";
  const error = err;

  res.status(statusCode).json({
    success,
    message,
    error,
  });
};

export default globalErrorHandler;
