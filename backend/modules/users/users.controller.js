import { success, ZodError } from "zod";
import { createUser } from "./users.service.js";

export const createUserController = async (req, res) => {
  try {
    const user = await createUser(req.body);
    return res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Internal server error", error: error.message });
  }
};
