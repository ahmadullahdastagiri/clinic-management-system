import bcrypt from "bcrypt";
import {
  createUser as createUserRepo,
  findUserByEmail,
} from "./users.repository.js";

export const createUser = async (userData) => {
  const existingUser = await findUserByEmail(userData.email);
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  userData.password = hashedPassword;

  const user = await createUserRepo(userData);

  return user;
};
