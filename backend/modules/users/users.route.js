import express from "express";
import {
  createUserController,
  getAllUsersController,
  getUserByIdController,
} from "./users.controller.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { createUserSchema } from "./users.validation.js";

const router = express.Router();

router.post("/register", validate(createUserSchema), createUserController);
router.get("/users", getAllUsersController);
router.get("/user/:id", getUserByIdController);

export default router;
