import mongoose from "mongoose";

import Invoice from "../models/invoice.model.js";

const escapeRegex = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const toObjectId = (value) =>
  mongoose.isValidObjectId(value) ? new mongoose.Types.ObjectId(value) : value;

const invoicePopulate = [
  {
    path: "patientId",
    select: "patientCode firstName lastName phone gender age",
  },
  {
    path: "appointmentId",
    select: "appointmentCode appointmentDate appointmentTime status",
  },
  {
    path: "laboratoryOrderId",
    select: "orderCode status priority orderedAt totalAmount",
  },
  {
    path: "createdBy",
    select: "firstName lastName email role",
  },
];

const getPagination = (page = 1, limit = 10) => {
  const currentPage = Math.max(1, Number(page) || 1);
  const perPage = Math.max(1, Number(limit) || 10);

  return {
    currentPage,
    perPage,
    skip: (currentPage - 1) * perPage,
  };
};

const buildInvoiceSearchMatch = (search) => {
  if (!search) return null;

  const regex = new RegExp(escapeRegex(search), "i");

  return {
    $or: [
      { invoiceNumber: regex },
      { notes: regex },
      { "patient.patientCode": regex },
      { "patient.firstName": regex },
      { "patient.lastName": regex },
    ],
  };
};

const addPatientLookup = (pipeline) => {
  pipeline.push(
    {
      $lookup: {
        from: "patients",
        localField: "patientId",
        foreignField: "_id",
        as: "patient",
      },
    },
    {
      $unwind: {
        path: "$patient",
        preserveNullAndEmptyArrays: true,
      },
    },
  );
};

export const createInvoice = (payload, options = {}) =>
  Invoice.create(payload, options);

export const getInvoiceById = (id, { session } = {}) => {
  const query = Invoice.findById(id).populate(invoicePopulate).lean();
  return session ? query.session(session) : query;
};

export const getAllInvoices = async ({
  page = 1,
  limit = 10,
  search,
  status,
  patientId,
  currency,
  session,
} = {}) => {
  const { currentPage, perPage, skip } = getPagination(page, limit);
  const pipeline = [];

  addPatientLookup(pipeline);

  const searchMatch = buildInvoiceSearchMatch(search);
  if (searchMatch) pipeline.push({ $match: searchMatch });

  const filter = {};
  if (status) filter.status = status;
  if (currency) filter.currency = currency;
  if (patientId) filter.patientId = toObjectId(patientId);
  if (Object.keys(filter).length) pipeline.push({ $match: filter });

  pipeline.push({
    $facet: {
      invoices: [
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: perPage },
      ],
      totalInvoices: [{ $count: "count" }],
    },
  });

  const aggregate = Invoice.aggregate(pipeline);
  if (session) aggregate.session(session);

  const [result = { invoices: [], totalInvoices: [] }] = await aggregate;
  const invoices = await Invoice.populate(result.invoices, invoicePopulate);
  const totalInvoices = result.totalInvoices[0]?.count || 0;

  return {
    invoices,
    pagination: {
      totalInvoices,
      totalPages: Math.ceil(totalInvoices / perPage),
      currentPage,
      limit: perPage,
    },
  };
};

export const getInvoicesByPatient = (patientId, options = {}) =>
  getAllInvoices({ ...options, patientId });

export const updateInvoiceById = (id, payload, { session } = {}) =>
  Invoice.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
    session,
  }).populate(invoicePopulate);

export const updateInvoiceStatus = (id, status, { session } = {}) =>
  Invoice.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true, session },
  ).populate(invoicePopulate);

export const deleteInvoiceById = (id) => Invoice.findByIdAndDelete(id).lean();
