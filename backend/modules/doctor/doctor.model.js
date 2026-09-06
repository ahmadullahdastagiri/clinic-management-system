import mongoose from "mongoose";

import generateUniqueId from "../../utils/generateUniqueId.js";

const doctorSchema = new mongoose.Schema({
  doctorCode: {
    type: String,
    unique: true,
    trim: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    role: "doctor",
    index: true,
    required: true,
  },

  specialization: {
    type: String,
    required: true,
    trim: true,
  },
  experience: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  qualification: {
    type: String,
    trim: true,
  },
  workingHours: {
    start: {
      type: String,
      required: true,
    },
    end: {
      type: String,
      required: true,
    },
    days: {
      type: [String],
      required: true,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

doctorSchema.pre("save", async function () {
  if (!this.isNew || this.doctorCode) {
    return;
  }

  this.doctorCode = await generateUniqueId("DR", "doctor");
});

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
