import mongoose from "mongoose";

const WorkoutSchema = new mongoose.Schema({
  date: Date,
  time: String,
 exercises: [{ type: mongoose.Schema.Types.ObjectId, ref: "Exercise" }],
  notes: String,
});

export default mongoose.model("Workout", WorkoutSchema);
