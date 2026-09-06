import mongoose from "mongoose";

import generateUniqueId from "../../../utils/generateUniqueId.js";
import { CURRENCY_CODES } from "../../../constants/currencies.js";

const PAYMENT_METHODS = [
  "cash",
  "card",
  "bank-transfer",
  "mobile-money",
  "other",
];
const PAYMENT_STATUSES = ["pending", "completed", "failed", "refunded", "void"];

const paymentSchema = new mongoose.Schema(
  {
    paymentCode: {
      type: String,
      unique: true,
      index: true,
    },
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
      index: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    currency: {
      type: String,
      enum: CURRENCY_CODES,
      default: "AFN",
    },
    method: {
      type: String,
      enum: PAYMENT_METHODS,
      required: true,
    },
    status: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: "completed",
      index: true,
    },
    transactionReference: {
      type: String,
      trim: true,
      maxlength: 150,
    },
    paidAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    notes: {
      type: String,
    },
    receivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

paymentSchema.index({ invoiceId: 1, paidAt: -1 });

paymentSchema.pre("save", async function () {
  if (!this.isNew || this.paymentCode) {
    return;
  }

  this.paymentCode = await generateUniqueId("PAY", "payment");
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
