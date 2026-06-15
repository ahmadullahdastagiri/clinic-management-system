import Doctor from "./doctor.model.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* CREATE */
export const createDoctor = (doctorData) => Doctor.create(doctorData);

/* READ */
export const getDoctorById = (id) =>
  Doctor.findById(id)
    .populate("userId", "firstName lastName email phone")
    .lean();

export const getAllDoctors = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const doctors = await Doctor.find()
    .skip(skip)
    .limit(limit)
    .populate("userId", "firstName lastName email phone")
    .populate("userId", "firstName lastName email phone")
    .lean();

  const totalDoctors = await Doctor.countDocuments();
  const totalPages = Math.ceil(totalDoctors / limit);

  return { doctors, totalDoctors, totalPages };
};

export const findDoctor = async (key, { page = 1, limit = 10 }) => {
  const regex = new RegExp(escapeRegex(key), "i");
  const skip = (page - 1) * limit;
  const doctors = await Doctor.find({
    $or: [
      {
        firstName: regex,
        lastName: regex,
      },
    ],
  })
    .skip(skip)
    .limit(limit)
    .populate("userId", "firstName lastName email phone")
    .lean();
  return doctors;
};

/* UPDATE */
export const activateDoctorById = (id) =>
  Doctor.findByIdAndUpdate(id, { active: true }, { new: true });

export const deactivateDoctorById = (id) =>
  Doctor.findByIdAndUpdate(id, { active: false }, { new: true });

export const updateDoctorById = (id, updateData) =>
  Doctor.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

/* DELETE */
export const deleteDoctor = (id) => Doctor.findByIdAndDelete(id);
