import express from "express";
import {
  createUserController,
  getAllUsersController,
  getUserByIdController,
  updateUserByIdController,
} from "./users.controller.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { createUserSchema, updateUserSchema } from "./users.validation.js";

const router = express.Router();

router.post("/register", validate(createUserSchema), createUserController);
router.get("/users", getAllUsersController);
router.get("/user/:id", getUserByIdController);
router.put("/user/:id", validate(updateUserSchema), updateUserByIdController);

export default router;
