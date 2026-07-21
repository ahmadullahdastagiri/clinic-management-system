import { z } from "zod";

const labOrderStatusSchema = z.enum([
  "requested",
  "sample-collected",
  "in-progress",
  "completed",
  "cancelled",
]);

const labOrderPrioritySchema = z.enum(["routine", "urgent", "stat"]);

const labResultStatusSchema = z.enum(["pending", "final", "amended", "rejected"]);

const labOrderTestSchema = z.object({
  testId: z.string().min(1, "Test is required"),
  testName: z.string().min(1, "Test name is required").trim(),
  price: z.number().min(0, "Price must be a non-negative number").optional(),
  status: z.enum(["pending", "completed", "cancelled"]).optional(),
});

const labFindingSchema = z.object({
  testId: z.string().min(1, "Test is required"),
  testName: z.string().min(1, "Test name is required").trim(),
  value: z.string().min(1, "Value is required").trim(),
  numericValue: z.number().optional(),
  unit: z.string().trim().optional(),
  referenceRange: z.string().trim().optional(),
  flag: z.enum(["low", "normal", "high", "critical"]).optional(),
  remarks: z.string().trim().optional(),
});

export const createLaboratoryTestSchema = z.object({
  name: z.string().min(1, "Test name is required").trim(),
  category: z
    .enum([
      "hematology",
      "biochemistry",
      "microbiology",
      "serology",
      "urinalysis",
      "parasitology",
      "immunology",
      "pathology",
      "other",
    ])
    .optional(),
  specimenType: z.string().min(1, "Specimen type is required").trim(),
  description: z.string().trim().max(2000, "Description cannot exceed 2000 characters").optional(),
  unit: z.string().trim().optional(),
  normalRange: z.string().trim().optional(),
  price: z.number().min(0, "Price must be a non-negative number"),
  turnaroundTimeHours: z
    .number()
    .min(0, "Turnaround time must be a non-negative number")
    .optional(),
  active: z.boolean().optional(),
  createdBy: z.string().min(1, "Created by user is required").optional(),
});

export const updateLaboratoryTestSchema = z.object({
  name: z.string().min(1, "Test name is required").trim().optional(),
  category: z
    .enum([
      "hematology",
      "biochemistry",
      "microbiology",
      "serology",
      "urinalysis",
      "parasitology",
      "immunology",
      "pathology",
      "other",
    ])
    .optional(),
  specimenType: z.string().min(1, "Specimen type is required").trim().optional(),
  description: z.string().trim().max(2000, "Description cannot exceed 2000 characters").optional(),
  unit: z.string().trim().optional(),
  normalRange: z.string().trim().optional(),
  price: z.number().min(0, "Price must be a non-negative number").optional(),
  turnaroundTimeHours: z
    .number()
    .min(0, "Turnaround time must be a non-negative number")
    .optional(),
  active: z.boolean().optional(),
  createdBy: z.string().min(1, "Created by user is required").optional(),
});

export const createLaboratoryOrderSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor is required").optional(),
  appointmentId: z.string().min(1, "Appointment is required").optional(),
  orderedBy: z.string().min(1, "Ordered by user is required"),
  status: labOrderStatusSchema.optional(),
  priority: labOrderPrioritySchema.optional(),
  tests: z.array(labOrderTestSchema).min(1, "At least one laboratory test is required"),
  notes: z.string().trim().optional(),
  orderedAt: z.coerce.date().optional(),
  totalAmount: z.number().min(0, "Total amount must be a non-negative number").optional(),
  createdBy: z.string().min(1, "Created by user is required"),
});

export const updateLaboratoryOrderSchema = z.object({
  patientId: z.string().min(1, "Patient is required").optional(),
  doctorId: z.string().min(1, "Doctor is required").optional(),
  appointmentId: z.string().min(1, "Appointment is required").optional(),
  orderedBy: z.string().min(1, "Ordered by user is required").optional(),
  status: labOrderStatusSchema.optional(),
  priority: labOrderPrioritySchema.optional(),
  tests: z.array(labOrderTestSchema).min(1, "At least one laboratory test is required").optional(),
  notes: z.string().trim().optional(),
  orderedAt: z.coerce.date().optional(),
  totalAmount: z.number().min(0, "Total amount must be a non-negative number").optional(),
  createdBy: z.string().min(1, "Created by user is required").optional(),
});

export const createLaboratoryResultSchema = z.object({
  orderId: z.string().min(1, "Order is required"),
  patientId: z.string().min(1, "Patient is required"),
  reportedBy: z.string().min(1, "Reported by user is required"),
  reviewedBy: z.string().min(1, "Reviewed by user is required").optional(),
  status: labResultStatusSchema.optional(),
  sampleCollectedAt: z.coerce.date().optional(),
  reportedAt: z.coerce.date().optional(),
  findings: z.array(labFindingSchema).min(1, "At least one lab finding is required"),
  summary: z.string().trim().optional(),
  attachmentUrl: z.string().trim().url("Attachment URL must be valid").optional(),
});

export const updateLaboratoryResultSchema = z.object({
  orderId: z.string().min(1, "Order is required").optional(),
  patientId: z.string().min(1, "Patient is required").optional(),
  reportedBy: z.string().min(1, "Reported by user is required").optional(),
  reviewedBy: z.string().min(1, "Reviewed by user is required").optional(),
  status: labResultStatusSchema.optional(),
  sampleCollectedAt: z.coerce.date().optional(),
  reportedAt: z.coerce.date().optional(),
  findings: z.array(labFindingSchema).min(1, "At least one lab finding is required").optional(),
  summary: z.string().trim().optional(),
  attachmentUrl: z.string().trim().url("Attachment URL must be valid").optional(),
});
