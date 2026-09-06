import { z } from "zod";

import { CURRENCY_CODES } from "../../../constants/currencies.js";

const invoiceStatusSchema = z.enum([
  "draft",
  "issued",
  "partially-paid",
  "paid",
  "void",
]);

const currencySchema = z.enum(CURRENCY_CODES);

const invoiceItemSchema = z.object({
  type: z.enum(["service", "product", "lab", "consultation"]),
  description: z.string().trim().optional(),
  referenceId: z.string().min(1, "Reference id must not be empty").optional(),
  quantity: z.number().gt(0, "Quantity must be greater than zero"),
  unitPrice: z.number().min(0, "Unit price must be non-negative"),
});

const invoiceFields = {
  patientId: z.string().min(1, "Patient is required"),
  appointmentId: z.string().min(1, "Appointment must not be empty").optional(),
  laboratoryOrderId: z
    .string()
    .min(1, "Laboratory order must not be empty")
    .optional(),
  items: z
    .array(invoiceItemSchema)
    .min(1, "At least one invoice item is required"),
  currency: currencySchema.optional(),
  discount: z.number().min(0, "Discount must be non-negative").optional(),
  discountValue: z
    .number()
    .min(0, "Discount value must be non-negative")
    .optional(),
  discountType: z.enum(["fixed", "percentage"]).optional(),
  taxRate: z
    .number()
    .min(0, "Tax rate must be non-negative")
    .max(100, "Tax rate cannot exceed 100")
    .optional(),
  status: invoiceStatusSchema.optional(),
  dueDate: z.coerce.date({ invalid_type_error: "Invalid due date" }).optional(),
  notes: z
    .string()
    .trim()
    .max(2000, "Notes cannot exceed 2000 characters")
    .optional(),
};

/** Validate invoice creation payloads. */
export const createInvoiceSchema = z.object({
  ...invoiceFields,
  createdBy: z.string().min(1, "Created by user is required"),
});

/** Validate invoice update payloads. */
export const updateInvoiceSchema = z.object({
  ...Object.fromEntries(
    Object.entries(invoiceFields).map(([key, schema]) => [
      key,
      schema.optional(),
    ]),
  ),
});

/** Validate invoice status updates. */
export const updateInvoiceStatusSchema = z.object({
  status: invoiceStatusSchema,
});
