import { success, ZodError } from "zod";
import {
  createUser,
  allUsers,
  getUserById,
  updateUserById,
  activateUserById,
  deactivateUserById,
  assignRoleById,
  deleteUserById,
} from "./users.service.js";

/**
 * POST /register
 * Creates a new user
 */
export const createUserController = async (req, res, next) => {
  try {
    const user = await createUser(req.body);
    return res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /users
 * Retrieves all users
 */
export const getAllUsersController = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const users = await allUsers({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
    });

    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /users/:id
 * Retrieves a user by ID
 */
export const getUserByIdController = async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);
    return res
      .status(200)
      .json({ message: "User retrieved successfully.", user });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /users/:id
 * Updates a user by ID
 */
export const updateUserByIdController = async (req, res, next) => {
  try {
    const updatedUser = await updateUserById(req.params.id, req.body);
    return res
      .status(200)
      .json({ message: "User updated successfully.", user: updatedUser });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /users/:id/password
 * Updates a user's password by ID
 */
export const updateUserPasswordController = async (req, res, next) => {
  try {
    const updatedUser = await updateUserById(req.params.id, req.body);
    return res.status(200).json({
      message: "User password updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /users/:id/activate
 * Activates a user's by ID
 */
export const activateUserController = async (req, res, next) => {
  try {
    const activateUser = await activateUserById(req.params.id);
    return res.status(200).json({
      message: "User activated successfully.",
      user: activateUser,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /users/:id/activate
 * Deactivates a user's by ID
 */
export const deactivateUserController = async (req, res, next) => {
  try {
    const deactivateUser = await deactivateUserById(req.params.id);
    return res.status(200).json({
      message: "User deactivated successfully.",
      user: deactivateUser,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /users/:id/assign-role
 * Assigns role to a user's by ID
 */
export const assignRoleToUserController = async (req, res, next) => {
  try {
    const assignRoleToUser = await assignRoleById(req.params.id, req.body);
    return res.status(200).json({
      message: "User role assigned successfully.",
      user: assignRoleToUser,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /users/:id
 * Deletes a user's by ID
 */
export const deleteUserController = async (req, res, next) => {
  try {
    const deleteUser = await deleteUserById(req.params.id);
    console.log("deleteUser");
    return res.status(200).json({
      message: "User deleted successfully",
      user: deleteUser,
    });
  } catch (error) {
    next(error);
  }
};
