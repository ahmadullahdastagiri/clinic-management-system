import User from "../users/users.model.js";

export const findUserByEmailAndPassword = (email) =>
  User.find({ email: email }).select("+password");
