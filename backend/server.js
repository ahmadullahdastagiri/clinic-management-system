import express from "express";
import morgan from "morgan";

const app = express();

// middleware
app.use(morgan("dev"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
