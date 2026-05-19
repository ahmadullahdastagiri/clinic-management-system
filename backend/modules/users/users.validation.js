import { z } from "zod";

export const createUserSchema = z.object({
  firstName: z.string().min(1, "First name is required").trim(),
  lastName: z.string().min(1, "Last name is required").trim(),
  email: z.string().email("Invalid email address").trim(),
  phone: z.string().min(6, "Phone number is required").trim(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  role: z.enum(["admin", "doctor", "receptionist", "laboratorian"]),
});
