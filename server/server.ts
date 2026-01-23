import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import workoutRoutes from "./routes/workoutRoutes";
import exerciseRoutes from "./routes/exerciseRoutes";

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/workouts", workoutRoutes);
app.use("/api/exercises", exerciseRoutes);

// baza
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  console.error("Brakuje MONGO_URL w .env");
  process.exit(1);
}

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err: unknown) => {
    console.error("MongoDB connection error:", err);
  });

app.listen(5000, () => console.log("Server running on port 5000"));
