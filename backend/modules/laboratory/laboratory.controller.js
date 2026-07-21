import {
  createLaboratoryOrder,
  createLaboratoryResult,
  createLaboratoryTest,
  deleteLaboratoryOrderById,
  deleteLaboratoryResultById,
  deleteLaboratoryTestById,
  getAllLaboratoryOrders,
  getAllLaboratoryResults,
  getAllLaboratoryTests,
  getLaboratoryOrderById,
  getLaboratoryResultById,
  getLaboratoryTestById,
  updateLaboratoryOrderById,
  updateLaboratoryResultById,
  updateLaboratoryTestById,
} from "./laboratory.service.js";

const getPaginationOptions = ({ page, limit }) => ({
  page: parseInt(page) || 1,
  limit: parseInt(limit) || 10,
});

/* LAB TESTS */
/**
 * Create a laboratory test.
 * Route: POST /tests
 */
export const createLaboratoryTestController = async (req, res, next) => {
  try {
    const laboratoryTest = await createLaboratoryTest(req.body);

    return res.status(201).json({
      message: "Laboratory test created successfully",
      laboratoryTest,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a laboratory test by id.
 * Route: GET /tests/:id
 */
export const getLaboratoryTestByIdController = async (req, res, next) => {
  try {
    const laboratoryTest = await getLaboratoryTestById(req.params.id);

    return res.status(200).json({
      message: "Laboratory test retrieved successfully",
      laboratoryTest,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all laboratory tests with optional search and pagination.
 * Route: GET /tests
 */
export const getAllLaboratoryTestsController = async (req, res, next) => {
  try {
    const { search, category, active, page, limit } = req.query;
    const laboratoryTests = await getAllLaboratoryTests({
      search,
      category,
      active: active === undefined ? undefined : active === "true",
      ...getPaginationOptions({ page, limit }),
    });

    return res.status(200).json(laboratoryTests);
  } catch (error) {
    next(error);
  }
};

/**
 * Update a laboratory test by id.
 * Route: PUT /tests/:id
 */
export const updateLaboratoryTestByIdController = async (req, res, next) => {
  try {
    const laboratoryTest = await updateLaboratoryTestById(
      req.params.id,
      req.body,
    );

    return res.status(200).json({
      message: "Laboratory test updated successfully",
      laboratoryTest,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a laboratory test by id.
 * Route: DELETE /tests/:id
 */
export const deleteLaboratoryTestByIdController = async (req, res, next) => {
  try {
    const laboratoryTest = await deleteLaboratoryTestById(req.params.id);

    return res.status(200).json({
      message: "Laboratory test deleted successfully",
      laboratoryTest,
    });
  } catch (error) {
    next(error);
  }
};

/* LAB ORDERS */
/**
 * Create a laboratory order.
 * Route: POST /orders
 */
export const createLaboratoryOrderController = async (req, res, next) => {
  try {
    const laboratoryOrder = await createLaboratoryOrder(req.body);

    return res.status(201).json({
      message: "Laboratory order created successfully",
      laboratoryOrder,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a laboratory order by id.
 * Route: GET /orders/:id
 */
export const getLaboratoryOrderByIdController = async (req, res, next) => {
  try {
    const laboratoryOrder = await getLaboratoryOrderById(req.params.id);

    return res.status(200).json({
      message: "Laboratory order retrieved successfully",
      laboratoryOrder,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all laboratory orders with optional search and filters.
 * Route: GET /orders
 */
export const getAllLaboratoryOrdersController = async (req, res, next) => {
  try {
    const { search, status, priority, patientId, page, limit } = req.query;
    const laboratoryOrders = await getAllLaboratoryOrders({
      search,
      status,
      priority,
      patientId,
      ...getPaginationOptions({ page, limit }),
    });

    return res.status(200).json(laboratoryOrders);
  } catch (error) {
    next(error);
  }
};

/**
 * Update a laboratory order by id.
 * Route: PUT /orders/:id
 */
export const updateLaboratoryOrderByIdController = async (req, res, next) => {
  try {
    const laboratoryOrder = await updateLaboratoryOrderById(
      req.params.id,
      req.body,
    );

    return res.status(200).json({
      message: "Laboratory order updated successfully",
      laboratoryOrder,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a laboratory order by id.
 * Route: DELETE /orders/:id
 */
export const deleteLaboratoryOrderByIdController = async (req, res, next) => {
  try {
    const laboratoryOrder = await deleteLaboratoryOrderById(req.params.id);

    return res.status(200).json({
      message: "Laboratory order deleted successfully",
      laboratoryOrder,
    });
  } catch (error) {
    next(error);
  }
};

/* LAB RESULTS */
/**
 * Create a laboratory result.
 * Route: POST /results
 */
export const createLaboratoryResultController = async (req, res, next) => {
  try {
    const laboratoryResult = await createLaboratoryResult(req.body);

    return res.status(201).json({
      message: "Laboratory result created successfully",
      laboratoryResult,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a laboratory result by id.
 * Route: GET /results/:id
 */
export const getLaboratoryResultByIdController = async (req, res, next) => {
  try {
    const laboratoryResult = await getLaboratoryResultById(req.params.id);

    return res.status(200).json({
      message: "Laboratory result retrieved successfully",
      laboratoryResult,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all laboratory results with optional search and filters.
 * Route: GET /results
 */
export const getAllLaboratoryResultsController = async (req, res, next) => {
  try {
    const { search, status, patientId, orderId, page, limit } = req.query;
    const laboratoryResults = await getAllLaboratoryResults({
      search,
      status,
      patientId,
      orderId,
      ...getPaginationOptions({ page, limit }),
    });

    return res.status(200).json(laboratoryResults);
  } catch (error) {
    next(error);
  }
};

/**
 * Update a laboratory result by id.
 * Route: PUT /results/:id
 */
export const updateLaboratoryResultByIdController = async (req, res, next) => {
  try {
    const laboratoryResult = await updateLaboratoryResultById(
      req.params.id,
      req.body,
    );

    return res.status(200).json({
      message: "Laboratory result updated successfully",
      laboratoryResult,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a laboratory result by id.
 * Route: DELETE /results/:id
 */
export const deleteLaboratoryResultByIdController = async (req, res, next) => {
  try {
    const laboratoryResult = await deleteLaboratoryResultById(req.params.id);

    return res.status(200).json({
      message: "Laboratory result deleted successfully",
      laboratoryResult,
    });
  } catch (error) {
    next(error);
  }
};
