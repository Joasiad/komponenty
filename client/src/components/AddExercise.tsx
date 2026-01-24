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
  series: string; 
  reps: string;
  kg: string;
};

const AddExercise = ({ closeAddPopup }: AddExerciseProps) => {
  const [exerciseName, setExerciseName] = useState<string>("");
  const [bodyPart, setBodyPart] = useState<string>("");
  const [series, setSeries] = useState<string>("");
  const [reps, setReps] = useState<string>("");
  const [kg, setKg] = useState<string>("");
  const [exerciseList, setExerciseList] = useState<Exercise[]>([]);

  const API_URL = "http://localhost:5000/api/exercises";
//kiedy komponent sie uruchou funckja pobierze liste cwiczen z api i zapisze ja w ecercise list 
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
  }, []);//to robi ze uruchamia sie raz przy pierwzym renderze 

  const handleAddExercise = async () => {
    if (!exerciseName.trim()) return;//spacja

//omit to typ w ts ktory mowi wez typ exercise i wywal z niego id zeby nie pokazywało sie na liscie we frontendzie
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
     
      <div className="add-exercise-header">
        <h2>Dodaj ćwiczenie</h2>

        
      </div>

      
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
          min={0}
          value={series}
          onChange={(e) => { if(Number(e.target.value)<0 )return;
            setSeries(e.target.value);}}
        />

        <input
          placeholder="Powtórzenia"
          type="number"
          min={0}
          value={reps}
          onChange={(e) =>  { if(Number(e.target.value)<0 )return;
            setReps(e.target.value);}}
        />

        <input
          placeholder="Kg"
          type="number"
          min={0}
          value={kg}
          onChange={(e) =>  { if(Number(e.target.value)<0 )return;
            setKg(e.target.value);}}
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
