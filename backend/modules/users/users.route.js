import express from "express";
import {
  activateUserController,
  assignRoleToUserController,
  createUserController,
  deactivateUserController,
  deleteUserController,
  getAllUsersController,
  getUserByIdController,
  updateUserByIdController,
  updateUserPasswordController,
} from "./users.controller.js";
import { validate } from "../../middlewares/validation.middleware.js";
import {
  createUserSchema,
  updateUserSchema,
  updateUserPasswordSchema,
  assignRoleToUserSchema,
} from "./users.validation.js";

const router = express.Router();

router.post("/register", validate(createUserSchema), createUserController);
router.get("/users", getAllUsersController);
router.get("/user/:id", getUserByIdController);
router.put("/user/:id", validate(updateUserSchema), updateUserByIdController);
router.put(
  "/user/:id/password",
  validate(updateUserPasswordSchema),
  updateUserPasswordController,
);
router.put("/user/:id/activate", activateUserController);
router.put("/user/:id/deactivate", deactivateUserController);
router.put(
  "/user/:id/assign-role",
  validate(assignRoleToUserSchema),
  assignRoleToUserController,
);
router.delete("/user/:id", deleteUserController);

export default router;
