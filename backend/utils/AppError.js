class AppError extends Error {
  constructor(
    message,
    statusCode = 500,
    isOperational = true,
    errorCode = null,
  ) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = isOperational;

    if (errorCode) {
      this.errorCode = errorCode;
    }

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
