import express from "express";

import { validate } from "../../../middlewares/validation.middleware.js";
import {
  authenticate,
  authorize,
} from "../../../middlewares/auth.middleware.js";
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

router.use(authenticate);

router.post(
  "/payments",
  authorize("admin", "receptionist"),
  validate(createPaymentSchema),
  createPaymentController,
);
router.get(
  "/payments",
  authorize("admin", "receptionist"),
  getAllPaymentsController,
);
router.get(
  "/payments/invoice/:invoiceId",
  authorize("admin", "receptionist"),
  getPaymentsByInvoiceController,
);
router.get(
  "/payments/patient/:patientId",
  authorize("admin", "receptionist"),
  getPaymentsByPatientController,
);
router.get(
  "/payments/:id",
  authorize("admin", "receptionist"),
  getPaymentByIdController,
);
router.put(
  "/payments/:id",
  authorize("admin"),
  validate(updatePaymentSchema),
  updatePaymentByIdController,
);
router.patch(
  "/payments/:id/status",
  authorize("admin", "receptionist"),
  validate(updatePaymentStatusSchema),
  updatePaymentStatusController,
);
router.delete("/payments/:id", deletePaymentByIdController);

export default router;
