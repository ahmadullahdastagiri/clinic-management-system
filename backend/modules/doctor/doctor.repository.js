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
    .lean();

  const totalDoctors = await Doctor.countDocuments();
  const totalPages = Math.ceil(totalDoctors / limit);

  return { doctors, totalDoctors, totalPages };
};

export const findDoctor = async (key, { page = 1, limit = 10 }) => {
  const regex = new RegExp(escapeRegex(key), "i");
  const skip = (page - 1) * limit;

  const result = await Doctor.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $match: {
        $or: [{ "user.firstName": regex }, { "user.lastName": regex }],
      },
    },
    {
      $facet: {
        doctors: [
          {
            $sort: {
              "user.firstName": 1,
            },
          },
          {
            $skip: skip,
          },
          {
            $limit: limit,
          },
          {
            $project: {
              specialization: 1,
              experience: 1,
              contactNumber: 1,
              active: 1,
              "user.firstName": 1,
              "user.lastName": 1,
              "user.email": 1,
            },
          },
        ],
        totalCount: [
          {
            $count: "count",
          },
        ],
      },
    },
  ]);

  const doctors = result[0].doctors;
  const totalDoctors = result[0].totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalDoctors / limit);

  return {
    doctors,
    pagination: {
      totalDoctors,
      totalPages,
      currentPage: page,
    },
  };
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
