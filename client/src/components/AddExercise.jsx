import React, { useState, useEffect } from "react";

const AddExercise = () => {
  const [exerciseName, setExerciseName] = useState("");
  const [bodyPart, setBodyPart] = useState("");
  const [series, setSeries] = useState("");
  const [reps, setReps] = useState("");
  const [kg, setKg] = useState("");
  const [exerciseList, setExerciseList] = useState([]);

  const API_URL = "http://localhost:5000/exercises"; // Twój backend

  // Pobranie ćwiczeń przy montowaniu komponentu
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setExerciseList(data))
      .catch(err => console.error(err));
  }, []);

  // Dodawanie nowego ćwiczenia
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
        setExerciseList(prev => [...prev, data]); // dodanie do lokalnej listy
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
      <h2>Dodaj nowe ćwiczenie</h2>

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

      <h3>Lista ćwiczeń:</h3>
      <ul>
        {exerciseList.map(ex => (
          <li key={ex._id}>
            {ex.name} – {ex.bodyPart} – {ex.series}x{ex.reps} – {ex.kg}kg
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddExercise;
