import { z } from "zod";

import { CURRENCY_CODES } from "../../../constants/currencies.js";

const paymentStatusSchema = z.enum([
  "pending",
  "completed",
  "failed",
  "refunded",
  "void",
]);

const paymentMethodSchema = z.enum([
  "cash",
  "card",
  "bank-transfer",
  "mobile-money",
  "other",
]);

const paymentFields = {
  invoiceId: z.string().min(1, "Invoice is required"),
  patientId: z.string().min(1, "Patient is required"),
  amount: z.number().gt(0, "Payment amount must be greater than zero"),
  currency: z.enum(CURRENCY_CODES).optional(),
  method: paymentMethodSchema,
  status: paymentStatusSchema.optional(),
  transactionReference: z
    .string()
    .trim()
    .max(150, "Transaction reference cannot exceed 150 characters")
    .optional(),
  paidAt: z.coerce.date({ invalid_type_error: "Invalid payment date" }).optional(),
  notes: z.string().trim().max(2000, "Notes cannot exceed 2000 characters").optional(),
};

/** Validate payment creation payloads. */
export const createPaymentSchema = z.object({
  ...paymentFields,
  receivedBy: z.string().min(1, "Received by user is required"),
});

/** Validate payment update payloads. */
export const updatePaymentSchema = z.object({
  ...Object.fromEntries(
    Object.entries(paymentFields).map(([key, schema]) => [key, schema.optional()]),
  ),
});

/** Validate payment status updates. */
export const updatePaymentStatusSchema = z.object({
  status: paymentStatusSchema,
});
