const mongoose = require("mongoose");

const WorkoutSchema = new mongoose.Schema({
    date: Date,
    time: String,
    exercises: [{ type: mongoose.Schema.Types.ObjectId, ref: "Exercise" }],
    notes: String
});

module.exports = mongoose.model("Workout", WorkoutSchema);
