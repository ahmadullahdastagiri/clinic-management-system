import {
  createDoctor,
  getAllDoctors,
  getDoctorById,
} from "./doctor.repository.js";

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
      message: "User retrieved successfully",
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
