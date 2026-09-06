import {
  createInvoice,
  deleteInvoiceById,
  getAllInvoices,
  getInvoiceById,
  getInvoicesByPatient,
  updateInvoiceById,
  updateInvoiceStatus,
} from "../services/invoice.service.js";
import { generateInvoicePdf } from "../services/invoice-pdf.service.js";

const getPaginationOptions = ({ page, limit }) => ({
  page: parseInt(page) || 1,
  limit: parseInt(limit) || 10,
});

/**
 * Create an invoice.
 * Route: POST /invoices
 */
export const createInvoiceController = async (req, res, next) => {
  try {
    const invoice = await createInvoice(req.body);

    return res.status(201).json({
      message: "Invoice created successfully",
      invoice,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get an invoice by id.
 * Route: GET /invoices/:id
 */
export const getInvoiceByIdController = async (req, res, next) => {
  try {
    const invoice = await getInvoiceById(req.params.id);

    return res.status(200).json({
      message: "Invoice retrieved successfully",
      invoice,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate and download an invoice PDF.
 * Route: GET /invoices/:id/pdf
 */
export const getInvoicePdfController = async (req, res, next) => {
  try {
    const invoice = await getInvoiceById(req.params.id);
    const pdf = await generateInvoicePdf(invoice);
    const filename = `${invoice.invoiceNumber || "invoice"}.pdf`;

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": pdf.length,
    });
    return res.status(200).send(pdf);
  } catch (error) {
    next(error);
  }
};


/**
 * Get all invoices with optional search, filters, and pagination.
 * Route: GET /invoices
 */
export const getAllInvoicesController = async (req, res, next) => {
  try {
    const { search, status, patientId, currency } = req.query;
    const invoices = await getAllInvoices({
      search,
      status,
      patientId,
      currency,
      ...getPaginationOptions(req.query),
    });

    return res.status(200).json(invoices);
  } catch (error) {
    next(error);
  }
};

/**
 * Get invoices for a patient.
 * Route: GET /invoices/patient/:patientId
 */
export const getInvoicesByPatientController = async (req, res, next) => {
  try {
    const invoices = await getInvoicesByPatient(
      req.params.patientId,
      getPaginationOptions(req.query),
    );

    return res.status(200).json(invoices);
  } catch (error) {
    next(error);
  }
};

/**
 * Update an invoice by id.
 * Route: PUT /invoices/:id
 */
export const updateInvoiceByIdController = async (req, res, next) => {
  try {
    const invoice = await updateInvoiceById(req.params.id, req.body);

    return res.status(200).json({
      message: "Invoice updated successfully",
      invoice,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an invoice status.
 * Route: PATCH /invoices/:id/status
 */
export const updateInvoiceStatusController = async (req, res, next) => {
  try {
    const invoice = await updateInvoiceStatus(req.params.id, req.body.status);

    return res.status(200).json({
      message: "Invoice status updated successfully",
      invoice,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an invoice by id.
 * Route: DELETE /invoices/:id
 */
export const deleteInvoiceByIdController = async (req, res, next) => {
  try {
    const invoice = await deleteInvoiceById(req.params.id);

    return res.status(200).json({
      message: "Invoice deleted successfully",
      invoice,
    });
  } catch (error) {
    next(error);
  }
};
