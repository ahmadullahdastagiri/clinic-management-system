import Appointment from "./appointment.model.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const appointmentPopulate = [
  {
    path: "patientId",
    select: "firstName lastName phone gender age",
  },
  {
    path: "doctorId",
    select: "userId specialization contactNumber",
    populate: {
      path: "userId",
      select: "firstName lastName email phone",
    },
  },
  {
    path: "createdBy",
    select: "firstName lastName email role",
  },
];

const buildSearchFilter = (key) => {
  if (!key) return null;

  const regex = new RegExp(escapeRegex(key), "i");

  return {
    $or: [
      { "patient.firstName": regex },
      { patientCode: regex },
      { doctorCode: regex },
    ],
  };
};

const appointmentListPipeline = ({ skip, limit, search }) => {
  const pipeline = [
    {
      $lookup: {
        from: "patients",
        localField: "patientId",
        foreignField: "_id",
        as: "patient",
      },
    },
    {
      $unwind: {
        path: "$patient",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "doctors",
        localField: "doctorId",
        foreignField: "_id",
        as: "doctor",
      },
    },
    {
      $unwind: {
        path: "$doctor",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "doctor.userId",
        foreignField: "_id",
        as: "doctorUser",
      },
    },
    {
      $unwind: {
        path: "$doctorUser",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];

  const searchFilter = buildSearchFilter(search);
  if (searchFilter) {
    pipeline.push({
      $addFields: {
        patientCode: { $toString: "$patient._id" },
        doctorCode: { $toString: "$doctor._id" },
      },
    });
    pipeline.push({ $match: searchFilter });
  }

  pipeline.push({
    $facet: {
      appointments: [
        { $sort: { appointmentDate: 1, appointmentTime: 1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            appointmentCode: 1,
            appointmentDate: 1,
            appointmentTime: 1,
            reason: 1,
            status: 1,
            notes: 1,
            patient: {
              _id: "$patient._id",
              firstName: "$patient.firstName",
              lastName: "$patient.lastName",
              phone: "$patient.phone",
              gender: "$patient.gender",
              age: "$patient.age",
            },
            doctor: {
              _id: "$doctor._id",
              specialization: "$doctor.specialization",
              contactNumber: "$doctor.contactNumber",
              user: {
                _id: "$doctorUser._id",
                firstName: "$doctorUser.firstName",
                lastName: "$doctorUser.lastName",
                email: "$doctorUser.email",
                phone: "$doctorUser.phone",
              },
            },
            createdAt: 1,
            updatedAt: 1,
          },
        },
      ],
      totalCount: [{ $count: "count" }],
    },
  });

  return pipeline;
};

/* CREATE */
export const createAppointment = (appointmentData) =>
  Appointment.create(appointmentData);

/* READ */
export const getAppointmentById = (id) =>
  Appointment.findById(id).populate(appointmentPopulate).lean();

export const getAllAppointments = async ({
  page = 1,
  limit = 10,
  search,
} = {}) => {
  const currentPage = Number(page) || 1;
  const perPage = Number(limit) || 10;
  const skip = (currentPage - 1) * perPage;

  const result = await Appointment.aggregate(
    appointmentListPipeline({
      search,
      skip,
      limit: perPage,
    }),
  );

  const appointments = result[0]?.appointments || [];
  const totalAppointments = result[0]?.totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalAppointments / perPage);

  return {
    appointments,
    pagination: {
      totalAppointments,
      totalPages,
      currentPage,
      limit: perPage,
    },
  };
};

export const getAppointmentsByDoctor = (doctorId) =>
  Appointment.find({ doctorId })
    .sort({ appointmentDate: 1, appointmentTime: 1 })
    .populate(appointmentPopulate)
    .lean();

export const getAppointmentsByPatient = (
  patientId,
  { page = 1, limit = 10 } = {},
) => {
  const skip = (page - 1) * limit;

  return Appointment.find({ patientId })
    .sort({ appointmentDate: -1, appointmentTime: -1 })
    .skip(skip)
    .limit(limit)
    .populate(appointmentPopulate)
    .lean();
};

export const findDoctorAppointmentSlot = ({
  doctorId,
  appointmentDate,
  appointmentTime,
}) =>
  Appointment.findOne({
    doctorId,
    appointmentDate,
    appointmentTime,
    status: { $ne: "cancelled" },
  }).lean();

/* UPDATE */
export const updateAppointmentById = (id, updateData) =>
  Appointment.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate(appointmentPopulate);

export const updateAppointmentStatus = (id, status) =>
  Appointment.findByIdAndUpdate(
    id,
    { status },
    {
      new: true,
      runValidators: true,
    },
  ).populate(appointmentPopulate);

/* DELETE */
export const deleteAppointmentById = (id) =>
  Appointment.findByIdAndDelete(id).lean();
