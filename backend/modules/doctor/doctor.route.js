import express from "express";
import { validate } from "../../middlewares/validation.middleware.js";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import {
  createDoctorController,
  getDoctorByIdController,
  allDoctorsController,
  updateDoctorByIdController,
  activateDoctorController,
  deactivateDoctorController,
  deleteDoctorController,
  findDoctorController,
} from "./doctor.controller.js";

import { createDoctorSchema, updateDoctorSchema } from "./doctor.validation.js";

const router = express.Router();

router.use(authenticate, authorize("admin"));

router.post(
  "/doctor/register",
  validate(createDoctorSchema),
  createDoctorController,
);
router.get("/doctor/:id", getDoctorByIdController);
router.get("/doctors", allDoctorsController);
router.get("/doctors/search", findDoctorController);
router.put(
  "/doctor/:id",
  validate(updateDoctorSchema),
  updateDoctorByIdController,
);
router.put("/doctor/:id/activate", activateDoctorController);
router.put("/doctor/:id/deactivate", deactivateDoctorController);
router.delete("/doctor/:id/delete", deleteDoctorController);

export default router;
