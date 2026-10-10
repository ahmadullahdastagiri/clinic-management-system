import express from "express";

import { validate } from "../../../middlewares/validation.middleware.js";
import {
  authenticate,
  authorize,
} from "../../../middlewares/auth.middleware.js";
import {
  createInvoiceController,
  deleteInvoiceByIdController,
  getAllInvoicesController,
  getInvoiceByIdController,
  getInvoicePdfController,
  getInvoicesByPatientController,
  updateInvoiceByIdController,
  updateInvoiceStatusController,
} from "../controllers/invoice.controller.js";
import {
  createInvoiceSchema,
  updateInvoiceSchema,
  updateInvoiceStatusSchema,
} from "../validations/invoice.validation.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/invoices",
  authorize("admin", "receptionist"),
  validate(createInvoiceSchema),
  createInvoiceController,
);
router.get(
  "/invoices",
  authorize("admin", "receptionist"),
  getAllInvoicesController,
);
router.get(
  "/invoices/patient/:patientId",
  authorize("admin", "receptionist"),
  getInvoicesByPatientController,
);
router.get(
  "/invoices/:id/pdf",
  authorize("admin", "receptionist"),
  getInvoicePdfController,
);
router.get(
  "/invoices/:id",
  authorize("admin", "receptionist"),
  getInvoiceByIdController,
);
router.put(
  "/invoices/:id",
  authorize("admin", "receptionist"),
  validate(updateInvoiceSchema),
  updateInvoiceByIdController,
);
router.patch(
  "/invoices/:id/status",
  authorize("admin", "receptionist"),
  validate(updateInvoiceStatusSchema),
  updateInvoiceStatusController,
);
router.delete("/invoices/:id", authorize("admin"), deleteInvoiceByIdController);

export default router;
