import mongoose from "mongoose";

import generateUniqueId from "../../../utils/generateUniqueId.js";
import { CURRENCY_CODES } from "../../../constants/currencies.js";

const INVOICE_STATUSES = ["draft", "issued", "partially-paid", "paid", "void"];

const INVOICE_ITEM_TYPES = ["service", "product", "lab", "consultation"];

const invoiceItemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: INVOICE_ITEM_TYPES,
      required: true,
    },
    description: {
      type: String,
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
    },
  },
  {
    _id: false,
  },
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
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
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      index: true,
    },
    laboratoryOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LaboratoryOrder",
      index: true,
    },
    items: {
      type: [invoiceItemSchema],
      validate: {
        validator: (items) => Array.isArray(items) && items.length > 0,
        message: "Invoice must have at least one item.",
      },
      default: [],
    },
    currency: {
      type: String,
      enum: CURRENCY_CODES,
      default: "AFN",
    },
    subtotal: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    tax: {
      type: Number,
    },
    totalAmount: {
      type: Number,
    },
    paidAmount: {
      type: Number,
    },
    dueAmount: {
      type: Number,
    },
    status: {
      type: String,
      enum: INVOICE_STATUSES,
      default: "draft",
      index: true,
    },
    issuedAt: {
      type: Date,
    },
    dueDate: {
      type: Date,
    },
    notes: {
      type: String,
    },
    createdBy: {
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

invoiceSchema.index({ patientId: 1, createdAt: -1 });
invoiceSchema.index({ status: 1, createdAt: -1 });

invoiceSchema.pre("save", async function () {
  if (!this.isNew || this.invoiceNumber) {
    return;
  }

  this.invoiceNumber = await generateUniqueId("INV", "invoice");
});

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;
