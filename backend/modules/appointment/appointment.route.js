import express from "express";

import { validate } from "../../middlewares/validation.middleware.js";
import {
  createAppointmentController,
  getAllAppointmentsController,
  getAppointmentByIdController,
  getAppointmentsByDoctorController,
  getAppointmentsByPatientController,
  findDoctorAppointmentSlotController,
  updateAppointmentByIdController,
  updateAppointmentStatusController,
  deleteAppointmentController,
} from "./appointment.controller.js";
import {
  createAppointmentSchema,
  updateAppointmentSchema,
  updateAppointmentStatusSchema,
} from "./appointment.validation.js";

const router = express.Router();

// CREATE
router.post(
  "/appointment",
  validate(createAppointmentSchema),
  createAppointmentController,
);

// READ
router.get("/appointments", getAllAppointmentsController);
router.get("/appointments/slot/check", findDoctorAppointmentSlotController);
router.get("/appointments/doctor/:doctorId", getAppointmentsByDoctorController);
router.get(
  "/appointments/patient/:patientId",
  getAppointmentsByPatientController,
);
router.get("/appointment/:id", getAppointmentByIdController);

// UPDATE
router.put(
  "/appointment/:id",
  validate(updateAppointmentSchema),
  updateAppointmentByIdController,
);
router.patch(
  "/appointment/:id/status",
  validate(updateAppointmentStatusSchema),
  updateAppointmentStatusController,
);

// DELETE
router.delete("/appointment/:id", deleteAppointmentController);

export default router;
