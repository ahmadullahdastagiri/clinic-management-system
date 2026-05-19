import express from "express";
import { createUserController } from "./users.controller.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { createUserSchema } from "./users.validation.js";

const router = express.Router();

// POST /users/register - Create a new user
router.post("/register", validate(createUserSchema), createUserController);

export default router;
