import mongoose from "mongoose";

import generateUniqueId from "../../../utils/generateUniqueId.js";

const LAB_RESULT_STATUSES = ["pending", "final", "amended", "rejected"];

const laboratoryFindingSchema = new mongoose.Schema(
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
    value: {
      type: String,
      required: true,
    },
    numericValue: {
      type: Number,
    },
    unit: {
      type: String,
    },
    referenceRange: {
      type: String,
    },
    flag: {
      type: String,
      enum: ["low", "normal", "high", "critical"],
      lowercase: true,
    },
    remarks: {
      type: String,
    },
  },
  { _id: false },
);

const laboratoryResultSchema = new mongoose.Schema(
  {
    resultCode: {
      type: String,
      unique: true,
      index: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LaboratoryOrder",
      required: true,
      index: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    status: {
      type: String,
      enum: LAB_RESULT_STATUSES,
      default: "pending",
      lowercase: true,
      index: true,
    },
    sampleCollectedAt: {
      type: Date,
    },
    reportedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    findings: {
      type: [laboratoryFindingSchema],
      validate: {
        validator: (findings) => Array.isArray(findings) && findings.length > 0,
        message: "At least one lab finding is required",
      },
      default: [],
    },
    summary: {
      type: String,
    },
    attachmentUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

laboratoryResultSchema.index({ patientId: 1, reportedAt: -1 });
laboratoryResultSchema.index({ orderId: 1, status: 1 });

laboratoryResultSchema.pre("save", async function () {
  if (!this.isNew || this.resultCode) {
    return;
  }

  this.resultCode = await generateUniqueId("LR", "laboratory-result");
});

const LaboratoryResult = mongoose.model(
  "LaboratoryResult",
  laboratoryResultSchema,
);

export default LaboratoryResult;
