const API = "http://localhost:5000/api";

export type Exercise = {
   _id: string;
  name: string;
  bodyPart: string;
  series: number;
  reps: number;
  kg: number;
};

export type WorkoutCreateDto = {
  date: string;
  time: string;
  exercises: string[];
  notes?: string;
};

export async function fetchExercises(): Promise<Exercise[]> {
  const res = await fetch(`${API}/exercises`);
  if (!res.ok) throw new Error("Nie udało się pobrać ćwiczeń");
  return res.json();
}

export async function createWorkout(dto: WorkoutCreateDto) {
  const res = await fetch(`${API}/workouts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error("Nie udało się zapisać treningu");
  return res.json();
}

export async function updateWorkout(id: string, dto: WorkoutCreateDto) {
  const res = await fetch(`${API}/workouts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error("Nie udało się zaktualizować treningu");
  return res.json();
}

export async function deleteWorkout(id: string) {
  const res = await fetch(`${API}/workouts/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Nie udało się usunąć treningu");
  return res.json();
}

export async function fetchWorkouts() {
  const res = await fetch("http://localhost:5000/api/workouts");
  if (!res.ok) throw new Error("Failed to fetch workouts");
  return res.json();
}
