import mongoose from "mongoose";

import LaboratoryOrder from "./models/laboratoryOrder.model.js";
import LaboratoryResult from "./models/laboratoryResult.model.js";
import LaboratoryTest from "./models/laboratoryTest.model.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const testPopulate = [
  {
    path: "createdBy",
    select: "firstName lastName email role",
  },
];

const orderPopulate = [
  {
    path: "patientId",
    select: "patientCode firstName lastName phone gender age",
  },
  {
    path: "doctorId",
    select: "userId specialization contactNumber",
    populate: {
      path: "userId",
      select: "firstName lastName email phone",
    },
  },
  {
    path: "orderedBy",
    select: "firstName lastName email role",
  },
  {
    path: "createdBy",
    select: "firstName lastName email role",
  },
];

const resultPopulate = [
  {
    path: "orderId",
    select: "orderCode status priority patientId orderedAt totalAmount",
  },
  {
    path: "patientId",
    select: "patientCode firstName lastName phone gender age",
  },
  {
    path: "reportedBy",
    select: "firstName lastName email role",
  },
  {
    path: "reviewedBy",
    select: "firstName lastName email role",
  },
];

const buildOrderSearchMatch = (search) => {
  if (!search) return null;

  const regex = new RegExp(escapeRegex(search), "i");
  return {
    $or: [
      { orderCode: regex },
      { notes: regex },
      { "patient.patientCode": regex },
      { "patient.firstName": regex },
      { "patient.lastName": regex },
    ],
  };
};

const buildResultSearchMatch = (search) => {
  if (!search) return null;

  const regex = new RegExp(escapeRegex(search), "i");
  return {
    $or: [
      { resultCode: regex },
      { summary: regex },
      { "patient.patientCode": regex },
      { "patient.firstName": regex },
      { "patient.lastName": regex },
    ],
  };
};

/* LAB TESTS */
export const createLaboratoryTest = (payload) => LaboratoryTest.create(payload);

export const getLaboratoryTestByName = (payload) =>
  LaboratoryTest.find({ name: payload }).populate(testPopulate).lean();

export const getLaboratoryTestById = (id) =>
  LaboratoryTest.findById(id).populate(testPopulate).lean();

export const getAllLaboratoryTests = async ({
  page = 1,
  limit = 10,
  search,
  category,
  active,
} = {}) => {
  const currentPage = Number(page) || 1;
  const perPage = Number(limit) || 10;
  const skip = (currentPage - 1) * perPage;

  const filter = {};

  if (search) {
    const regex = new RegExp(escapeRegex(search), "i");
    filter.$or = [
      { name: regex },
      { labTestCode: regex },
      { specimenType: regex },
    ];
  }

  if (category) {
    filter.category = category;
  }

  if (typeof active === "boolean") {
    filter.active = active;
  }

  const tests = await LaboratoryTest.find(filter)
    .skip(skip)
    .limit(perPage)
    .populate(testPopulate)
    .lean();

  const totalTests = await LaboratoryTest.countDocuments(filter);
  const totalPages = Math.ceil(totalTests / perPage);

  return {
    tests,
    pagination: {
      totalTests,
      totalPages,
      currentPage,
      limit: perPage,
    },
  };
};

export const updateLaboratoryTestById = (id, payload) =>
  LaboratoryTest.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).populate(testPopulate);

export const deleteLaboratoryTestById = (id) =>
  LaboratoryTest.findByIdAndDelete(id);

/* LAB ORDERS */
export const createLaboratoryOrder = (payload) =>
  LaboratoryOrder.create(payload);

export const getLaboratoryOrderById = (id) =>
  LaboratoryOrder.findById(id).populate(orderPopulate).lean();

export const getAllLaboratoryOrders = async ({
  page = 1,
  limit = 10,
  search,
  status,
  priority,
  patientId,
} = {}) => {
  const currentPage = Number(page) || 1;
  const perPage = Number(limit) || 10;
  const skip = (currentPage - 1) * perPage;

  const pipeline = [
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
  ];

  if (search) pipeline.push({ $match: buildOrderSearchMatch(search) });

  const filter = {};

  if (status) filter.status = status;

  if (priority) filter.priority = priority;

  if (patientId)
    filter.patientId = mongoose.isValidObjectId(patientId)
      ? new mongoose.Types.ObjectId(patientId)
      : patientId;

  if (Object.keys(filter).length > 0) pipeline.push({ $match: filter });

  pipeline.push({
    $facet: {
      orders: [
        { $sort: { orderedAt: -1 } },
        { $skip: skip },
        { $limit: perPage },
      ],
      totalOrders: [{ $count: "totalOrders" }],
    },
  });

  const [result = { orders: [], totalOrders: [] }] =
    await LaboratoryOrder.aggregate(pipeline);

  const orders = await LaboratoryOrder.populate(result.orders, orderPopulate);
  const totalOrders = result.totalOrders[0]?.totalOrders ?? 0;
  const totalPages = Math.ceil(totalOrders / perPage);

  return {
    orders,
    pagination: {
      totalOrders,
      totalPages,
      currentPage,
      limit: perPage,
    },
  };
};

export const updateLaboratoryOrderById = (id, payload) =>
  LaboratoryOrder.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).populate(orderPopulate);

export const deleteLaboratoryOrderById = (id) =>
  LaboratoryOrder.findByIdAndDelete(id);

/* LAB RESULTS */
export const createLaboratoryResult = (payload) =>
  LaboratoryResult.create(payload);

export const getLaboratoryResultById = (id) =>
  LaboratoryResult.findById(id).populate(resultPopulate).lean();

export const getAllLaboratoryResults = async ({
  page = 1,
  limit = 10,
  search,
  status,
  patientId,
  orderId,
} = {}) => {
  const currentPage = Number(page) || 1;
  const perPage = Number(limit) || 10;
  const skip = (currentPage - 1) * perPage;

  const pipeline = [
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
  ];

  if (search) pipeline.push({ $match: buildResultSearchMatch(search) });

  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (patientId)
    filter.patientId = mongoose.isValidObjectId(patientId)
      ? new mongoose.Types.ObjectId(patientId)
      : patientId;

  if (orderId)
    filter.orderId = mongoose.isValidObjectId(orderId)
      ? new mongoose.Types.ObjectId(orderId)
      : orderId;

  if (Object.keys(filter).length > 0) pipeline.push({ $match: filter });

  pipeline.push({
    $facet: {
      results: [
        { $sort: { reportedAt: -1 } },
        { $skip: skip },
        { $limit: perPage },
      ],
      totalResults: [{ $count: "totalResults" }],
    },
  });

  const [result = { results: [], totalResults: [] }] =
    await LaboratoryResult.aggregate(pipeline);

  const results = await LaboratoryResult.populate(
    result.results,
    resultPopulate,
  );
  const totalResults = result.totalResults[0]?.totalResults ?? 0;
  const totalPages = Math.ceil(totalResults / perPage);

  return {
    results,
    pagination: {
      totalResults,
      totalPages,
      currentPage,
      limit: perPage,
    },
  };
};

export const updateLaboratoryResultById = (id, payload) =>
  LaboratoryResult.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).populate(resultPopulate);

export const deleteLaboratoryResultById = (id) =>
  LaboratoryResult.findByIdAndDelete(id);
