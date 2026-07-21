import AppError from "../../utils/AppError.js";
import { validateObjectId } from "../../utils/validateObjectId.js";
import * as laboratoryRepository from "./laboratory.repository.js";

const validateIdFields = (payload, fields) => {
  fields.forEach(({ key, resource }) => {
    if (payload?.[key]) {
      validateObjectId(payload[key], resource);
    }
  });
};

/* LAB TESTS */
/**
 * Create a laboratory test record.
 * @param {Object} payload - Laboratory test payload.
 * @returns {Promise<Object>} The created laboratory test.
 */
export const createLaboratoryTest = async (payload) => {
  const { name } = payload;
  const checkLaboratoryTest =
    await laboratoryRepository.getLaboratoryTestByName(name);

  if (checkLaboratoryTest)
    throw new AppError(
      "The test with this name already exists",
      400,
      true,
      "LAB_TEST_CREATION_FAILED",
    );

  const laboratoryTest =
    await laboratoryRepository.createLaboratoryTest(payload);

  if (!laboratoryTest)
    throw new AppError(
      "Failed to create laboratory test",
      404,
      true,
      "LAB_TEST_CREATION_FAILED",
    );

  return laboratoryTest;
};

/**
 * Get a laboratory test by id.
 * @param {string} id - Laboratory test id.
 * @returns {Promise<Object>} The matching laboratory test.
 */
export const getLaboratoryTestById = async (id) => {
  validateObjectId(id, "laboratory test");

  const laboratoryTest = await laboratoryRepository.getLaboratoryTestById(id);

  if (!laboratoryTest)
    throw new AppError(
      "No laboratory test found",
      404,
      true,
      "LAB_TEST_NOT_FOUND",
    );

  return laboratoryTest;
};

/**
 * Get a paginated list of laboratory tests.
 * @param {Object} options - Query options.
 * @returns {Promise<Object>} Laboratory tests and pagination data.
 */
export const getAllLaboratoryTests = async ({
  page = 1,
  limit = 10,
  search,
  category,
  active,
} = {}) => {
  const laboratoryTests = await laboratoryRepository.getAllLaboratoryTests({
    page,
    limit,
    search,
    category,
    active,
  });

  return laboratoryTests;
};

/**
 * Update a laboratory test by id.
 * @param {string} id - Laboratory test id.
 * @param {Object} payload - Update payload.
 * @returns {Promise<Object>} The updated laboratory test.
 */
export const updateLaboratoryTestById = async (id, payload) => {
  validateObjectId(id, "laboratory test");

  const laboratoryTest = await laboratoryRepository.getLaboratoryTestById(id);

  if (!laboratoryTest)
    throw new AppError(
      "No laboratory test found",
      404,
      true,
      "LAB_TEST_NOT_FOUND",
    );

  const updatedLaboratoryTest =
    await laboratoryRepository.updateLaboratoryTestById(id, payload);

  if (!laboratoryTest)
    throw new AppError(
      "Failed to update laboratory test",
      404,
      true,
      "LAB_TEST_UPDATE_FAILED",
    );

  return laboratoryTest;
};

/**
 * Delete a laboratory test by id.
 * @param {string} id - Laboratory test id.
 * @returns {Promise<Object>} The deleted laboratory test.
 */
export const deleteLaboratoryTestById = async (id) => {
  validateObjectId(id, "laboratory test");

  const laboratoryTest = await laboratoryRepository.getLaboratoryTestById(id);

  if (!laboratoryTest)
    throw new AppError(
      "No laboratory test found",
      404,
      true,
      "LAB_TEST_NOT_FOUND",
    );

  const deletedLaboratoryTest =
    await laboratoryRepository.deleteLaboratoryTestById(id);

  if (!laboratoryTest)
    throw new AppError(
      "Failed to delete laboratory test",
      404,
      true,
      "LAB_TEST_DELETE_FAILED",
    );

  return deletedLaboratoryTest;
};

/* LAB ORDERS */
/**
 * Create a laboratory order record.
 * @param {Object} payload - Laboratory order payload.
 * @returns {Promise<Object>} The created laboratory order.
 */
export const createLaboratoryOrder = async (payload) => {
  validateIdFields(payload, [
    { key: "patientId", resource: "patient" },
    { key: "doctorId", resource: "doctor" },
    { key: "appointmentId", resource: "appointment" },
    { key: "orderedBy", resource: "user" },
    { key: "createdBy", resource: "user" },
  ]);

  const laboratoryOrder =
    await laboratoryRepository.createLaboratoryOrder(payload);

  if (!laboratoryOrder)
    throw new AppError(
      "Failed to create laboratory order",
      404,
      true,
      "LAB_ORDER_CREATION_FAILED",
    );

  return laboratoryOrder;
};

/**
 * Get a laboratory order by id.
 * @param {string} id - Laboratory order id.
 * @returns {Promise<Object>} The matching laboratory order.
 */
export const getLaboratoryOrderById = async (id) => {
  validateObjectId(id, "laboratory order");

  const laboratoryOrder = await laboratoryRepository.getLaboratoryOrderById(id);

  if (!laboratoryOrder)
    throw new AppError(
      "No laboratory order found",
      404,
      true,
      "LAB_ORDER_NOT_FOUND",
    );

  return laboratoryOrder;
};

/**
 * Get a paginated list of laboratory orders.
 * @param {Object} options - Query options.
 * @returns {Promise<Object>} Laboratory orders and pagination data.
 */
export const getAllLaboratoryOrders = async ({
  page = 1,
  limit = 10,
  search,
  status,
  priority,
  patientId,
} = {}) => {
  const laboratoryOrders = await laboratoryRepository.getAllLaboratoryOrders({
    page,
    limit,
    search,
    status,
    priority,
    patientId,
  });

  return laboratoryOrders;
};

/**
 * Update a laboratory order by id.
 * @param {string} id - Laboratory order id.
 * @param {Object} payload - Update payload.
 * @returns {Promise<Object>} The updated laboratory order.
 */
export const updateLaboratoryOrderById = async (id, payload) => {
  validateObjectId(id, "laboratory order");
  validateIdFields(payload, [
    { key: "patientId", resource: "patient" },
    { key: "doctorId", resource: "doctor" },
    { key: "appointmentId", resource: "appointment" },
    { key: "orderedBy", resource: "user" },
    { key: "createdBy", resource: "user" },
  ]);

  const laboratoryOrder = await laboratoryRepository.getLaboratoryOrderById(id);

  if (!laboratoryOrder)
    throw new AppError(
      "No laboratory order found",
      404,
      true,
      "NO_LAB_ORDER_FOUND",
    );

  const updatedLaboratoryOrder =
    await laboratoryRepository.updateLaboratoryOrderById(id, payload);

  if (!updatedLaboratoryOrder)
    throw new AppError(
      "Failed to update laboratory order",
      404,
      true,
      "LAB_ORDER_UPDATE_FAILED",
    );
};

/**
 * Delete a laboratory order by id.
 * @param {string} id - Laboratory order id.
 * @returns {Promise<Object>} The deleted laboratory order.
 */
export const deleteLaboratoryOrderById = async (id) => {
  validateObjectId(id, "laboratory order");

  const laboratoryOrder = await laboratoryRepository.getLaboratoryOrderById(id);

  if (!laboratoryOrder)
    throw new AppError(
      "No laboratory order found",
      404,
      true,
      "NO_LAB_ORDER_FOUND",
    );
  const deletedLaboratoryOrder =
    await laboratoryRepository.deleteLaboratoryOrderById(id);

  if (!laboratoryOrder)
    throw new AppError(
      "Failed to delete laboratory order",
      404,
      true,
      "LAB_ORDER_DELETE_FAILED",
    );
};

/* LAB RESULTS */
/**
 * Create a laboratory result record.
 * @param {Object} payload - Laboratory result payload.
 * @returns {Promise<Object>} The created laboratory result.
 */
export const createLaboratoryResult = async (payload) => {
  validateIdFields(payload, [
    { key: "orderId", resource: "laboratory order" },
    { key: "patientId", resource: "patient" },
    { key: "reportedBy", resource: "user" },
    { key: "reviewedBy", resource: "user" },
  ]);

  const laboratoryResult =
    await laboratoryRepository.createLaboratoryResult(payload);

  if (!laboratoryResult)
    throw new AppError(
      "Failed to create laboratory result",
      404,
      true,
      "LAB_RESULT_CREATION_FAILED",
    );

  return laboratoryResult;
};

/**
 * Get a laboratory result by id.
 * @param {string} id - Laboratory result id.
 * @returns {Promise<Object>} The matching laboratory result.
 */
export const getLaboratoryResultById = async (id) => {
  validateObjectId(id, "laboratory result");

  const laboratoryResult =
    await laboratoryRepository.getLaboratoryResultById(id);

  if (!laboratoryResult)
    throw new AppError(
      "No laboratory result found",
      404,
      true,
      "LAB_RESULT_NOT_FOUND",
    );

  return laboratoryResult;
};

/**
 * Get a paginated list of laboratory results.
 * @param {Object} options - Query options.
 * @returns {Promise<Object>} Laboratory results and pagination data.
 */
export const getAllLaboratoryResults = async ({
  page = 1,
  limit = 10,
  search,
  status,
  patientId,
  orderId,
} = {}) =>
  laboratoryRepository.getAllLaboratoryResults({
    page,
    limit,
    search,
    status,
    patientId,
    orderId,
  });

/**
 * Update a laboratory result by id.
 * @param {string} id - Laboratory result id.
 * @param {Object} payload - Update payload.
 * @returns {Promise<Object>} The updated laboratory result.
 */
export const updateLaboratoryResultById = async (id, payload) => {
  validateObjectId(id, "laboratory result");
  validateIdFields(payload, [
    { key: "orderId", resource: "laboratory order" },
    { key: "patientId", resource: "patient" },
    { key: "reportedBy", resource: "user" },
    { key: "reviewedBy", resource: "user" },
  ]);

  const laboratoryResult =
    await laboratoryRepository.getLaboratoryResultById(id);

  if (!laboratoryResult)
    throw new AppError(
      "No laboratory result found",
      404,
      true,
      "LAB_RESULT_NOT_FOUND",
    );

  const updatedLaboratoryResult =
    await laboratoryRepository.updateLaboratoryResultById(id, payload);

  if (!updatedLaboratoryResult)
    throw new AppError(
      "Failed to update laboratory result",
      404,
      true,
      "LAB_RESULT_UPDATE_FAILED",
    );

  return updatedLaboratoryResult;
};

/**
 * Delete a laboratory result by id.
 * @param {string} id - Laboratory result id.
 * @returns {Promise<Object>} The deleted laboratory result.
 */
export const deleteLaboratoryResultById = async (id) => {
  validateObjectId(id, "laboratory result");

  const laboratoryResult =
    await laboratoryRepository.getLaboratoryResultById(id);

  if (!laboratoryResult)
    throw new AppError(
      "No laboratory result found",
      404,
      true,
      "LAB_RESULT_NOT_FOUND",
    );

  const deletedLaboratoryResult =
    await laboratoryRepository.deleteLaboratoryResultById(id);

  if (!deletedLaboratoryResult)
    throw new AppError(
      "Failed to delete laboratory result",
      404,
      true,
      "LAB_RESULT_DELETE_FAILED",
    );

  return deletedLaboratoryResult;
};
