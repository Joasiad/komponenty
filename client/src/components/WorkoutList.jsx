import { PencilSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";
import Button from "./button";

const WorkoutList = ({ workouts, monthsOfYear, handleEditWorkout, handleDeleteWorkout }) => (
  <div className="workouts">
    {workouts.map(workout => (
      <div className="workout" key={workout.id}>
        <div className="workout-date-wrapper">
          <div className="workout-date">
            {`${monthsOfYear[workout.date.getMonth()]} ${workout.date.getDate()}, ${workout.date.getFullYear()}`}
          </div>
          <div className="workout-time">{workout.time}</div>
        </div>

        <div className="workout-text">{workout.text}</div>

        <div className="workout-buttons">
          <Button className="edit-btn" onClick={() => handleEditWorkout(workout)}>
            <PencilSquareIcon className="icon-small" />
          </Button>
          <Button className="delete-btn" onClick={() => handleDeleteWorkout(workout.id)}>
            <XMarkIcon className="icon-small" />
          </Button>
        </div>
      </div>
    ))}
  </div>
);

export default WorkoutList;
