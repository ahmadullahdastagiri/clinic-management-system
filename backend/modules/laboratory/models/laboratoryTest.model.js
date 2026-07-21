import mongoose from "mongoose";

import generateUniqueId from "../../../utils/generateUniqueId.js";

const LAB_TEST_CATEGORIES = [
  "hematology",
  "biochemistry",
  "microbiology",
  "serology",
  "urinalysis",
  "parasitology",
  "immunology",
  "pathology",
  "other",
];

const laboratoryTestSchema = new mongoose.Schema(
  {
    labTestCode: {
      type: String,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    category: {
      type: String,
      enum: LAB_TEST_CATEGORIES,
      default: "other",
      lowercase: true,
      trim: true,
      index: true,
    },
    specimenType: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    unit: {
      type: String,
      trim: true,
    },
    normalRange: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    turnaroundTimeHours: {
      type: Number,
      min: 0,
      default: 24,
    },
    active: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

laboratoryTestSchema.index({ category: 1, active: 1 });

laboratoryTestSchema.pre("save", async function () {
  if (!this.isNew || this.labTestCode) {
    return;
  }

  this.labTestCode = await generateUniqueId("LT", "laboratory-test");
});

const LaboratoryTest = mongoose.model("LaboratoryTest", laboratoryTestSchema);

export default LaboratoryTest;
