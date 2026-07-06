import {
  createAppointment,
  deleteAppointmentById,
  findDoctorAppointmentSlot,
  getAllAppointments,
  getAppointmentById,
  getAppointmentsByDoctor,
  getAppointmentsByPatient,
  updateAppointmentById,
  updateAppointmentStatus,
} from "./appointment.service.js";

const getPaginationOptions = ({ page, limit }) => ({
  page: parseInt(page) || 1,
  limit: parseInt(limit) || 10,
});

/**
 * POST /appointments
 * Create a new appointment.
 */
export const createAppointmentController = async (req, res, next) => {
  try {
    const appointment = await createAppointment(req.body);

    return res.status(201).json({
      message: "Appointment created successfully",
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /appointments/:id
 * Get appointment by ID.
 */
export const getAppointmentByIdController = async (req, res, next) => {
  try {
    const appointment = await getAppointmentById(req.params.id);

    return res.status(200).json({
      message: "Appointment retrieved successfully",
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /appointments
 * Get all appointments with optional search and pagination.
 */
export const getAllAppointmentsController = async (req, res, next) => {
  try {
    const { search, page, limit } = req.query;
    const appointments = await getAllAppointments({
      search,
      ...getPaginationOptions({ page, limit }),
    });

    return res.status(200).json(appointments);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /appointments/doctor/:doctorId
 * Get appointments for a specific doctor.
 */
export const getAppointmentsByDoctorController = async (req, res, next) => {
  try {
    const appointments = await getAppointmentsByDoctor(req.params.doctorId);

    return res.status(200).json({
      message: "Doctor appointments retrieved successfully",
      appointments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /appointments/patient/:patientId
 * Get appointments for a specific patient.
 */
export const getAppointmentsByPatientController = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const appointments = await getAppointmentsByPatient(
      req.params.patientId,
      getPaginationOptions({ page, limit }),
    );

    return res.status(200).json({
      message: "Patient appointments retrieved successfully",
      appointments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /appointments/slot/check
 * Check whether a doctor's appointment slot is available.
 */
export const findDoctorAppointmentSlotController = async (req, res, next) => {
  try {
    const { doctorId, appointmentDate, appointmentTime } = req.query;
    const existingAppointment = await findDoctorAppointmentSlot({
      doctorId,
      appointmentDate,
      appointmentTime,
    });

    return res.status(200).json({
      message: existingAppointment
        ? "Appointment slot is already booked"
        : "Appointment slot is available",
      available: !existingAppointment,
      appointment: existingAppointment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /appointments/:id
 * Update appointment by ID.
 */
export const updateAppointmentByIdController = async (req, res, next) => {
  try {
    const appointment = await updateAppointmentById(req.params.id, req.body);

    return res.status(200).json({
      message: "Appointment updated successfully",
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /appointments/:id/status
 * Update appointment status by ID.
 */
export const updateAppointmentStatusController = async (req, res, next) => {
  try {
    const appointment = await updateAppointmentStatus(
      req.params.id,
      req.body.status,
    );

    return res.status(200).json({
      message: "Appointment status updated successfully",
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /appointments/:id
 * Delete appointment by ID.
 */
export const deleteAppointmentController = async (req, res, next) => {
  try {
    const appointment = await deleteAppointmentById(req.params.id);

    return res.status(200).json({
      message: "Appointment deleted successfully",
      appointment,
    });
  } catch (error) {
    next(error);
  }
};
