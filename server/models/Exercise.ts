import mongoose from "mongoose";

const ExerciseSchema = new mongoose.Schema({
  name: String,
  bodyPart: String,
  series: Number,
  reps: Number,
  kg: Number,
});

export default mongoose.model("Exercise", ExerciseSchema);
