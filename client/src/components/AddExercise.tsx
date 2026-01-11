import React, { useEffect, useState } from "react";
import "./Addexercise.css";
import Button from "./button";
import { XMarkIcon } from "@heroicons/react/24/outline";

type AddExerciseProps = {
  closeAddPopup: () => void;
};

type Exercise = {
  _id: string;
  name: string;
  bodyPart: string;
  series: string; // zostawiamy string, bo trzymasz to w inputach jako string
  reps: string;
  kg: string;
};

const AddExercise: React.FC<AddExerciseProps> = ({ closeAddPopup }) => {
  const [exerciseName, setExerciseName] = useState<string>("");
  const [bodyPart, setBodyPart] = useState<string>("");
  const [series, setSeries] = useState<string>("");
  const [reps, setReps] = useState<string>("");
  const [kg, setKg] = useState<string>("");
  const [exerciseList, setExerciseList] = useState<Exercise[]>([]);

  const API_URL = "http://localhost:5000/api/exercises";

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`GET ${API_URL} failed: ${res.status}`);
        const data: Exercise[] = await res.json();
        setExerciseList(data);
      } catch (err) {
        console.error(err);
      }
    };

    void load();
  }, []);

  const handleAddExercise = async () => {
    if (!exerciseName.trim()) return;

    // payload bez _id – backend powinien go dodać
    const newExercise: Omit<Exercise, "_id"> = {
      name: exerciseName,
      bodyPart,
      series,
      reps,
      kg,
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExercise),
      });

      if (!res.ok) throw new Error(`POST ${API_URL} failed: ${res.status}`);

      const saved: Exercise = await res.json();

      setExerciseList((prev) => [...prev, saved]);
      setExerciseName("");
      setBodyPart("");
      setSeries("");
      setReps("");
      setKg("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="add-exercise">
      {/* GÓRNY PASEK MODALA */}
      <div className="add-exercise-header">
        <h2>Dodaj ćwiczenie</h2>

        
      </div>

      {/* FORMULARZ */}
      <div className="add-exercise-body">
        <input
          placeholder="Nazwa ćwiczenia"
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
        />

        <input
          placeholder="Część ciała"
          value={bodyPart}
          onChange={(e) => setBodyPart(e.target.value)}
        />

        <input
          placeholder="Serie"
          type="number"
          value={series}
          onChange={(e) => setSeries(e.target.value)}
        />

        <input
          placeholder="Powtórzenia"
          type="number"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
        />

        <input
          placeholder="Kg"
          type="number"
          value={kg}
          onChange={(e) => setKg(e.target.value)}
        />

        <button onClick={handleAddExercise}>Dodaj ćwiczenie</button>
        <Button className="close-addExercise-popup" onClick={closeAddPopup}>
          <XMarkIcon className="icon-small" />
        </Button>
      </div>
    </div>
  );
};

export default AddExercise;
