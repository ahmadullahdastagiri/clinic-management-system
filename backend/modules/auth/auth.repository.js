import User from "../users/users.model.js";

export const findUserByEmailAndPassword = (email) =>
  User.findOne({ email: email.toLowerCase() }).select("+password");
