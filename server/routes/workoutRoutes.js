const express = require("express");
const router = express.Router();

const Workout = require("../models/Workout");

// Zapis treningu
router.post("/", async (req, res) => {
    try {
        const workout = new Workout(req.body);
        await workout.save();
        res.json(workout);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Pobierz wszystkie treningi
router.get("/", async (req, res) => {
    const workouts = await Workout.find().populate("exercises");
    res.json(workouts);
});

router.delete("/:id", async (req, res) => {
  await Workout.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});


module.exports = router;
