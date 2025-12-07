const mongoose = require("mongoose");

const ExerciseSchema = new mongoose.Schema({
    name: String,
    bodyPart: String,
    series: Number,
    reps: Number,
    kg: Number
});

module.exports = mongoose.model("Exercise", ExerciseSchema);
