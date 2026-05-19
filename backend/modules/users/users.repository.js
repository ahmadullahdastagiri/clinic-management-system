import User from "./users.model.js";

export const createUser = (payload) => User.create(payload);

export const findUserByEmail = (email) => User.findOne({ email }).lean();

export const findUserById = (id) => User.findById(id).lean();
