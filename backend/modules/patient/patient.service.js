import AppError from "../../utils/AppError.js";
import { validateObjectId } from "../../utils/validateObjectId.js";
import * as patientRepository from "./patient.repository.js";

/**
 * Create a new patient.
 * @param {Object} patientData - The patient data to create.
 * @returns The created patient.
 */
export const createPatient = async (patientData) => {
  const patient = await patientRepository.createPatient(patientData);

  if (!patient) {
    throw new AppError(
      "Failed to create patient",
      500,
      true,
      "FAILED_TO_CREATE_PATIENT",
    );
  }

  return patient;
};

/**
 * Retrieve a patient by id.
 * @param {String} id - The patient id.
 * @returns The selected patient.
 */
export const getPatientById = async (id) => {
  validateObjectId(id, "patient");

  const patient = await patientRepository.getPatientById(id);
  if (!patient) {
    throw new AppError("No patient found", 404, true, "PATIENT_NOT_FOUND");
  }

  return patient;
};

/**
 * Retrieve all patients with pagination.
 * @param {Object} options - Pagination options.
 * @returns Patients with pagination info.
 */
export const getAllPatients = async ({ page = 1, limit = 10 } = {}) => {
  const patients = await patientRepository.allPatients({ page, limit });

  if (!patients) {
    throw new AppError("No patients found", 404, true, "PATIENTS_NOT_FOUND");
  }

  return patients;
};

/**
 * Search patients by first name, last name, or phone.
 * @param {String} key - Search keyword.
 * @param {Object} options - Pagination options.
 * @returns Matching patients with pagination info.
 */
export const searchPatients = async (key, { page = 1, limit = 10 } = {}) => {
  if (!key || !key.trim()) {
    throw new AppError("Search keyword is required", 400, true, "SEARCH_REQUIRED");
  }

  const result = await patientRepository.searchPatient(key.trim(), {
    page,
    limit,
  });

  if (!result.patients.length) {
    throw new AppError("No patient found", 404, true, "PATIENT_NOT_FOUND");
  }

  return result;
};

/**
 * Update patient by id.
 * @param {String} id - The patient id.
 * @param {Object} updateData - The patient fields to update.
 * @returns The updated patient.
 */
export const updatePatientById = async (id, updateData) => {
  validateObjectId(id, "patient");

  const patient = await patientRepository.getPatientById(id);
  if (!patient) {
    throw new AppError("No patient found", 404, true, "PATIENT_NOT_FOUND");
  }

  const updatedPatient = await patientRepository.updatePatientById(
    id,
    updateData,
  );
  if (!updatedPatient) {
    throw new AppError(
      "Failed to update patient",
      500,
      true,
      "FAILED_TO_UPDATE_PATIENT",
    );
  }

  return updatedPatient;
};

/**
 * Activate patient by id.
 * @param {String} id - The patient id.
 * @returns The activated patient.
 */
export const activatePatientById = async (id) => {
  validateObjectId(id, "patient");

  const patient = await patientRepository.activatePatientById(id);
  if (!patient) {
    throw new AppError("No patient found", 404, true, "PATIENT_NOT_FOUND");
  }

  return patient;
};

/**
 * Deactivate patient by id.
 * @param {String} id - The patient id.
 * @returns The deactivated patient.
 */
export const deactivatePatientById = async (id) => {
  validateObjectId(id, "patient");

  const patient = await patientRepository.deactivatePatientById(id);
  if (!patient) {
    throw new AppError("No patient found", 404, true, "PATIENT_NOT_FOUND");
  }

  return patient;
};

/**
 * Delete patient by id.
 * @param {String} id - The patient id.
 * @returns The deleted patient.
 */
export const deletePatientById = async (id) => {
  validateObjectId(id, "patient");

  const patient = await patientRepository.getPatientById(id);
  if (!patient) {
    throw new AppError("No patient found", 404, true, "PATIENT_NOT_FOUND");
  }

  const deletedPatient = await patientRepository.deletePatient(id);
  if (!deletedPatient) {
    throw new AppError(
      "Failed to delete patient",
      500,
      true,
      "FAILED_TO_DELETE_PATIENT",
    );
  }

  return deletedPatient;
};
