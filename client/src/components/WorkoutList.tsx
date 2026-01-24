import React from "react";
import { PencilSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Button from "./button";



type Exercise = {
  _id: string;
  name: string;
};

export type Workout = {
  _id: string;
  date: string;          // ISO string
  time: string;
  exercises: (string|Exercise)[];   
  notes?: string;
};

type WorkoutListProps = {
  workouts: Workout[];
  monthsOfYear: string[];
  currentDate: Date;
  handleEditWorkout: (workout: Workout) => void;
  handleDeleteWorkout: (id: string) => void;
};

const formatDate = (iso: string, monthsOfYear: string[]) => {
  const d = new Date(iso);
  return `${monthsOfYear[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

const WorkoutList = ({
  workouts,
  monthsOfYear,
  currentDate,
  handleEditWorkout,
  handleDeleteWorkout,
}: WorkoutListProps) => {
  const visibleWorkouts = workouts
    .filter((w) => {
      const d = new Date(w.date);
      return (
        d.getFullYear() === currentDate.getFullYear() &&
        d.getMonth() === currentDate.getMonth()
      );
    })
    .sort((a, b) => {
      const aTs = new Date(a.date).getTime();
      const bTs = new Date(b.date).getTime();
      return (aTs - bTs) || a.time.localeCompare(b.time);
    });

  return (
    <div className="workouts">
      {visibleWorkouts.map((workout) => (
        <div className="workout" key={workout._id}>
          <div className="workout-date-wrapper">
            <div className="workout-date">
              {formatDate(workout.date, monthsOfYear)}
            </div>
            <div className="workout-time">{workout.time}</div>
          </div>

          {workout.notes && <div className="workout-text">{workout.notes}</div>}

           <ul className="exercise-list">
            {workout.exercises.map((ex) => (
              <li key={typeof ex === "string" ? ex : ex._id}>
                {typeof ex === "string" ? ex : ex.name}
              </li>
            ))}
          </ul>

          <div className="workout-buttons">
            <Button className="edit-btn" onClick={() => handleEditWorkout(workout)}>
              <PencilSquareIcon className="icon-small" />
            </Button>

            <Button
              className="delete-btn"
              onClick={() => handleDeleteWorkout(workout._id)}
            >
              <XMarkIcon className="icon-small" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkoutList;
