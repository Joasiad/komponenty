import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { XMarkIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import "./CalendarApp.css";
import React from "react";
import WorkoutList from "./WorkoutList";
import WorkoutPopup from "./WorkoutPopup";
import Button from"./button";

import AddExercise from "./AddExercise";
const CalendarApp = () => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthsOfYear = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(today);

  const [showWorkoutPopup, setShowWorkoutPopup] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const [workoutTime, setWorkoutTime] = useState({ hours: "00", minutes: "00" });
  const [workoutText, setWorkoutText] = useState("");
  const [editingWorkout, setEditingWorkout] = useState(null);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  // NAVIGATE MONTHS
  const nextMonth = () => {
    setCurrentDate(prev => {
      const newMonth = prev.getMonth() + 1;
      const newYear = prev.getFullYear() + (newMonth > 11 ? 1 : 0);
      return new Date(newYear, newMonth % 12, 1);
    });
  };

  const prevMonth = () => {
    setCurrentDate(prev => {
      const newMonth = prev.getMonth() - 1;
      const newYear = prev.getFullYear() + (newMonth < 0 ? -1 : 0);
      return new Date(newYear, (newMonth + 12) % 12, 1);
    });
  };

 
  const handleDayClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    setWorkoutText("");
    setWorkoutTime({ hours: "00", minutes: "00" });
    setEditingWorkout(null);
    setShowWorkoutPopup(true);
  };

  const closePopup = () => setShowWorkoutPopup(false);

 
  const handleWorkoutSubmit = () => {
    const newWorkout = {
      id: editingWorkout ? editingWorkout.id : Date.now(),
      date: selectedDate,
      time: `${workoutTime.hours.padStart(2,'0')}:${workoutTime.minutes.padStart(2,'0')}`,
      text: workoutText
    };

    let updated = [...workouts];
    if (editingWorkout) {
      updated = updated.map(w => w.id === editingWorkout.id ? newWorkout : w);
    } else {
      updated.push(newWorkout);
    }

    updated.sort((a,b) => new Date(a.date) - new Date(b.date));
    setWorkouts(updated);

    setWorkoutText("");
    setWorkoutTime({ hours: "00", minutes: "00" });
    setEditingWorkout(null);
    setShowWorkoutPopup(false);
  };


  const handleEditWorkout = (workout) => {
    setSelectedDate(new Date(workout.date));
    setWorkoutTime({
      hours: workout.time.split(":")[0],
      minutes: workout.time.split(":")[1]
    });
    setWorkoutText(workout.text);
    setEditingWorkout(workout);
    setShowWorkoutPopup(true);
  };

  
  const handleDeleteWorkout = (id) => {
    setWorkouts(workouts.filter(w => w.id !== id));
  };
  const [showAddExercise, setShowAddExercise] = useState(false);


  return (
    
    <div className="calendar-app">
<Button onClick={() => setShowAddExercise(true)}>Dodaj nowe ćwiczenie</Button>
 {showAddExercise && <AddExercise onClose={() => setShowAddExercise(false)} />}
      {/* CALENDAR */}
      <div className="calendar">
        <h1 className="heading">Training Planner</h1>

        <div className="navigate-date">
          <h2 className="month">{monthsOfYear[currentDate.getMonth()]},</h2>
          <h2 className="year">{currentDate.getFullYear()}</h2>

          <div className="buttons">
            <Button className="btn-left" onClick={prevMonth}>
              <ChevronLeftIcon className="icon-small" />
            </Button>
            <Button className="btn-right" onClick={nextMonth}>
              <ChevronRightIcon className="icon-small" />
            </Button>
          </div>
        </div>

        <div className="weekdays">
          {daysOfWeek.map(day => <span key={day}>{day}</span>)}
        </div>

        <div className="days">
          {[...Array(firstDayOfMonth).keys()].map((_, index) => (
            <span key={`empty-${index}`} />
          ))}

          {[...Array(daysInMonth).keys()].map(day => (
            <span
              key={day + 1}
              className={
                day + 1 === today.getDate() &&
                currentDate.getMonth() === today.getMonth() &&
                currentDate.getFullYear() === today.getFullYear()
                  ? "currentDay"
                  : ""
              }
              onClick={() => handleDayClick(day + 1)}
            >
              {day + 1}
            </span>
          ))}
        </div>
      </div>

      

      {showWorkoutPopup && (
        <WorkoutPopup
          workoutTime={workoutTime}
          workoutText={workoutText}
          setWorkoutTime={setWorkoutTime}
          setWorkoutText={setWorkoutText}
          handleWorkoutSubmit={handleWorkoutSubmit}
          closePopup={closePopup}
          editingWorkout={editingWorkout}
        />
      )}

     
      <WorkoutList
        workouts={workouts}
        monthsOfYear={monthsOfYear}
        handleEditWorkout={handleEditWorkout}
        handleDeleteWorkout={handleDeleteWorkout}
      />
    </div>
        
        
      
    
  );
};

export default CalendarApp;
