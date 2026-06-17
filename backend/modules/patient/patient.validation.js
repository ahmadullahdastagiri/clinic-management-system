import { z } from "zod";

const bloodGroupSchema = z.enum([
  "A+",
  "A-",
  "B+",
  "B-",
  "O+",
  "O-",
  "AB+",
  "AB-",
]);

export const createPatientSchema = z.object({
  firstName: z.string().min(1, "First name is required").trim(),
  lastName: z.string().trim().optional(),
  gender: z.enum(["male", "female"]),
  age: z
    .number()
    .int("Age must be a whole number")
    .min(0, "Age must be a non-negative number"),
  phone: z.string().min(1, "Phone is required").trim(),
  address: z.string().trim().optional(),
  bloodGroup: bloodGroupSchema.optional(),
  emergencyContactName: z.string().trim().optional(),
  emergencyContactPhone: z.string().trim().optional(),
  receptionistId: z.string().min(1, "Receptionist is required").optional(),
});

export const updatePatientSchema = z.object({
  firstName: z.string().min(1, "First name is required").trim().optional(),
  lastName: z.string().trim().optional(),
  gender: z.enum(["male", "female"]).optional(),
  age: z
    .number()
    .int("Age must be a whole number")
    .min(0, "Age must be a non-negative number")
    .optional(),
  phone: z.string().min(1, "Phone is required").trim().optional(),
  address: z.string().trim().optional(),
  bloodGroup: bloodGroupSchema.optional(),
  emergencyContactName: z.string().trim().optional(),
  emergencyContactPhone: z.string().trim().optional(),
  receptionistId: z.string().min(1, "Receptionist is required").optional(),
});
