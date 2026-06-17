import Patient from "./patient.model.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* CREATE */
export const createPatient = (patientData) => Patient.create(patientData);

/* READ */
export const getPatientById = (id) =>
  Patient.findById(id)
    .populate("receptionistId", "firstName lastName email phone")
    .lean();

export const allPatients = async ({ page = 1, limit = 10 } = {}) => {
  const skip = (page - 1) * limit;

  const patients = await Patient.find()
    .skip(skip)
    .limit(limit)
    .populate("receptionistId", "firstName lastName email phone")
    .lean();

  const totalPatients = await Patient.countDocuments();
  const totalPages = Math.ceil(totalPatients / limit);

  return { patients, totalPatients, totalPages };
};

export const searchPatient = async (key, { page = 1, limit = 10 }) => {
  const regex = new RegExp(escapeRegex(key), "i");
  const skip = (page - 1) * limit;

  const filter = {
    $or: [{ firstName: regex }, { lastName: regex }, { phone: regex }],
  };

  const patients = await Patient.find(filter)
    .skip(skip)
    .limit(limit)
    .populate("receptionistId", "firstName lastName email phone")
    .lean();

  const totalPatients = await Patient.countDocuments(filter);
  const totalPages = Math.ceil(totalPatients / limit);

  return { patients, totalPatients, totalPages };
};

/* UPDATE */
export const updatePatientById = (id, updateData) =>
  Patient.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

export const activatePatientById = (id) =>
  Patient.findByIdAndUpdate(id, { status: true }, { new: true });

export const deactivatePatientById = (id) =>
  Patient.findByIdAndUpdate(id, { status: false }, { new: true });

/* DELETE */
export const deletePatient = (id) => Patient.findByIdAndDelete(id);
