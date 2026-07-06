import mongoose from "mongoose";

const counterSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      trim: true,
    },
    seq: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const Counter =
  mongoose.models.Counter || mongoose.model("Counter", counterSchema);

/**
 * Generates a sequential unique ID.
 *
 * Example:
 * generateUniqueId("PT", "patient")
 * -> PT-00001
 */
export const generateUniqueId = async (prefix, counterKey, digits = 5) => {
  if (!prefix) {
    throw new Error("Prefix is required.");
  }

  if (!counterKey) {
    throw new Error("Counter key is required.");
  }

  if (!Number.isInteger(digits) || digits < 1) {
    throw new Error("Digits must be a positive integer.");
  }

  const { seq } = await Counter.findOneAndUpdate(
    { _id: counterKey.trim().toLowerCase() },
    { $inc: { seq: 1 } },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      lean: true,
    },
  );

  return `${prefix.trim().toUpperCase()}-${String(seq).padStart(digits, "0")}`;
};

export default generateUniqueId;
