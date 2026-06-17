import express from "express";
import { validate } from "../../middlewares/validation.middleware.js";
import {
  activatePatientController,
  createPatientController,
  deactivatePatientController,
  deletePatientController,
  getAllPatientsController,
  getPatientByIdController,
  searchPatientController,
  updatePatientByIdController,
} from "./patient.controller.js";
import {
  createPatientSchema,
  updatePatientSchema,
} from "./patient.validation.js";

const router = express.Router();

router.post(
  "/patient/register",
  validate(createPatientSchema),
  createPatientController,
);
router.get("/patients", getAllPatientsController);
router.get("/patients/search", searchPatientController);
router.get("/patient/:id", getPatientByIdController);
router.put(
  "/patient/:id",
  validate(updatePatientSchema),
  updatePatientByIdController,
);
router.put("/patient/:id/activate", activatePatientController);
router.put("/patient/:id/deactivate", deactivatePatientController);
router.delete("/patient/:id", deletePatientController);

export default router;
