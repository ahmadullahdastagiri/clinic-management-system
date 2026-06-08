import User from "./users.model.js";

/* CREATE */
export const createUser = (payload) => User.create(payload);

/* READ */
export const findUserByEmail = (email) => User.findOne({ email }).lean();

export const findUserById = (id) => User.findById(id).lean();

export const findUserByPhone = (phone) => User.findOne({ phone }).lean();

export const allUsers = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const users = await User.find().skip(skip).limit(limit).lean();

  const totalUsers = await User.countDocuments();
  const totalPages = Math.ceil(totalUsers / limit);

  return { users, totalUsers, totalPages };
};

/* UPDATE */
export const updateUserById = (id, payload) =>
  User.findByIdAndUpdate(id, payload, { new: true, runValidators: true });

export const updateUserPasswordById = (id, newPassword) =>
  User.findByIdAndUpdate(
    id,
    { password: newPassword },
    { new: true, runValidators: true },
  );

export const updateLastLoginAtById = (id) =>
  User.findByIdAndUpdate(id, { lastLoginAt: new Date() }, { new: true });

export const activateUserById = (id) =>
  User.findByIdAndUpdate(id, { isActive: true }, { new: true });

export const deactivateUserById = (id) =>
  User.findByIdAndUpdate(id, { isActive: false }, { new: true });

export const verifyUserByEmail = (email) =>
  User.findOneAndUpdate(
    { email },
    { isEmailVerified: true },
    { new: true },
  ).lean();

export const verifyUserByPhone = (phone) =>
  User.findOneAndUpdate({ phone }, { isPhoneVerified: true }, { new: true });

export const assignRoleToUser = (id, role) =>
  User.findByIdAndUpdate(id, { role }, { new: true });

/* DELETE */
export const deleteUserById = (id) => User.findByIdAndDelete(id);
