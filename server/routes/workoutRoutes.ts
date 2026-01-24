import { Router } from "express";
import Workout from "../models/Workout";

const router = Router();

// Zapis treningu
router.post("/", async (req, res) => {
  try {
    const workout = new Workout(req.body);
    await workout.save();
    const populated = await workout.populate("exercises");
    res.json(populated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Pobierz wszystkie treningi
router.get("/", async (_req, res) => {
  try {
    const workouts = await Workout.find().populate("exercises");
    res.json(workouts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Workout.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
router.patch("/:id", async (req, res) => {
  try {
    const updated = await Workout.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("exercises");

    if (!updated) return res.status(404).json({ error: "Workout not found" });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
