import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { XMarkIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

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

  return (
    <div className="calendar-app">

      {/* CALENDAR */}
      <div className="calendar">
        <h1 className="heading">Training Planner</h1>

        <div className="navigate-date">
          <h2 className="month">{monthsOfYear[currentDate.getMonth()]},</h2>
          <h2 className="year">{currentDate.getFullYear()}</h2>

          <div className="buttons">
            <button className="btn-left" onClick={prevMonth}>
              <ChevronLeftIcon className="icon-small" />
            </button>
            <button className="btn-right" onClick={nextMonth}>
              <ChevronRightIcon className="icon-small" />
            </button>
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

      {/* WORKOUT POPUP */}
      <div className="workouts">
        {showWorkoutPopup && (
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

            <button className="workout-popup-btn" onClick={handleWorkoutSubmit}>
              {editingWorkout ? "Save workout" : "Add workout"}
            </button>

            <button className="close-workout-popup" onClick={closePopup}>
              <XMarkIcon className="icon-small" />
            </button>
          </div>
        )}

        
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
              <button className="edit-btn" onClick={() => handleEditWorkout(workout)}>
                <PencilSquareIcon className="icon-small" />
              </button>
              <button className="delete-btn" onClick={() => handleDeleteWorkout(workout.id)}>
                <XMarkIcon className="icon-small" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarApp;
