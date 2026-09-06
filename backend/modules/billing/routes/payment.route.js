import express from "express";

import { validate } from "../../../middlewares/validation.middleware.js";
import {
  createPaymentController,
  deletePaymentByIdController,
  getAllPaymentsController,
  getPaymentByIdController,
  getPaymentsByInvoiceController,
  getPaymentsByPatientController,
  updatePaymentByIdController,
  updatePaymentStatusController,
} from "../controllers/payment.controller.js";
import {
  createPaymentSchema,
  updatePaymentSchema,
  updatePaymentStatusSchema,
} from "../validations/payment.validation.js";

const router = express.Router();

/* PAYMENTS */
router.post(
  "/payments",
  validate(createPaymentSchema),
  createPaymentController,
);
router.get("/payments", getAllPaymentsController);
router.get("/payments/invoice/:invoiceId", getPaymentsByInvoiceController);
router.get("/payments/patient/:patientId", getPaymentsByPatientController);
router.get("/payments/:id", getPaymentByIdController);
router.put(
  "/payments/:id",
  validate(updatePaymentSchema),
  updatePaymentByIdController,
);
router.patch(
  "/payments/:id/status",
  validate(updatePaymentStatusSchema),
  updatePaymentStatusController,
);
router.delete("/payments/:id", deletePaymentByIdController);

export default router;
