import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";

import connectDB from "./config/database.config.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import userRoutes from "./modules/users/users.route.js";

dotenv.config();

const app = express();

// middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded(true));

// connect to database
connectDB();

// routes
app.use("/api/users", userRoutes);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
