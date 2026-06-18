import mongoose from "mongoose";
import AppError from "./AppError.js";

export const validateObjectId = (id, resource = "resource") => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(`Invalid ${resource} id`, 400, true, "INVALID_ID");
  }
};
