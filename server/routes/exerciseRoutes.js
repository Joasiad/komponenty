const express = require("express");
const router = express.Router();
const Exercise = require("../models/Exercise");

// GET - pobranie wszystkich ćwiczeń
router.get("/", async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.json(exercises);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST - dodanie nowego ćwiczenia
router.post("/", async (req, res) => {
  const { name, bodyPart, series, reps, kg } = req.body;
  try {
    const newExercise = await Exercise.create({ name, bodyPart, series, reps, kg });
    res.status(201).json(newExercise);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
