import { z } from "zod";

const appointmentStatusSchema = z.enum([
  "pending",
  "confirmed",
  "completed",
  "cancelled",
]);

export const createAppointmentSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  appointmentDate: z.coerce.date({
    required_error: "Appointment date is required",
    invalid_type_error: "Invalid appointment date",
  }),
  appointmentTime: z.string().min(1, "Appointment time is required").trim(),
  reason: z.string().trim().optional(),
  status: appointmentStatusSchema.optional(),
  notes: z.string().trim().max(2000, "Notes cannot exceed 2000 characters").optional(),
  createdBy: z.string().min(1, "Created by user is required"),
});

export const updateAppointmentSchema = z.object({
  patientId: z.string().min(1, "Patient is required").optional(),
  doctorId: z.string().min(1, "Doctor is required").optional(),
  appointmentDate: z.coerce
    .date({
      invalid_type_error: "Invalid appointment date",
    })
    .optional(),
  appointmentTime: z.string().min(1, "Appointment time is required").trim().optional(),
  reason: z.string().trim().optional(),
  status: appointmentStatusSchema.optional(),
  notes: z.string().trim().max(2000, "Notes cannot exceed 2000 characters").optional(),
});

export const updateAppointmentStatusSchema = z.object({
  status: appointmentStatusSchema,
});
