import {
  activateDoctorById,
  deactivateDoctorById,
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctorById,
  deleteDoctorById,
  findDoctorByName,
} from "./doctor.service.js";

/**
 * POST /doctor/register
 * Create new docotr
 */
export const createDoctorController = async (req, res, next) => {
  try {
    const doctor = await createDoctor(req.body);
    return res.status(201).json({
      message: "Doctor created successfully",
      doctor,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /doctor/:Id
 * Get doctor by ID
 */
export const getDoctorByIdController = async (req, res, next) => {
  try {
    const doctor = await getDoctorById(req.params.id);
    return res.status(200).json({
      message: "Doctor retrieved successfully",
      doctor,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /doctor/doctors
 * Get doctor all doctors
 */
export const allDoctorsController = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const doctors = await getAllDoctors({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
    });
    return res.status(200).json(doctors);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /doctors/search?search=keyword
 * Search doctor by name and last name
 */
export const findDoctorController = async (req, res, next) => {
  try {
    const { search, page, limit } = req.query;
    const searchData = await findDoctorByName(search, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
    });
    return res.status(200).json({
      message: "Doctor found successfully",
      searchData,
    });
  } catch (error) {
    next(error);
  }
};
/**
 * PUT /doctor/:id
 * Updates doctor by ID
 */
export const updateDoctorByIdController = async (req, res, next) => {
  try {
    const updateDoctor = await updateDoctorById(req.params.id, req.body);
    return res.status(200).json({
      message: "Doctor updated successfully",
      updateDoctor,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /doctor/:id/activate
 * Activates a doctor's by ID
 */
export const activateDoctorController = async (req, res, next) => {
  try {
    const activateDoctor = await activateDoctorById(req.params.id);
    return res.status(200).json({
      message: "Doctor activated successfully",
      activateDoctor,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /doctor/:id/deactivate
 * Deactivates a doctor's by ID
 */
export const deactivateDoctorController = async (req, res, next) => {
  try {
    const deactivateDoctor = await deactivateDoctorById(req.params.id);
    return res.status(200).json({
      message: "Doctor deactivated successfully",
      deactivateDoctor,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /doctor/:id/delete
 * Delete doctor by ID
 */
export const deleteDoctorController = async (req, res, next) => {
  try {
    const deleteDoctor = await deleteDoctorById(req.params.id);
    return res.status(200).json({
      message: "Doctor deleted successfully",
      deleteDoctor,
    });
  } catch (error) {
    next(error);
  }
};
