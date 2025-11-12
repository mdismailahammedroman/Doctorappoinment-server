import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { AppError } from "../helpers/errorHelpers";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Prvent double-send if headers are already sent
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let success = false;
  let message = err.message || "Something went wrong!";
  let error = err;

  // 🧱  Handle custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    error = { message: err.message };
  }

  // 🧩  Handle Prisma Known Request Errors
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      message = "Duplicate key error";
      error = err.meta;
      statusCode = httpStatus.CONFLICT;
    } else if (err.code === "P1000") {
      message = "Authentication failed against database server";
      error = err.meta;
      statusCode = httpStatus.BAD_GATEWAY;
    } else if (err.code === "P2003") {
      message = "Foreign key constraint failed";
      error = err.meta;
      statusCode = httpStatus.BAD_REQUEST;
    }
  }

  // 🧮  Other Prisma errors
  else if (err instanceof Prisma.PrismaClientValidationError) {
    message = "Validation Error";
    error = err.message;
    statusCode = httpStatus.BAD_REQUEST;
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    message = "Unknown Prisma error occurred!";
    error = err.message;
    statusCode = httpStatus.BAD_REQUEST;
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    message = "Prisma client failed to initialize!";
    error = err.message;
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  }

  // 🧾  Send JSON response
  res.status(statusCode).json({
    success,
    message,
    statusCode,
    error,
  });
};

export default globalErrorHandler;
