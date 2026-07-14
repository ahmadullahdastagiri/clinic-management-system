import mongoose from "mongoose";

import generateUniqueId from "../../../utils/generateUniqueId.js";

const LAB_ORDER_STATUSES = [
  "requested",
  "sample-collected",
  "in-progress",
  "completed",
  "cancelled",
];

const LAB_ORDER_PRIORITIES = ["routine", "urgent", "stat"];

const laboratoryOrderTestSchema = new mongoose.Schema(
  {
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LaboratoryTest",
      required: true,
    },
    testName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
  },
  { _id: false },
);

const laboratoryOrderSchema = new mongoose.Schema(
  {
    orderCode: {
      type: String,
      unique: true,
      index: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      index: true,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      index: true,
    },
    orderedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: LAB_ORDER_STATUSES,
      default: "requested",
      lowercase: true,
      index: true,
    },
    priority: {
      type: String,
      enum: LAB_ORDER_PRIORITIES,
      default: "routine",
      lowercase: true,
    },
    tests: {
      type: [laboratoryOrderTestSchema],
      validate: {
        validator: (tests) => Array.isArray(tests) && tests.length > 0,
        message: "At least one laboratory test is required",
      },
      default: [],
    },
    notes: {
      type: String,
      trim: true,
    },
    orderedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

laboratoryOrderSchema.index({ patientId: 1, orderedAt: -1 });
laboratoryOrderSchema.index({ status: 1, priority: 1 });

laboratoryOrderSchema.pre("save", async function () {
  if (!this.isNew || this.orderCode) {
    return;
  }

  this.orderCode = await generateUniqueId("LO", "laboratory-order");
});

const LaboratoryOrder = mongoose.model(
  "LaboratoryOrder",
  laboratoryOrderSchema,
);

export default LaboratoryOrder;
