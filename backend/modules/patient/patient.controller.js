import {
  activatePatientById,
  createPatient,
  deactivatePatientById,
  deletePatientById,
  getAllPatients,
  getPatientById,
  searchPatients,
  updatePatientById,
} from "./patient.service.js";

const getPaginationOptions = ({ page, limit }) => ({
  page: parseInt(page) || 1,
  limit: parseInt(limit) || 10,
});

/**
 * POST /patients/register
 * Create new patient.
 */
export const createPatientController = async (req, res, next) => {
  try {
    const patient = await createPatient(req.body);

    return res.status(201).json({
      message: "Patient created successfully",
      patient,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /patients/:id
 * Get patient by ID.
 */
export const getPatientByIdController = async (req, res, next) => {
  try {
    const patient = await getPatientById(req.params.id);

    return res.status(200).json({
      message: "Patient retrieved successfully",
      patient,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /patients
 * Get all patients with pagination.
 */
export const getAllPatientsController = async (req, res, next) => {
  try {
    const patients = await getAllPatients(getPaginationOptions(req.query));

    return res.status(200).json(patients);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /patients/search?search=keyword
 * Search patients by first name, last name, or phone.
 */
export const searchPatientController = async (req, res, next) => {
  try {
    const patients = await searchPatients(
      req.query.search,
      getPaginationOptions(req.query),
    );

    return res.status(200).json({
      message: "Patient found successfully",
      patients,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /patients/:id
 * Update patient by ID.
 */
export const updatePatientByIdController = async (req, res, next) => {
  try {
    const patient = await updatePatientById(req.params.id, req.body);

    return res.status(200).json({
      message: "Patient updated successfully",
      patient,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /patients/:id/activate
 * Activate patient by ID.
 */
export const activatePatientController = async (req, res, next) => {
  try {
    const patient = await activatePatientById(req.params.id);

    return res.status(200).json({
      message: "Patient activated successfully",
      patient,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /patients/:id/deactivate
 * Deactivate patient by ID.
 */
export const deactivatePatientController = async (req, res, next) => {
  try {
    const patient = await deactivatePatientById(req.params.id);

    return res.status(200).json({
      message: "Patient deactivated successfully",
      patient,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /patients/:id
 * Delete patient by ID.
 */
export const deletePatientController = async (req, res, next) => {
  try {
    const patient = await deletePatientById(req.params.id);

    return res.status(200).json({
      message: "Patient deleted successfully",
      patient,
    });
  } catch (error) {
    next(error);
  }
};
