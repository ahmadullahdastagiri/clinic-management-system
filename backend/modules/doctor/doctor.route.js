import express from "express";
import { validate } from "../../middlewares/validation.middleware.js";
import {
  createDoctorController,
  getDoctorByIdController,
  allDoctorsController,
  updateDoctorByIdController,
  activateDoctorController,
  deactivateDoctorController,
} from "./doctor.controller.js";

import { createDoctorSchema, updateDoctorSchema } from "./doctor.validation.js";

const router = express.Router();

router.post(
  "/doctor/register",
  validate(createDoctorSchema),
  createDoctorController,
);
router.get("/doctor/:id", getDoctorByIdController);
router.get("/doctors", allDoctorsController);
router.put(
  "/doctor/:id",
  validate(updateDoctorSchema),
  updateDoctorByIdController,
);
router.put("/doctor/:id/activate", activateDoctorController);
router.put("/doctor/:id/deactivate", deactivateDoctorController);

export default router;
