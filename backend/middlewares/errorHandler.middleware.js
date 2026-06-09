import AppError from "../utils/AppError.js";

export const errorHandler = (err, req, res, next) => {
  let error = err;

  const statusCode = error.statusCode || 500;
  const status = error.status || "error";

  // Log full error ONLY for non-operational or server errors
  if (!error.isOperational) {
    console.error("🔥 PROGRAMMING ERROR:", {
      message: error.message,
      stack: error.stack,
      url: req.originalUrl,
      method: req.method,
      body: req.body,
      params: req.params,
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

  // // Development response (verbose)
  return res.status(statusCode).json({
    status,
    message: "Internal server error",
    errorCode: "INTERNAL_ERROR" || null,
  });
};
