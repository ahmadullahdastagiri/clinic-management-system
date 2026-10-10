import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

export const authenticate = (req, res, next) => {
  const token = req.cookies["accessToken"];
  if (!token) {
    return next(
      new AppError(
        "Authentication token is required",
        401,
        true,
        "TOKEN_REQUIRED",
      ),
    );
  }

  if (!process.env.JWT_SECRET) {
    return next(
      new AppError(
        "Authentication is not configured",
        500,
        false,
        "AUTH_NOT_CONFIGURED",
      ),
    );
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, role: payload.role };
    return next();
  } catch {
    return next(
      new AppError(
        "Invalid or expired authentication token",
        401,
        true,
        "INVALID_TOKEN",
      ),
    );
  }
};

export const authorize =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.user) {
      return next(
        new AppError(
          "Authentication is required",
          401,
          true,
          "AUTHENTICATION_REQUIRED",
        ),
      );
    }

    if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          "You are not authorized to access this resource",
          403,
          true,
          "FORBIDDEN",
        ),
      );
    }

    return next();
  };
