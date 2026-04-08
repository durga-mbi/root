import { NextFunction, Request, Response } from "express";
import config from "../config";
import { getErrorMessage } from "../utils";
import CustomError from "../errors/CustomError";
import { UnauthorizedError } from "express-oauth2-jwt-bearer";
import Joi from "joi";

export default function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) {
    next(error);
    return;
  }

  // Handle Joi validation errors
  if (Joi.isError(error)) {
    const fieldErrors: Record<string, string> = {};
    error.details.forEach((detail) => {
      const key = detail.path.join(".");
      fieldErrors[key] = detail.message.replace(/['"]/g, "");
    });

    res.status(422).json({
      success: false,
      code: "ERR_VALIDATION",
      message: fieldErrors,
    });
    return;
  }

  // Handle Custom errors (AppError)
  if (error instanceof CustomError) {
    res.status(error.statusCode).json({
      success: false,
      code: error.code,
      message: error.message.toLowerCase(),
    });
    return;
  }

  // Handle JWT Unauthorized errors
  if (error instanceof UnauthorizedError) {
    res.status(error.statusCode).json({
      success: false,
      code: "code" in error ? (error.code as string) : "ERR_AUTH",
      message: error.message.toLowerCase(),
    });
    return;
  }

  // Handle generic errors
  console.error("[ErrorHandler] Unhandled Error:", error);

  res.status(500).json({
    success: false,
    code: "ERR_SERVER",
    message: (getErrorMessage(error) || "internal server error").toLowerCase(),
  });
}
