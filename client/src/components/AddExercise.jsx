import React, { useState, useEffect } from "react";
import "./Addexercise.css";
import Button from "./button";
import { XMarkIcon } from "@heroicons/react/24/outline";

const AddExercise = ({ closeAddPopup }) => {
  const [exerciseName, setExerciseName] = useState("");
  const [bodyPart, setBodyPart] = useState("");
  const [series, setSeries] = useState("");
  const [reps, setReps] = useState("");
  const [kg, setKg] = useState("");
  const [exerciseList, setExerciseList] = useState([]);

  const API_URL = "http://localhost:5000/exercises";

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setExerciseList(data))
      .catch(err => console.error(err));
  }, []);

  const handleAddExercise = () => {
    if (!exerciseName) return;

    const newExercise = { name: exerciseName, bodyPart, series, reps, kg };

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newExercise),
    })
      .then(res => res.json())
      .then(data => {
        setExerciseList(prev => [...prev, data]);
        setExerciseName("");
        setBodyPart("");
        setSeries("");
        setReps("");
        setKg("");
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="add-exercise">

      {/* GÓRNY PASEK MODALA */}
      <div className="add-exercise-header">
        <h2>Dodaj ćwiczenie</h2>

        <Button className="close-addExercise-popup" onClick={closeAddPopup}>
          <XMarkIcon className="icon-small" />
        </Button>
      </div>

      {/* FORMULARZ */}
      <div className="add-exercise-body">

        <input
          placeholder="Nazwa ćwiczenia"
          value={exerciseName}
          onChange={e => setExerciseName(e.target.value)}
        />

        <input
          placeholder="Część ciała"
          value={bodyPart}
          onChange={e => setBodyPart(e.target.value)}
        />

        <input
          placeholder="Serie"
          type="number"
          value={series}
          onChange={e => setSeries(e.target.value)}
        />

        <input
          placeholder="Powtórzenia"
          type="number"
          value={reps}
          onChange={e => setReps(e.target.value)}
        />

        <input
          placeholder="Kg"
          type="number"
          value={kg}
          onChange={e => setKg(e.target.value)}
        />

        <button onClick={handleAddExercise}>Dodaj ćwiczenie</button>

        {/* LISTA */}
        <h3>Lista ćwiczeń:</h3>
        <div className="exercise-list">
          <ul>
            {exerciseList.map(ex => (
              <li key={ex._id}>
                {ex.name} – {ex.bodyPart} – {ex.series}x{ex.reps} – {ex.kg}kg
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
};

export default AddExercise;
