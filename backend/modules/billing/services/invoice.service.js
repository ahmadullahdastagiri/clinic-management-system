import AppError from "../../../utils/AppError.js";
import { validateObjectId } from "../../../utils/validateObjectId.js";
import * as invoiceRepository from "../repositories/invoice.repository.js";
import * as paymentRepository from "../repositories/payment.repository.js";
import {
  calculateInvoiceTotals,
  calculateItemAmount,
} from "../billing.calculation.js";

const validateIdFields = (payload, fields) => {
  fields.forEach(({ key, resource }) => {
    if (payload?.[key]) validateObjectId(payload[key], resource);
  });
};

const invoiceIdFields = [
  { key: "patientId", resource: "patient" },
  { key: "appointmentId", resource: "appointment" },
  { key: "laboratoryOrderId", resource: "laboratory order" },
  { key: "createdBy", resource: "user" },
];

const prepareInvoicePayload = (payload = {}, payments = []) => {
  const items = (payload.items || []).map((item) => ({
    ...item,
    amount: calculateItemAmount(item.quantity, item.unitPrice),
  }));

  const totals = calculateInvoiceTotals({
    items,
    discountValue: payload.discountValue ?? payload.discount ?? 0,
    discountType: payload.discountType || "fixed",
    taxRate: payload.taxRate ?? 0,
    payments,
  });

  const status = payload.status || (payments.length ? totals.status : "draft");

  return {
    ...payload,
    items,
    discountType: payload.discountType || "fixed",
    taxRate: payload.taxRate ?? 0,
    ...totals,
    status,
    ...(status !== "draft" && !payload.issuedAt
      ? { issuedAt: new Date() }
      : {}),
  };
};

const getInvoicePayments = (invoiceId) =>
  paymentRepository.getAllPaymentsForInvoice(invoiceId);

/**
 * Create an invoice record.
 * @param {Object} payload - Invoice payload.
 * @returns {Promise<Object>} The created invoice.
 */
export const createInvoice = async (payload) => {
  validateIdFields(payload, invoiceIdFields);

  const invoice = await invoiceRepository.createInvoice(
    prepareInvoicePayload(payload),
  );
  if (!invoice) {
    throw new AppError(
      "Failed to create invoice",
      500,
      true,
      "INVOICE_CREATION_FAILED",
    );
  }

  return invoice;
};

/**
 * Get an invoice by id.
 * @param {string} id - Invoice id.
 * @returns {Promise<Object>} The matching invoice.
 */
export const getInvoiceById = async (id) => {
  validateObjectId(id, "invoice");
  const invoice = await invoiceRepository.getInvoiceById(id);
  if (!invoice) {
    throw new AppError("No invoice found", 404, true, "INVOICE_NOT_FOUND");
  }
  return invoice;
};

/**
 * Get a paginated list of invoices.
 * @param {Object} options - Query and pagination options.
 * @returns {Promise<Object>} Invoices and pagination data.
 */
export const getAllInvoices = (options = {}) =>
  invoiceRepository.getAllInvoices(options);

/**
 * Get invoices for a patient.
 * @param {string} patientId - Patient id.
 * @param {Object} options - Query and pagination options.
 * @returns {Promise<Object>} Matching invoices and pagination data.
 */
export const getInvoicesByPatient = async (patientId, options = {}) => {
  validateObjectId(patientId, "patient");
  return invoiceRepository.getInvoicesByPatient(patientId, options);
};

/**
 * Update an invoice by id.
 * @param {string} id - Invoice id.
 * @param {Object} payload - Invoice fields to update.
 * @returns {Promise<Object>} The updated invoice.
 */
export const updateInvoiceById = async (id, payload) => {
  validateObjectId(id, "invoice");
  validateIdFields(payload, invoiceIdFields);
  const invoice = await getInvoiceById(id);
  const financialFields = [
    "items",
    "discount",
    "discountValue",
    "discountType",
    "taxRate",
  ];
  const hasFinancialChanges = financialFields.some((field) =>
    Object.prototype.hasOwnProperty.call(payload, field),
  );

  const updatePayload = hasFinancialChanges
    ? prepareInvoicePayload(
        {
          ...payload,
          items: payload.items ?? invoice.items,
          discountValue:
            payload.discountValue ??
            payload.discount ??
            invoice.discountValue ??
            invoice.discount ??
            0,
          discountType: payload.discountType ?? invoice.discountType ?? "fixed",
          taxRate: payload.taxRate ?? invoice.taxRate ?? 0,
        },
        await getInvoicePayments(id),
      )
    : payload;

  const updatedInvoice = await invoiceRepository.updateInvoiceById(
    id,
    updatePayload,
  );
  if (!updatedInvoice) {
    throw new AppError(
      "Failed to update invoice",
      500,
      true,
      "INVOICE_UPDATE_FAILED",
    );
  }
  return updatedInvoice;
};

/**
 * Update an invoice status.
 * @param {string} id - Invoice id.
 * @param {string} status - New invoice status.
 * @returns {Promise<Object>} The updated invoice.
 */
export const updateInvoiceStatus = async (id, status) => {
  validateObjectId(id, "invoice");
  const invoice = await getInvoiceById(id);
  const allowedStatuses = ["draft", "issued", "partially-paid", "paid", "void"];

  if (!allowedStatuses.includes(status)) {
    throw new AppError(
      "Invalid invoice status",
      400,
      true,
      "INVALID_INVOICE_STATUS",
    );
  }
  if (status === "paid" && invoice.dueAmount > 0) {
    throw new AppError(
      "An invoice cannot be marked paid while it has a balance",
      400,
      true,
      "INVOICE_BALANCE_REMAINING",
    );
  }
  if (status === "void" && invoice.paidAmount > 0) {
    throw new AppError(
      "An invoice with payments cannot be voided",
      400,
      true,
      "INVOICE_HAS_PAYMENTS",
    );
  }

  const updatedInvoice = await invoiceRepository.updateInvoiceById(id, {
    status,
    ...(status === "issued" && !invoice.issuedAt
      ? { issuedAt: new Date() }
      : {}),
  });
  if (!updatedInvoice) {
    throw new AppError(
      "Failed to update invoice status",
      500,
      true,
      "INVOICE_STATUS_UPDATE_FAILED",
    );
  }
  return updatedInvoice;
};

/**
 * Delete an invoice by id.
 * @param {string} id - Invoice id.
 * @returns {Promise<Object>} The deleted invoice.
 */
export const deleteInvoiceById = async (id) => {
  validateObjectId(id, "invoice");
  await getInvoiceById(id);
  const payments = await paymentRepository.getAllPaymentsForInvoice(id);
  if (payments.length > 0) {
    throw new AppError(
      "Invoices with payments cannot be deleted",
      409,
      true,
      "INVOICE_HAS_PAYMENTS",
    );
  }

  const deletedInvoice = await invoiceRepository.deleteInvoiceById(id);
  if (!deletedInvoice) {
    throw new AppError(
      "Failed to delete invoice",
      500,
      true,
      "INVOICE_DELETION_FAILED",
    );
  }
  return deletedInvoice;
};
