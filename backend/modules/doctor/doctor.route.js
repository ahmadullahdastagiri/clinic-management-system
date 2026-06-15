import express from "express";
import { validate } from "../../middlewares/validation.middleware.js";
import { createDoctorSchema } from "./doctor.validation.js";
import {
  createDoctorController,
  getDoctorByIdController,
  allDoctorsController,
} from "./doctor.controller.js";

const router = express.Router();

router.post(
  "/doctor/register",
  validate(createDoctorSchema),
  createDoctorController,
);
router.get("/doctor/:id", getDoctorByIdController);
router.get("/doctors", allDoctorsController);

export default router;
