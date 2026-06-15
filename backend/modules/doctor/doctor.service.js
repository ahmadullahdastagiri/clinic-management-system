import mongoose from "mongoose";
import * as docotrRepository from "./doctor.repository.js";
import AppError from "../../utils/AppError.js";

/**
 * Create a new doctor profile
 * @param {Object} doctorData - The data for the new doctor profile
 * @returns  The created doctor profile
 */
export const createDoctor = async (doctorData) => {
  if (!mongoose.Types.ObjectId.isValid(doctorData.userId))
    throw new AppError("Invalid user id", 400, true, "INVALID_USER_ID");

  const doctor = await docotrRepository.createDoctor(doctorData);
  if (!doctor)
    throw new AppError(
      "Failed to create doctor",
      500,
      true,
      "FAILED_TO_CREATE_DOCTOR",
    );

  return doctor;
};

/**
 * Retrieves a doctor by id
 * @param {Object} doctorId - The id of doctor to be retrieved.
 * @returns The retrieved data of doctor
 */
export const getDoctorById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(doctorData.userId))
    throw new AppError("Invalid user id", 400, true, "INVALID_USER_ID");

  const doctor = await docotrRepository.getDoctorById(id);
  if (!doctor)
    throw new AppError(
      "Failed to retrieve doctor",
      500,
      true,
      "FAILED_TO_RETRIEVE_DOCTOR",
    );

  return doctor;
};

/**
 * Retrieves all doctors
 * @param {Object} Options - Paginations info.
 * @returns The doctors with pagination info.
 */
export const getAllDoctors = async ({ page, limit }) => {
  const doctor = await docotrRepository.getAllDoctors({ page, limit });

  if (!doctor)
    throw new AppError("No doctor found", 404, true, "NO_DOCTOR_FOUND");

  return doctor;
};
