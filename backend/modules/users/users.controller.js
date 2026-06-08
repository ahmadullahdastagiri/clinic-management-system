import { success, ZodError } from "zod";
import { createUser, allUsers, getUserById } from "./users.service.js";

/**
 * POST /register
 * Creates a new user
 */
export const createUserController = async (req, res) => {
  try {
    const user = await createUser(req.body);
    return res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.log("Creating new user:-", error.message);
    return res
      .status(400)
      .json({ message: "Internal server error", error: error.message });
  }
};

/**
 * GET /users
 * Retrieves all users
 */
export const getAllUsersController = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const users = await allUsers({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
    });

    return res.status(200).json(users);
  } catch (error) {
    console.log("Getting all users:-", error.message);
    return res.status(400).json({ error: error.message });
  }
};

/**
 * GET /users/:id
 * Retrieves a user by ID
 */
export const getUserByIdController = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    return res
      .status(200)
      .json({ message: "User retrieved successfully.", user });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
