import bcrypt from "bcrypt";
import * as userRepository from "./users.repository.js";
import mongoose, { mongo } from "mongoose";

/** 
  Register a new user.
  @param {Object} userData - The data of the user to be created.
  @returns {Object} The created user object.
  @throws Will throw an error if a user with the same email already exists.
*/
export const createUser = async (userData) => {
  const existingUser = await userRepository.findUserByEmail(userData.email);
  if (existingUser) {
    throw new Error("User with this email already exists");
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

  if (!users) throw new Error("No users found");

  return users;
};

/**
  Get selected user by id.
  @param {Object} userId - The id of the user to be retrieved.
  @returns {Object} The user object.
  @throws Will throw an error if the user id is invalid or the user is not found.
 */
export const getUserById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid user id");

  const user = await userRepository.findUserById(id);
  if (!user) throw new Error("No user found");
  return user;
};
