import mongoose from "mongoose";

import Payment from "../models/payment.model.js";

const escapeRegex = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const toObjectId = (value) =>
  mongoose.isValidObjectId(value) ? new mongoose.Types.ObjectId(value) : value;

const paymentPopulate = [
  {
    path: "invoiceId",
    select: "invoiceNumber patientId totalAmount paidAmount dueAmount status currency",
  },
  {
    path: "patientId",
    select: "patientCode firstName lastName phone gender age",
  },
  {
    path: "receivedBy",
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

const buildPaymentSearchMatch = (search) => {
  if (!search) return null;

  const regex = new RegExp(escapeRegex(search), "i");

  return {
    $or: [
      { paymentCode: regex },
      { transactionReference: regex },
      { notes: regex },
      { "invoice.invoiceNumber": regex },
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

export const createPayment = (payload, options = {}) =>
  Payment.create(payload, options);

export const getPaymentById = (id, { session } = {}) => {
  const query = Payment.findById(id).populate(paymentPopulate).lean();
  return session ? query.session(session) : query;
};

export const getAllPayments = async ({
  page = 1,
  limit = 10,
  search,
  status,
  method,
  invoiceId,
  patientId,
  currency,
  session,
} = {}) => {
  const { currentPage, perPage, skip } = getPagination(page, limit);
  const pipeline = [
    {
      $lookup: {
        from: "invoices",
        localField: "invoiceId",
        foreignField: "_id",
        as: "invoice",
      },
    },
    {
      $unwind: {
        path: "$invoice",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];
  addPatientLookup(pipeline);

  const searchMatch = buildPaymentSearchMatch(search);
  if (searchMatch) pipeline.push({ $match: searchMatch });

  const filter = {};
  if (status) filter.status = status;
  if (method) filter.method = method;
  if (currency) filter.currency = currency;
  if (invoiceId) filter.invoiceId = toObjectId(invoiceId);
  if (patientId) filter.patientId = toObjectId(patientId);
  if (Object.keys(filter).length) pipeline.push({ $match: filter });

  pipeline.push({ $unset: ["invoice", "patient"] });
  pipeline.push({
    $facet: {
      payments: [
        { $sort: { paidAt: -1, createdAt: -1 } },
        { $skip: skip },
        { $limit: perPage },
      ],
      totalPayments: [{ $count: "count" }],
    },
  });

  const aggregate = Payment.aggregate(pipeline);
  if (session) aggregate.session(session);

  const [result = { payments: [], totalPayments: [] }] = await aggregate;
  const payments = await Payment.populate(result.payments, paymentPopulate);
  const totalPayments = result.totalPayments[0]?.count || 0;

  return {
    payments,
    pagination: {
      totalPayments,
      totalPages: Math.ceil(totalPayments / perPage),
      currentPage,
      limit: perPage,
    },
  };
};

export const getPaymentsByInvoice = (invoiceId, options = {}) =>
  getAllPayments({ ...options, invoiceId });

export const getAllPaymentsForInvoice = (invoiceId, { session } = {}) => {
  const query = Payment.find({ invoiceId })
    .sort({ paidAt: -1, createdAt: -1 })
    .populate(paymentPopulate)
    .lean();

  return session ? query.session(session) : query;
};

export const getPaymentsByPatient = (patientId, options = {}) =>
  getAllPayments({ ...options, patientId });

export const updatePaymentById = (id, payload, { session } = {}) =>
  Payment.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
    session,
  }).populate(paymentPopulate);

export const updatePaymentStatus = (id, status, { session } = {}) =>
  Payment.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true, session },
  ).populate(paymentPopulate);

export const deletePaymentById = (id, { session } = {}) => {
  const query = Payment.findByIdAndDelete(id).lean();
  return session ? query.session(session) : query;
};
