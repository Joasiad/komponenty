import { XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";
import Button from "./button";
const WorkoutPopup = ({
  workoutTime,
  workoutText,
  setWorkoutTime,
  setWorkoutText,
  handleWorkoutSubmit,
  closePopup,
  editingWorkout
}) => (
  <div className="workout-popup">
    <div className="time-input">
      <div className="workout-popup-time">Time</div>

      <input
        type="number"
        min={0}
        max={24}
        className="hours"
        value={workoutTime.hours}
        onChange={e => setWorkoutTime({ ...workoutTime, hours: e.target.value })}
      />

      <input
        type="number"
        min={0}
        max={60}
        className="minutes"
        value={workoutTime.minutes}
        onChange={e => setWorkoutTime({ ...workoutTime, minutes: e.target.value })}
      />
    </div>

    <textarea
      placeholder="Enter workout description"
      value={workoutText}
      onChange={e => { if (e.target.value.length <= 60) setWorkoutText(e.target.value); }}
    />

    <Button className="workout-popup-btn" onClick={handleWorkoutSubmit}>
      {editingWorkout ? "Save workout" : "Add workout"}
    </Button>

    <Button className="close-workout-popup" onClick={closePopup}>
      <XMarkIcon className="icon-small" />
    </Button>
  </div>
);

export default WorkoutPopup;
