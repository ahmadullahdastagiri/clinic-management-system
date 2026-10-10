import express from "express";
import { loginController } from "./auth.controller.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { loginSchema } from "./auth.validation.js";

const router = express.Router();

router.post("/login", validate(loginSchema), loginController);
export default router;
