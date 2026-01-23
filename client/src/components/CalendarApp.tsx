import React, { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

import { fetchExercises, createWorkout, updateWorkout, deleteWorkout,fetchWorkouts, type Exercise } from "../api";
import WorkoutPopup from "./WorkoutPopup"
import "./CalendarApp.css";
import WorkoutList from "./WorkoutList";

import Button from "./button";
import AddExercise from "./AddExercise";
import ExerciseList from "./ExerciseList";
import { useNavigate } from "react-router-dom";

//w projekcie czesto uzywamy wpisywania godziny wiec trzymamy stringi bo bezpieczniej jest pozniej formatowac na stringach
type WorkoutTime = {
  hours: string;
  minutes: string;
};
//natomiast w workout uzywamy w dacie juz date a nie string bo pozniej chcemysortowac treningi do statystyk
//uzywac funckji get time itd
type Workout = {
  _id: string;
  date: string;      
  time: string;  
  exercises:(Exercise|string)[];  
  notes?: string;
};


const CalendarApp = () => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthsOfYear = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];


 

//dzisiejsza data z systemu uzytkownika
  const today = new Date();
//data ustawiona na pierwszy dzien akualnego miesiaca aby bylol atw pozniej liczyc
  const [currentDate, setCurrentDate] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  //klikneity dzien, nie moge [przypisac ponownie deklaracji ale dzieki set moge zmieniac zawartosc]
  //useState zwraca tablice z dwoma wartosciami warosci setter to w <> sprawia ze to bedzie dzialac tylko ndla teg typu danych
  //today to wartosc poczatkowa stanu ustawiana tylko przy pierwszym renderze
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  const [showWorkoutPopup, setShowWorkoutPopup] = useState<boolean>(false);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [workoutTime, setWorkoutTime] = useState<WorkoutTime>({ hours: "00", minutes: "00" });
  const [showExercises, setShowExercises] = useState(false);

  // null albo Workout bo workout zmienna jest wtedy gdy sie edytuje a null gdy powstaje nowy workout dzieki temu
  //nie ma undefined


  //TO DO BAZY
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
   const handleDeleteWorkout = async (id: string) => {
  try {
    await deleteWorkout(id);
    setWorkouts((prev) => prev.filter((w) => w._id !== id));
  } catch (e) {
    console.error(e);
    alert("Nie udało się usunąć treningu");
  }
};


    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>([]);
    const [notes, setNotes] = useState<string>("");



   const handleEditWorkout = (workout: Workout) => {
  setSelectedDate(new Date(workout.date));
  setWorkoutTime({
    hours: workout.time.split(":")[0] ?? "00",
    minutes: workout.time.split(":")[1] ?? "00",
  });

  const ids = (workout.exercises ?? []).map((ex) =>
    typeof ex === "string" ? ex : ex._id
  );
  setSelectedExerciseIds(ids);

  setNotes(workout.notes ?? "");
  setEditingWorkout(workout);
  setShowWorkoutPopup(true);
};


  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();//zwraca dzien 0 nastepnego msc
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();//sluzy do wstawiania pustych pol
//prev najbardziej aktualna wartosc
  const nextMonth = () => {
    setCurrentDate((prev) => {
      const newMonth = prev.getMonth() + 1;
      const newYear = prev.getFullYear() + (newMonth > 11 ? 1 : 0);
      return new Date(newYear, newMonth % 12, 1);
    });
  };

  const prevMonth = () => {
    setCurrentDate((prev) => {
      const newMonth = prev.getMonth() - 1;
      const newYear = prev.getFullYear() + (newMonth < 0 ? -1 : 0);
      return new Date(newYear, (newMonth + 12) % 12, 1);
    });
  };
//klikamy dzien day to nazwa parametru
  const handleDayClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    setNotes("");
   setSelectedExerciseIds([]);
    setWorkoutTime({ hours: "00", minutes: "00" });
    setEditingWorkout(null);
    setShowWorkoutPopup(true);
  };

  const closePopup = () => setShowWorkoutPopup(false);
//  to bedzie do zmiany
const handleWorkoutSubmit = async () => {
  try {
    const dto = {
      date: selectedDate.toISOString(),
      time: `${workoutTime.hours.padStart(2, "0")}:${workoutTime.minutes.padStart(2, "0")}`,
      exercises: selectedExerciseIds,
      notes: notes || undefined,
    };

    const saved = editingWorkout
      ? await updateWorkout(editingWorkout._id, dto)
      : await createWorkout(dto);

    setWorkouts((prev) => {
  const without = prev.filter((w) => w._id !== saved._id);

  const next = [...without, saved];

  next.sort((a, b) => {
    const aTs = new Date(`${a.date}`).getTime();
    const bTs = new Date(`${b.date}`).getTime();

    const aTime = a.time ?? "00:00";
    const bTime = b.time ?? "00:00";

    return (aTs - bTs) || aTime.localeCompare(bTime);
  });

  return next;
  });


    setWorkoutTime({ hours: "00", minutes: "00" });
    setSelectedExerciseIds([]);
    setNotes("");
    setEditingWorkout(null);
    setShowWorkoutPopup(false);
  } catch (e) {
    console.error(e);
    alert("Nie udało się zapisać treningu");
  }
};








  const [showAddExercise, setShowAddExercise] = useState<boolean>(false);
  const closeAddPopup = () => setShowAddExercise(false);

  const navigate = useNavigate();

  useEffect(() => {
  fetchExercises()
    .then(setExercises)
    .catch(console.error);
}, []);

useEffect(() => {
  fetchWorkouts()
    .then(setWorkouts)
    .catch(console.error);
}, []);



  return (
    <div className="container">
      <div className="button-column">
          <Button className="columnb" onClick={() => setShowAddExercise(true)}>Dodaj ćwiczenie</Button>
        

          {showAddExercise && <AddExercise closeAddPopup={closeAddPopup} />}

          <Button className="columnb" onClick={() => setShowExercises((v) => !v)}>
          {showExercises ? "Ukryj ćwiczenia" : "Pokaż ćwiczenia"}
          </Button>
          {showExercises && <ExerciseList />}
        <Button className="columnb" onClick={()=>navigate("/statistics")}>
          Statystyki
        </Button>
      </div>
    <div className="calendar-app">
      
     


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
          {daysOfWeek.map((day) => (
            <span key={day}>{day}</span>//klucz unikalny bo react tak chce (opt)
          ))}
        </div>

        <div className="days">
          {[...Array(firstDayOfMonth).keys()].map((_, index) => (
            <span key={`empty-${index}`} />
          ))}

          {[...Array(daysInMonth).keys()].map((day) => (
            <span//podswietlanie
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
        setWorkoutTime={setWorkoutTime}
        handleWorkoutSubmit={handleWorkoutSubmit}
        closePopup={closePopup}
        exercises={exercises}
        selectedExerciseIds={selectedExerciseIds}
        setSelectedExerciseIds={setSelectedExerciseIds}
        notes={notes}
        setNotes={setNotes}
      />
      )}

      <WorkoutList
        workouts={workouts}
        monthsOfYear={monthsOfYear}
        currentDate={currentDate}
        handleEditWorkout={handleEditWorkout}
        handleDeleteWorkout={handleDeleteWorkout}
      />
     
    </div>
     
      </div>
  );
};

export default CalendarApp;
