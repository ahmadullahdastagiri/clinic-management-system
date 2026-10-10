import jwt from "jsonwebtoken";
import { findUserByEmailAndPassword } from "./auth.repository.js";
import AppError from "../../utils/AppError.js";

export async function login(email, password) {
  const user = await findUserByEmailAndPassword(email.trim());
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError(
      "Invalid email or password",
      401,
      true,
      "INVALID_CREDENTIALS",
    );
  }

  if (!user.isActive) {
    throw new AppError(
      "This account is inactive",
      403,
      true,
      "ACCOUNT_INACTIVE",
    );
  }

  if (!process.env.JWT_SECRET) {
    throw new AppError(
      "Authentication is not configured",
      500,
      false,
      "AUTH_NOT_CONFIGURED",
    );
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" },
  );

  return {
    token,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  };
}
