import mongoose from "mongoose";
import * as doctorRepository from "./doctor.repository.js";
import AppError from "../../utils/AppError.js";

/**
 * Create a new doctor profile
 * @param {Object} doctorData - The data for the new doctor profile
 * @returns  The created doctor profile
 */
export const createDoctor = async (doctorData) => {
  if (!mongoose.Types.ObjectId.isValid(doctorData.userId))
    throw new AppError("Invalid user id", 400, true, "INVALID_USER_ID");

  const doctor = await doctorRepository.createDoctor(doctorData);
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
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new AppError("Invalid user id", 400, true, "INVALID_USER_ID");

  const doctor = await doctorRepository.getDoctorById(id);
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
  const doctor = await doctorRepository.getAllDoctors({ page, limit });

  if (!doctor)
    throw new AppError("No doctor found", 404, true, "NO_DOCTOR_FOUND");

  return doctor;
};

/**
 * Search doctor by name and last name
 * @param {object} searchData - The data to search doctor
 * @returns The searched doctors
 */
export const findDoctorByName = async (
  searchData,
  { page = 1, limit = 10 } = {},
) => {
  const searchDoctor = await doctorRepository.findDoctor(searchData, {
    page,
    limit,
  });

  if (!searchDoctor.doctors.length)
    throw new AppError("No doctor found", 404, true, "NO_USER_FOUND");

  return searchDoctor;
};

/**
 * Updates doctor by id
 * @param {Object} userId - The id of doctor to be updated
 * @param {Object} updateData - The data to update the doctor with
 * @returns The updated doctor object
 */
export const updateDoctorById = async (id, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new AppError("Invalid user id", 400, true, "INVALID_USER_ID");

  const doctor = await doctorRepository.getDoctorById(id);
  if (!doctor)
    throw new AppError("User not found", 404, true, "USER_NOT_FOUND");

  const updateDoctor = await doctorRepository.updateDoctorById(id, updateData);
  if (!updateDoctor)
    throw new AppError(
      "Failed to update doctor",
      500,
      true,
      "FAILED_TO_UPDATE_DOCTOR",
    );

  return updateDoctor;
};

/**
 * Activates doctor by id
 * @param {Object} userId - the id of the doctor to be activated
 * @returns The activate doctor object
 */
export const activateDoctorById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new AppError("Invalid user id", 400, true, "INVALID_USER_ID");

  const activateDoctor = await doctorRepository.activateDoctorById(id);
  if (!activateDoctor)
    throw new AppError(
      "Failed to activate user",
      500,
      true,
      "FAILED_TO_ACTIVATE_USER",
    );

  return activateDoctor;
};

/**
 * Deactivates doctor by id
 * @param {Object} userId - the id of the doctor to be deactivated
 * @returns The deactivate doctor object
 */
export const deactivateDoctorById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new AppError("Invalid user id", 400, true, "INVALID_USER_ID");

  const deactivateDoctor = await doctorRepository.deactivateDoctorById(id);
  if (!deactivateDoctor)
    throw new AppError(
      "Failed to deactivate user",
      400,
      false,
      "FAILED_TO_DEACTIVATE_USER",
    );

  return deactivateDoctor;
};

/**
 * Deletes doctor by id
 * @param {Object} userId - The id of the doctor to be deleted
 * @returns The deleted doctor
 */
export const deleteDoctorById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new AppError("Invalid user id", 400, true, "INVALID_USER_ID");

  const doctor = await doctorRepository.getDoctorById(id);
  if (!doctor)
    throw new AppError("No doctor found", 404, true, "DOCTOR_NOT_FOUND");

  const deleteDoctor = await doctorRepository.deleteDoctor(id);
  if (!deleteDoctor)
    throw new AppError(
      "Failed to delete doctor",
      400,
      false,
      "FAILED_TO_DELETE_DOCTOR",
    );

  return deleteDoctor;
};
