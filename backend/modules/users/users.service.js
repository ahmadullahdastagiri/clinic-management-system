import bcrypt from "bcrypt";
import mongoose, { mongo } from "mongoose";
import AppError from "../../utils/AppError.js";
import * as userRepository from "./users.repository.js";

/** 
  Register a new user.
  @param {Object} userData - The data of the user to be created.
  @returns {Object} The created user object.
  @throws Will throw an error if a user with the same email already exists.
*/
export const createUser = async (userData) => {
  const existingUser = await userRepository.findUserByEmail(userData.email);
  if (existingUser) {
    throw new AppError(
      "User with this email already exists",
      400,
      true,
      "USER_ALREADY_EXISTS",
    );
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  userData.password = hashedPassword;

  const user = await userRepository.createUser(userData);

  return user;
};

/** 
  Get all users with pagination.
  @param {Object} options - Pagination options.
  @returns {Object} An object containing the users and pagination info.
  @throws Will throw an error if no users are found.
*/
export const allUsers = async ({ page, limit }) => {
  const users = await userRepository.allUsers({ page, limit });

  if (!users)
    throw new AppError("No users found", 404, true, "USERS_NOT_FOUND");

  return users;
};

/**
  Get selected user by id.
  @param {Object} userId - The id of the user to be retrieved.
  @returns {Object} The user object.
  @throws Will throw an error if the user id is invalid or the user is not found.
 */
export const getUserById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new AppError("Invalid user id", 400, true, "INVALID_USER_ID");

  const user = await userRepository.findUserById(id);
  if (!user) throw new AppError("No user found", 404, true, "USER_NOT_FOUND");
  return user;
};

/**
  Update user by id.
  @param {Object} userId - The id of the user to be updated.  
  @param {Object} updateData - The data to update the user with.
  @returns {Object} The updated user object.
  @throws Will throw an error if the user id is invalid or the user is not found.
 */
export const updateUserById = async (id, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new AppError("Invalid user id", 400, true, "INVALID_USER_ID");

  const user = await userRepository.findUserById(id);
  if (!user) throw new AppError("No user found", 404, true, "USER_NOT_FOUND");

  const payload = { ...updateData };

  if (payload.email && payload.email !== user.email) {
    payload.isEmailVerified = false;
  }

  if (payload.phone && payload.phone !== user.phone) {
    payload.isPhoneVerified = false;
  }

  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, 10);
  }

  const updatedUser = await userRepository.updateUserPasswordById(id, payload);
  if (!updatedUser)
    throw new AppError(
      "Failed to update user password",
      500,
      true,
      "USER_PASSWORD_UPDATE_FAILED",
    );

  return updatedUser;
};

/**
 * Update user password by id.
 * @param {Object} userId - The id of the user to be updated.
 * @param {Object} updateData - The data to update the user with.
 * @returns {Object} The updated user object.
 * @throws Will throw an error if the user id is invalid or the user is not found.
 */
export const updateUserPasswordById = async (id, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new AppError("Invalid user id", 400, true, "INVALID_USER_ID");

  const user = await userRepository.findUserById(id);
  if (!user) throw new AppError("No user found", 404, true, "USER_NOT_FOUND");

  const payload = { ...updateData };

  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, 10);
  }

  const updatedUser = await userRepository.updateUserPasswordById(id, payload);
  if (!updatedUser)
    throw new AppError(
      "Failed to update user password",
      500,
      true,
      "USER_PASSWORD_UPDATE_FAILED",
    );

  return updatedUser;
};

/**
 * Activate user by id.
 * @param {Object} userId - The id of the user to be activated.
 * @returns {Object} The activated user object
 */
export const activateUserById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new AppError("Invalid user id", 400, true, "INVALID_USER_ID");

  const activateUser = await userRepository.activateUserById(id);
  if (!activateUser)
    throw new AppError(
      "Failed to activate user.",
      500,
      true,
      "USER_ACTIVATION_FAILED",
    );

  return activateUser;
};

/**
 * Deactivate user by id.
 * @param {Object} userId - The id of the user to be deactivated.
 * @returns {Object} The activated user object
 */
export const deactivateUserById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new AppError("Invalid user id", 400, true, "INVALID_USER_ID");

  const deactivateUser = await userRepository.deactivateUserById(id);
  if (!deactivateUser)
    throw new AppError(
      "Failed to deactivate user.",
      500,
      true,
      "USER_DEACTIVATION_FAILED",
    );

  return deactivateUser;
};
