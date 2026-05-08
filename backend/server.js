import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";

import connectDB from "./config/database.config.js";

dotenv.config();

const app = express();

// middleware
app.use(morgan("dev"));

// connect to database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
