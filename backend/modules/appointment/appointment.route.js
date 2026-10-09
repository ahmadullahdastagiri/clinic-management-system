import express from "express";

import { validate } from "../../middlewares/validation.middleware.js";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
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

router.use(authenticate);

// CREATE
router.post(
  "/appointment",
  authorize("admin", "receptionist"),
  validate(createAppointmentSchema),
  createAppointmentController,
);

// READ
router.get(
  "/appointments",
  authorize("admin", "receptionist", "doctor"),
  getAllAppointmentsController,
);
router.get(
  "/appointments/slot/check",
  authorize("admin", "receptionist"),
  findDoctorAppointmentSlotController,
);
router.get(
  "/appointments/doctor/:doctorId",
  authorize("admin", "receptionist"),
  getAppointmentsByDoctorController,
);
router.get(
  "/appointments/patient/:patientId",
  authorize("admin", "receptionist"),
  getAppointmentsByPatientController,
);
router.get(
  "/appointment/:id",
  authorize("admin", "receptionist"),
  getAppointmentByIdController,
);

// UPDATE
router.put(
  "/appointment/:id",
  authorize("admin", "receptionist"),
  validate(updateAppointmentSchema),
  updateAppointmentByIdController,
);
router.patch(
  "/appointment/:id/status",
  authorize("admin", "receptionist", "doctor"),
  validate(updateAppointmentStatusSchema),
  updateAppointmentStatusController,
);

// DELETE
router.delete(
  "/appointment/:id",
  authorize("admin", "receptionist"),
  deleteAppointmentController,
);

export default router;
