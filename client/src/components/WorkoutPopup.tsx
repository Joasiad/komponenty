import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Button from "./button";
import type { Exercise } from "../api";

type WorkoutTime = {
  hours: string;
  minutes: string;
};

type WorkoutPopupProps = {
  workoutTime: WorkoutTime;
  setWorkoutTime: (time: WorkoutTime) => void;

  handleWorkoutSubmit: () => void | Promise<void>;
  closePopup: () => void;

  exercises: Exercise[];
  selectedExerciseIds: string[];
  setSelectedExerciseIds: (ids: string[]) => void;

  notes: string;
  setNotes: (v: string) => void;
};

const WorkoutPopup = ({
  workoutTime,
  setWorkoutTime,
  handleWorkoutSubmit,
  closePopup,
  exercises,
  selectedExerciseIds,
  setSelectedExerciseIds,
  notes,
  setNotes,
}: WorkoutPopupProps) => (
  <div className="workout-popup">
    <div className="time-input">
      <div className="workout-popup-time">Time</div>

      <input
        type="number"
        min={0}
        max={23}
        className="hours"
        value={workoutTime.hours}
        onChange={(e) =>
          setWorkoutTime({ ...workoutTime, hours: e.target.value })
        }
      />

      <input
        type="number"
        min={0}
        max={59}
        className="minutes"
        value={workoutTime.minutes}
        onChange={(e) =>
          setWorkoutTime({ ...workoutTime, minutes: e.target.value })
        }
      />
    </div>

    <div className="exercise-picker">
      <div className="exercise-picker-title">Ćwiczenia</div>

      {exercises.length === 0 ? (
        <div className="exercise-empty">
          Brak ćwiczeń w bazie (dodaj je przyciskiem po lewej)
        </div>
      ) : (
        <div className="exercise-list">
          {exercises.map((ex) => (
            <label key={ex._id} className="exercise-item">
              <input
                type="checkbox"
                checked={selectedExerciseIds.includes(ex._id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedExerciseIds([...selectedExerciseIds, ex._id]);
                  } else {
                    setSelectedExerciseIds(
                      selectedExerciseIds.filter((id) => id !== ex._id)
                    );
                  }
                }}
              />

              <div className="exercise-meta">
                <div className="exercise-name">{ex.name}</div>

                <div className="exercise-stats">
    {ex.kg} kg • {ex.reps} reps • {ex.series} serie
  </div>
              </div>
            </label>
          ))}
        </div>
      )}
    </div>

    <textarea
      placeholder="Notatki do treningu (opcjonalnie)"
      value={notes}
      onChange={(e) => {
        if (e.target.value.length <= 200) setNotes(e.target.value);
      }}
    />

    <Button className="workout-popup-btn" onClick={handleWorkoutSubmit}>
      Zapisz trening
    </Button>

    <Button className="close-workout-popup" onClick={closePopup}>
      <XMarkIcon className="icon-small" />
    </Button>
  </div>
);

export default WorkoutPopup;
