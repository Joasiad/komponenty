import { Router } from "express";
import Exercise from "../models/Exercise";

const router = Router();

// GET – pobranie wszystkich ćwiczeń
router.get("/", async (_req, res) => {
  try {
    const exercises = await Exercise.find();
    res.json(exercises);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST – dodanie nowego ćwiczenia
router.post("/", async (req, res) => {
  const { name, bodyPart, series, reps, kg } = req.body;

  try {
    const newExercise = await Exercise.create({
      name,
      bodyPart,
      series,
      reps,
      kg,
    });

    res.status(201).json(newExercise);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

//patch czyli do edycji
router.patch("/:id", async (req, res) => {
  try {
    const updated = await Exercise.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) return res.status(404).json({ error: "Exercise not found" });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
//i do usuwania 
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Exercise.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Exercise not found" });
    res.json({ message: "Deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
