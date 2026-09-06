import express from "express";

import { validate } from "../../../middlewares/validation.middleware.js";
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

/* INVOICES */
router.post(
  "/invoices",
  validate(createInvoiceSchema),
  createInvoiceController,
);
router.get("/invoices", getAllInvoicesController);
router.get("/invoices/patient/:patientId", getInvoicesByPatientController);
router.get("/invoices/:id/pdf", getInvoicePdfController);
router.get("/invoices/:id", getInvoiceByIdController);
router.put(
  "/invoices/:id",
  validate(updateInvoiceSchema),
  updateInvoiceByIdController,
);
router.patch(
  "/invoices/:id/status",
  validate(updateInvoiceStatusSchema),
  updateInvoiceStatusController,
);
router.delete("/invoices/:id", deleteInvoiceByIdController);

export default router;
