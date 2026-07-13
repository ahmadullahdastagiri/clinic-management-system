import * as appointmentRepository from "./appointment.repository.js";
import AppError from "../../utils/AppError.js";
import { validateObjectId } from "../../utils/validateObjectId.js";

/**
 * Create a new appointment.
 * @param {Object} appointmentData - The data for the new appointment.
 * @returns {Promise<Object>} - The created appointment.
 */
export const createAppointment = async (appointmentData) => {
  const appointment =
    await appointmentRepository.createAppointment(appointmentData);

  if (!appointment) {
    throw new AppError(
      "Failed to create appointment",
      500,
      true,
      "APPOINTMENT_CREATION_FAILED",
    );
  }

  return appointment;
};

/**
 * Get an appointment by id.
 * @param {String} id - The appointment id.
 * @returns {Promise<Object>} - The retrieved appointment.
 */
export const getAppointmentById = async (id) => {
  validateObjectId(id, "appointment");

  const appointment = await appointmentRepository.getAppointmentById(id);
  if (!appointment) {
    throw new AppError(
      "No appointment found",
      404,
      true,
      "APPOINTMENT_NOT_FOUND",
    );
  }

  return appointment;
};

/**
 * Get all appointments with optional search and pagination.
 * @param {Object} options - Pagination and search options.
 * @returns {Promise<Object>} - Appointments and pagination info.
 */
export const getAllAppointments = async ({
  page = 1,
  limit = 10,
  search,
} = {}) => {
  const appointments = await appointmentRepository.getAllAppointments({
    page,
    limit,
    search,
  });

  if (!appointments)
    throw new AppError(
      "No appointments found",
      404,
      true,
      "NO_APPOINTMENTS_FOUND",
    );

  return appointments;
};

/**
 * Get appointments for a specific doctor.
 * @param {String} doctorId - The doctor id.
 * @returns {Promise<Array>} - The doctor's appointments.
 */
export const getAppointmentsByDoctor = async (doctorId) => {
  validateObjectId(doctorId, "doctor");

  const appointments =
    await appointmentRepository.getAppointmentsByDoctor(doctorId);

  if (!appointments)
    throw new AppError(
      "No appointments found",
      404,
      true,
      "NO_APPOINTMENTS_FOUND",
    );

  return appointments;
};

/**
 * Get appointments for a specific patient.
 * @param {String} patientId - The patient id.
 * @param {Object} options - Pagination options.
 * @returns {Promise<Array>} - The patient's appointments.
 */
export const getAppointmentsByPatient = async (
  patientId,
  { page = 1, limit = 10 } = {},
) => {
  validateObjectId(patientId, "patient");

  const appointments = await appointmentRepository.getAppointmentsByPatient(
    patientId,
    { page, limit },
  );

  return appointments;
};

/**
 * Find an available appointment slot for a doctor.
 * @param {Object} searchData - Slot query data.
 * @param {String} searchData.doctorId - The doctor id.
 * @param {Date} searchData.appointmentDate - The appointment date.
 * @param {String} searchData.appointmentTime - The appointment time.
 * @returns {Promise<Object|null>} - Matching appointment or null.
 */
export const findDoctorAppointmentSlot = async ({
  doctorId,
  appointmentDate,
  appointmentTime,
}) => {
  validateObjectId(doctorId, "doctor");

  const appointment = await appointmentRepository.findDoctorAppointmentSlot({
    doctorId,
    appointmentDate,
    appointmentTime,
  });

  if (!appointments)
    throw new AppError(
      "No appointments found",
      404,
      true,
      "NO_APPOINTMENTS_FOUND",
    );

  return appointment;
};

/**
 * Update an appointment by id.
 * @param {String} id - The appointment id.
 * @param {Object} updateData - The update payload.
 * @returns {Promise<Object>} - The updated appointment.
 */
export const updateAppointmentById = async (id, updateData) => {
  validateObjectId(id, "appointment");

  const appointment = await appointmentRepository.getAppointmentById(id);
  if (!appointment) {
    throw new AppError(
      "No appointment found",
      404,
      true,
      "APPOINTMENT_NOT_FOUND",
    );
  }

  const updatedAppointment = await appointmentRepository.updateAppointmentById(
    id,
    updateData,
  );

  if (!updatedAppointment) {
    throw new AppError(
      "Failed to update appointment",
      500,
      true,
      "APPOINTMENT_UPDATE_FAILED",
    );
  }

  return updatedAppointment;
};

/**
 * Update only the status of an appointment.
 * @param {String} id - The appointment id.
 * @param {String} status - New appointment status.
 * @returns {Promise<Object>} - The updated appointment.
 */
export const updateAppointmentStatus = async (id, status) => {
  validateObjectId(id, "appointment");

  const appointment = await appointmentRepository.getAppointmentById(id);
  if (!appointment) {
    throw new AppError(
      "No appointment found",
      404,
      true,
      "APPOINTMENT_NOT_FOUND",
    );
  }

  const updatedAppointment =
    await appointmentRepository.updateAppointmentStatus(id, status);

  if (!updatedAppointment) {
    throw new AppError(
      "Failed to update appointment status",
      500,
      true,
      "APPOINTMENT_STATUS_UPDATE_FAILED",
    );
  }

  return updatedAppointment;
};

/**
 * Delete an appointment by id.
 * @param {String} id - The appointment id.
 * @returns {Promise<Object>} - The deleted appointment.
 */
export const deleteAppointmentById = async (id) => {
  validateObjectId(id, "appointment");

  const appointment = await appointmentRepository.getAppointmentById(id);
  if (!appointment) {
    throw new AppError(
      "No appointment found",
      404,
      true,
      "APPOINTMENT_NOT_FOUND",
    );
  }

  const deletedAppointment =
    await appointmentRepository.deleteAppointmentById(id);
  if (!deletedAppointment) {
    throw new AppError(
      "Failed to delete appointment",
      500,
      true,
      "APPOINTMENT_DELETION_FAILED",
    );
  }

  return deletedAppointment;
};
