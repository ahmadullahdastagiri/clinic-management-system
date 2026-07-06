import mongoose from "mongoose";

import generateUniqueId from "../../utils/generateUniqueId.js";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const patientSchema = new mongoose.Schema(
  {
    patientCode: {
      type: String,
      unique: true,
      trim: true,
      index: true,
    },
    firstName: {
      type: String,
      required: [true, "Patient first name is required"],
      trim: true,
      index: true,
    },
    lastName: {
      type: String,
      trim: true,
      index: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
      lowercase: true,
    },
    age: {
      type: Number,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      trim: true,
    },
    bloodGroup: {
      type: String,
      enum: BLOOD_GROUPS,
      trim: true,
    },
    emergencyContactName: {
      type: String,
      trim: true,
    },
    emergencyContactPhone: {
      type: String,
      trim: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    receptionistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

patientSchema.index({ firstName: 1, lastName: 1 });

patientSchema.pre("save", async function () {
  if (!this.isNew || this.patientCode) {
    return;
  }

  this.patientCode = await generateUniqueId("PT", "patient");
});

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
