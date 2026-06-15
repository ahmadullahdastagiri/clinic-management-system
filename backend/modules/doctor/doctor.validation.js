import { z } from "zod";

export const createDoctorSchema = z.object({
  userId: z.string().min(1, "User is required"),
  specialization: z.string().min(1, "Specialization is required"),
  experience: z.number().min(0, "Experience must be a non-negative number"),
  qualification: z.string().optional(),
  workingHours: z.object({
    start: z.string().min(1, "Start time is required"),
    end: z.string().min(1, "End time is required"),
    days: z
      .array(
        z.enum([
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ]),
      )
      .min(1, "At least one working day is required"),
  }),
  contactNumber: z.string().min(1, "Contact number is required"),
});

export const updateDoctorSchema = z.object({
  userId: z.string().min(1, "User is required").optional(),
  specialization: z.string().min(1, "Specialization is required").optional(),
  experience: z
    .number()
    .min(0, "Experience must be a non-negative number")
    .optional(),
  qualification: z.string().optional(),
  workingHours: z.object({
    start: z.string().min(1, "Start time is required").optional(),
    end: z.string().min(1, "End time is required").optional(),
    days: z
      .array(
        z.enum([
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ]),
      )
      .min(1, "At least one working day is required")
      .optional(),
  }),
  contactNumber: z.string().min(1, "Contact number is required").optional(),
});
