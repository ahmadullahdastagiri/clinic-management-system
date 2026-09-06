import {
  createPayment,
  deletePaymentById,
  getAllPayments,
  getPaymentById,
  getPaymentsByInvoice,
  getPaymentsByPatient,
  updatePaymentById,
  updatePaymentStatus,
} from "../services/payment.service.js";

const getPaginationOptions = ({ page, limit }) => ({
  page: parseInt(page) || 1,
  limit: parseInt(limit) || 10,
});

/**
 * Create a payment.
 * Route: POST /payments
 */
export const createPaymentController = async (req, res, next) => {
  try {
    const payment = await createPayment(req.body);

    return res.status(201).json({
      message: "Payment created successfully",
      payment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a payment by id.
 * Route: GET /payments/:id
 */
export const getPaymentByIdController = async (req, res, next) => {
  try {
    const payment = await getPaymentById(req.params.id);

    return res.status(200).json({
      message: "Payment retrieved successfully",
      payment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all payments with optional search, filters, and pagination.
 * Route: GET /payments
 */
export const getAllPaymentsController = async (req, res, next) => {
  try {
    const { search, status, method, invoiceId, patientId, currency } =
      req.query;
    const payments = await getAllPayments({
      search,
      status,
      method,
      invoiceId,
      patientId,
      currency,
      ...getPaginationOptions(req.query),
    });

    return res.status(200).json(payments);
  } catch (error) {
    next(error);
  }
};

/**
 * Get payments for an invoice.
 * Route: GET /payments/invoice/:invoiceId
 */
export const getPaymentsByInvoiceController = async (req, res, next) => {
  try {
    const payments = await getPaymentsByInvoice(
      req.params.invoiceId,
      getPaginationOptions(req.query),
    );

    return res.status(200).json(payments);
  } catch (error) {
    next(error);
  }
};

/**
 * Get payments for a patient.
 * Route: GET /payments/patient/:patientId
 */
export const getPaymentsByPatientController = async (req, res, next) => {
  try {
    const payments = await getPaymentsByPatient(
      req.params.patientId,
      getPaginationOptions(req.query),
    );

    return res.status(200).json(payments);
  } catch (error) {
    next(error);
  }
};

/**
 * Update a payment by id.
 * Route: PUT /payments/:id
 */
export const updatePaymentByIdController = async (req, res, next) => {
  try {
    const payment = await updatePaymentById(req.params.id, req.body);

    return res.status(200).json({
      message: "Payment updated successfully",
      payment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a payment status.
 * Route: PATCH /payments/:id/status
 */
export const updatePaymentStatusController = async (req, res, next) => {
  try {
    const payment = await updatePaymentStatus(req.params.id, req.body.status);

    return res.status(200).json({
      message: "Payment status updated successfully",
      payment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a payment by id.
 * Route: DELETE /payments/:id
 */
export const deletePaymentByIdController = async (req, res, next) => {
  try {
    const payment = await deletePaymentById(req.params.id);

    return res.status(200).json({
      message: "Payment deleted successfully",
      payment,
    });
  } catch (error) {
    next(error);
  }
};
