import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";

import connectDB from "./config/database.config.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import userRoutes from "./modules/users/users.route.js";
import doctorRoutes from "./modules/doctor/doctor.route.js";
import patientRoutes from "./modules/patient/patient.route.js";
import appointmentRoutes from "./modules/appointment/appointment.route.js";

dotenv.config();

const app = express();

// middleware
app.use(morgan("dev"));
app.use(express.json());

// connect to database
connectDB();

// routes
app.use("/api/users", userRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
