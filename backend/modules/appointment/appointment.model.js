import mongoose from "mongoose";

import generateUniqueId from "../../utils/generateUniqueId.js";

const APPOINTMENT_STATUSES = ["pending", "confirmed", "completed", "cancelled"];

const appointmentSchema = new mongoose.Schema(
  {
    appointmentCode: {
      type: String,
      unique: true,
      trim: true,
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
      required: true,
      index: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
      index: true,
    },
    appointmentTime: {
      type: String,
      trim: true,
      required: true,
    },
    reason: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: APPOINTMENT_STATUSES,
      default: "pending",
      lowercase: true,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
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

appointmentSchema.index({
  doctorId: 1,
  appointmentDate: 1,
  appointmentTime: 1,
});
appointmentSchema.index({ patientId: 1, appointmentDate: -1 });

appointmentSchema.pre("save", async function () {
  if (!this.isNew || this.appointmentCode) {
    return;
  }

  this.appointmentCode = await generateUniqueId("AP", "appointment");
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
