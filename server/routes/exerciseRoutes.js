const express = require("express");
const router = express.Router();
const Exercise = require("../models/Exercise");

// GET – lista ćwiczeń
router.get("/", async (req, res) => {
  const exercises = await Exercise.find();
  res.json(exercises);
});

// POST – dodanie ćwiczenia do bazy
router.post("/", async (req, res) => {
  const exercise = new Exercise(req.body);
  await exercise.save();
  res.json(exercise);
});

module.exports = router;
