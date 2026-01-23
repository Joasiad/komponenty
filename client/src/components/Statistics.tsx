import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/button";
import "./Statistics.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

import { fetchWorkouts } from "../api";

type Workout = {
  _id: string;
  date: string; // ISO string
  time: string;
  exercises: string[];
  notes?: string;
};
type ChartView = "month" | "weekday" | "trend";

const [activeChart, setActiveChart] = useState<ChartView>("month");
// helper: YYYY-MM
const monthKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

const monthLabel = (d: Date) =>
  d.toLocaleString("pl-PL", { month: "short", year: "numeric" });

const Statistics = () => {
  const navigate = useNavigate();

  const [workouts, setWorkouts] = useState<Workout[]>([]);

  // ✅ pobierz treningi z bazy
  useEffect(() => {
    fetchWorkouts()
      .then(setWorkouts)
      .catch(console.error);
  }, []);

  // ✅ 1) ile treningów w miesiącu
  const workoutsByMonth = useMemo(() => {
    const map = new Map<string, { key: string; label: string; count: number }>();

    for (const w of workouts) {
      const d = new Date(w.date);
      const key = monthKey(d);
      const label = monthLabel(d);

      if (map.has(key)) {
        map.get(key)!.count += 1;
      } else {
        map.set(key, { key, label, count: 1 });
      }
    }

    return Array.from(map.values()).sort((a, b) => a.key.localeCompare(b.key));
  }, [workouts]);

  // ✅ 2) ile treningów w dni tygodnia
  const workoutsByWeekday = useMemo(() => {
    const labels = ["Nd", "Pn", "Wt", "Śr", "Czw", "Pt", "Sb"];
    const counts = Array(7).fill(0);

    for (const w of workouts) {
      const day = new Date(w.date).getDay();
      counts[day] += 1;
    }

    return labels.map((label, i) => ({ label, count: counts[i] }));
  }, [workouts]);

  // ✅ 3) trend: treningi dziennie (linia)
  const workoutsByDay = useMemo(() => {
    const map = new Map<string, number>(); // YYYY-MM-DD -> count

    for (const w of workouts) {
      const key = new Date(w.date).toISOString().slice(0, 10);
      map.set(key, (map.get(key) ?? 0) + 1);
    }

    return Array.from(map.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [workouts]);

  // ✅ mini statystyki liczbowo
  const totalWorkouts = workouts.length;
  const totalExercises = workouts.reduce((sum, w) => sum + (w.exercises?.length ?? 0), 0);
  const avgExercises = totalWorkouts > 0 ? (totalExercises / totalWorkouts).toFixed(1) : "0";

  return (
  <div className="stats-page">
    <h1 style={{ marginBottom: "1rem" }}>Statystyki</h1>

    <Button onClick={() => navigate("/")}>Wróć do strony głównej</Button>

    <div className="stats-layout">
      
      {/* ✅ LEWA STRONA - 3 karty w jednym divie */}
      <div className="stats-left">
        <div className="stat-card">
          <h3>Łącznie treningów</h3>
          <div className="stat-value">{totalWorkouts}</div>
        </div>

        <div className="stat-card">
          <h3>Łącznie ćwiczeń</h3>
          <div className="stat-value">{totalExercises}</div>
        </div>

        <div className="stat-card">
          <h3>Średnio ćwiczeń / trening</h3>
          <div className="stat-value">{avgExercises}</div>
        </div>
      </div>

      {/* ✅ PRAWA STRONA - wykresy koło siebie */}
      <div className="stats-right">
        <div className="charts-grid">
          
          <div className="chart-box">
            <h2>Treningi w miesiącach</h2>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={workoutsByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-box">
            <h2>Treningi według dnia tygodnia</h2>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={workoutsByWeekday}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* trzeci wykres pod spodem na całą szerokość */}
        <div className="chart-box">
          <h2>Trend (treningi w czasie)</h2>
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <LineChart data={workoutsByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line dataKey="count" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  </div>
);

};

export default Statistics;
