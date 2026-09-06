import mongoose from "mongoose";

import AppError from "../../../utils/AppError.js";
import { validateObjectId } from "../../../utils/validateObjectId.js";
import * as invoiceRepository from "../repositories/invoice.repository.js";
import * as paymentRepository from "../repositories/payment.repository.js";
import { calculateInvoiceTotals } from "../billing.calculation.js";

const paymentIdFields = [
  { key: "invoiceId", resource: "invoice" },
  { key: "patientId", resource: "patient" },
  { key: "receivedBy", resource: "user" },
];

const validateIdFields = (payload, fields) => {
  fields.forEach(({ key, resource }) => {
    if (payload?.[key]) validateObjectId(payload[key], resource);
  });
};

const getIdValue = (value) => value?._id || value;

const ensureFound = (value, message, code) => {
  if (!value) throw new AppError(message, 404, true, code);
};

const validatePaymentAgainstInvoice = (payment, invoice) => {
  if (
    String(getIdValue(payment.patientId)) !==
    String(getIdValue(invoice.patientId))
  ) {
    throw new AppError(
      "Payment patient does not match invoice patient",
      400,
      true,
      "PAYMENT_INVOICE_MISMATCH",
    );
  }
  if (payment.currency && payment.currency !== invoice.currency) {
    throw new AppError(
      "Payment currency does not match invoice currency",
      400,
      true,
      "PAYMENT_CURRENCY_MISMATCH",
    );
  }
  if (invoice.status === "void") {
    throw new AppError(
      "Cannot add a payment to a void invoice",
      400,
      true,
      "PAYMENT_INVOICE_VOID",
    );
  }
};

const validatePositiveAmount = (amount) => {
  if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
    throw new AppError(
      "Payment amount must be greater than zero",
      400,
      true,
      "INVALID_PAYMENT_AMOUNT",
    );
  }
};

const withTransaction = async (callback) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await callback(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const refreshInvoiceTotals = async (invoiceId, session) => {
  const invoice = await invoiceRepository.getInvoiceById(invoiceId, {
    session,
  });
  if (!invoice) return null;
  const payments = await paymentRepository.getAllPaymentsForInvoice(invoiceId, {
    session,
  });
  const totals = calculateInvoiceTotals({
    items: invoice.items,
    discountValue: invoice.discountValue ?? invoice.discount ?? 0,
    discountType: invoice.discountType || "fixed",
    taxRate: invoice.taxRate || 0,
    payments,
  });

  return invoiceRepository.updateInvoiceById(
    invoiceId,
    {
      ...totals,
      status: invoice.status === "void" ? "void" : totals.status,
      ...(invoice.issuedAt || totals.status === "draft"
        ? {}
        : { issuedAt: new Date() }),
    },
    { session },
  );
};

/**
 * Create a payment record and recalculate the related invoice.
 * @param {Object} payload - Payment payload.
 * @returns {Promise<Object>} The created payment.
 */
export const createPayment = async (payload) => {
  validateIdFields(payload, paymentIdFields);
  validatePositiveAmount(payload.amount);

  const payment = await withTransaction(async (session) => {
    const invoice = await invoiceRepository.getInvoiceById(payload.invoiceId, {
      session,
    });
    ensureFound(invoice, "No invoice found", "INVOICE_NOT_FOUND");
    validatePaymentAgainstInvoice(payload, invoice);
    if (
      invoice.dueAmount != null &&
      Number(payload.amount) > invoice.dueAmount
    ) {
      throw new AppError(
        "Payment amount cannot exceed the invoice balance",
        400,
        true,
        "PAYMENT_EXCEEDS_BALANCE",
      );
    }

    const createdPayment = await paymentRepository.createPayment(payload, {
      session,
    });
    ensureFound(
      createdPayment,
      "Failed to create payment",
      "PAYMENT_CREATION_FAILED",
    );
    await refreshInvoiceTotals(payload.invoiceId, session);
    return createdPayment;
  });

  return paymentRepository.getPaymentById(payment._id);
};

/**
 * Get a payment by id.
 * @param {string} id - Payment id.
 * @returns {Promise<Object>} The matching payment.
 */
export const getPaymentById = async (id) => {
  validateObjectId(id, "payment");
  const payment = await paymentRepository.getPaymentById(id);
  if (!payment) {
    throw new AppError("No payment found", 404, true, "PAYMENT_NOT_FOUND");
  }
  return payment;
};

/**
 * Get a paginated list of payments.
 * @param {Object} options - Query and pagination options.
 * @returns {Promise<Object>} Payments and pagination data.
 */
export const getAllPayments = (options = {}) =>
  paymentRepository.getAllPayments(options);

/**
 * Get payments for an invoice.
 * @param {string} invoiceId - Invoice id.
 * @param {Object} options - Query and pagination options.
 * @returns {Promise<Object>} Matching payments and pagination data.
 */
export const getPaymentsByInvoice = async (invoiceId, options = {}) => {
  validateObjectId(invoiceId, "invoice");
  return paymentRepository.getPaymentsByInvoice(invoiceId, options);
};

/**
 * Get payments for a patient.
 * @param {string} patientId - Patient id.
 * @param {Object} options - Query and pagination options.
 * @returns {Promise<Object>} Matching payments and pagination data.
 */
export const getPaymentsByPatient = async (patientId, options = {}) => {
  validateObjectId(patientId, "patient");
  return paymentRepository.getPaymentsByPatient(patientId, options);
};

/**
 * Update a payment by id and refresh affected invoice totals.
 * @param {string} id - Payment id.
 * @param {Object} payload - Payment fields to update.
 * @returns {Promise<Object>} The updated payment.
 */
export const updatePaymentById = async (id, payload) => {
  validateObjectId(id, "payment");
  validateIdFields(payload, paymentIdFields);
  if (payload.amount !== undefined) validatePositiveAmount(payload.amount);

  const updatedPayment = await withTransaction(async (session) => {
    const payment = await paymentRepository.getPaymentById(id, { session });
    ensureFound(payment, "No payment found", "PAYMENT_NOT_FOUND");
    const oldInvoiceId = getIdValue(payment.invoiceId);
    const targetInvoiceId = payload.invoiceId || oldInvoiceId;
    const targetInvoice = await invoiceRepository.getInvoiceById(
      targetInvoiceId,
      { session },
    );
    ensureFound(targetInvoice, "No invoice found", "INVOICE_NOT_FOUND");

    const effectivePayment = {
      ...payment,
      ...payload,
      patientId: payload.patientId || payment.patientId,
      currency: payload.currency || payment.currency,
    };
    validatePaymentAgainstInvoice(effectivePayment, targetInvoice);

    if (effectivePayment.status === "completed") {
      const existingPayments = await paymentRepository.getAllPaymentsForInvoice(
        targetInvoiceId,
        { session },
      );
      const otherPayments = existingPayments.filter(
        (item) => String(item._id) !== String(id),
      );
      const currentTotals = calculateInvoiceTotals({
        items: targetInvoice.items,
        discountValue: targetInvoice.discount || 0,
        discountType: targetInvoice.discountType || "fixed",
        taxRate: targetInvoice.taxRate || 0,
        payments: otherPayments,
      });
      if (Number(effectivePayment.amount) > currentTotals.dueAmount) {
        throw new AppError(
          "Payment amount cannot exceed the invoice balance",
          400,
          true,
          "PAYMENT_EXCEEDS_BALANCE",
        );
      }
    }

    const result = await paymentRepository.updatePaymentById(id, payload, {
      session,
    });
    ensureFound(result, "Failed to update payment", "PAYMENT_UPDATE_FAILED");
    await refreshInvoiceTotals(oldInvoiceId, session);
    if (String(targetInvoiceId) !== String(oldInvoiceId)) {
      await refreshInvoiceTotals(targetInvoiceId, session);
    }
    return result;
  });

  return paymentRepository.getPaymentById(updatedPayment._id);
};

/**
 * Update a payment status and refresh the related invoice.
 * @param {string} id - Payment id.
 * @param {string} status - New payment status.
 * @returns {Promise<Object>} The updated payment.
 */
export const updatePaymentStatus = async (id, status) => {
  validateObjectId(id, "payment");
  const allowedStatuses = [
    "pending",
    "completed",
    "failed",
    "refunded",
    "void",
  ];
  if (!allowedStatuses.includes(status)) {
    throw new AppError(
      "Invalid payment status",
      400,
      true,
      "INVALID_PAYMENT_STATUS",
    );
  }

  const updatedPayment = await withTransaction(async (session) => {
    const payment = await paymentRepository.getPaymentById(id, { session });
    ensureFound(payment, "No payment found", "PAYMENT_NOT_FOUND");
    const result = await paymentRepository.updatePaymentStatus(id, status, {
      session,
    });
    ensureFound(
      result,
      "Failed to update payment status",
      "PAYMENT_STATUS_UPDATE_FAILED",
    );
    await refreshInvoiceTotals(getIdValue(payment.invoiceId), session);
    return result;
  });

  return paymentRepository.getPaymentById(updatedPayment._id);
};

/**
 * Delete a payment by id and refresh the related invoice.
 * @param {string} id - Payment id.
 * @returns {Promise<Object>} The deleted payment.
 */
export const deletePaymentById = async (id) => {
  validateObjectId(id, "payment");
  return withTransaction(async (session) => {
    const payment = await paymentRepository.getPaymentById(id, { session });
    ensureFound(payment, "No payment found", "PAYMENT_NOT_FOUND");
    const deletedPayment = await paymentRepository.deletePaymentById(id, {
      session,
    });
    ensureFound(
      deletedPayment,
      "Failed to delete payment",
      "PAYMENT_DELETION_FAILED",
    );
    await refreshInvoiceTotals(getIdValue(payment.invoiceId), session);
    return deletedPayment;
  });
};
