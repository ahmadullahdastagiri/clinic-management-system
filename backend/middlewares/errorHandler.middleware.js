import AppError from "../utils/AppError.js";
import { ZodError } from "zod";

export const errorHandler = (err, req, res, next) => {
  let error = err;

  const statusCode = error.statusCode || 500;
  const status = error.status || "error";

  // Log full error ONLY for non-operational or server errors
  if (!error.isOperational && !(error instanceof ZodError)) {
    console.error("🔥 PROGRAMMING ERROR:", {
      message: error.message,
      stack: error.stack,
      url: req.originalUrl,
      method: req.method,
      body: req.body,
      params: req.params,
    });
  }

  // validation error handling
  if (error instanceof ZodError) {
    const issues = error.issues.map((e) => ({
      path: e.path.join(".") || null,
      message: e.message,
    }));
    return res.status(400).json({
      status: "fail",
      message: "Validation error",
      errorCode: "VALIDATION_ERROR",
      details: issues,
    });
  }

  // Production response (safe)
  if (error.isOperational) {
    return res.status(statusCode).json({
      status,
      message: error.message,
      errorCode: error.errorCode || null,
    });
  }

  if (error instanceof AppError) {
    return res.status(statusCode).json({
      status,
      message: error.message,
      errorCode: error.errorCode || null,
    });
  }

  // // Development response (verbose)
  return res.status(statusCode).json({
    status,
    message: "Internal server error",
    errorCode: "INTERNAL_ERROR" || null,
  });
};
