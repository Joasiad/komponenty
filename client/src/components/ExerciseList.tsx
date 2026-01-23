import React, { useEffect, useMemo, useState } from "react";
import Button from "./button";
import "./ExerciseList.css";
import { PencilSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";

type Exercise = {
  _id: string;
  name: string;
  bodyPart: string;
  series: number;
  reps: number;
  kg: number;
};

type EditableExercise = Omit<Exercise, "_id">;

const API_URL = "http://localhost:5000/api/exercises";

const ExerciseList = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<EditableExercise>({
    name: "",
    bodyPart: "",
    series: 0,
    reps: 0,
    kg: 0,
  });

  const isEditing = useMemo(() => editingId !== null, [editingId]);//use memo zapamietuje wynik funckji

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data: Exercise[] = await res.json();
      setExercises(data);
    } catch {
      setError("Błąd pobierania ćwiczeń");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const startEdit = (ex: Exercise) => {
    setEditingId(ex._id);
    setDraft({
      name: ex.name,
      bodyPart: ex.bodyPart,
      series: ex.series,
      reps: ex.reps,
      kg: ex.kg,
    });
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async () => {
    if (!editingId || !draft.name.trim()) return;

    const res = await fetch(`${API_URL}/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });

    const updated: Exercise = await res.json();
    setExercises((prev) => prev.map((e) => (e._id === updated._id ? updated : e)));
    setEditingId(null);
  };

  const deleteExercise = async (id: string) => {
    if (!confirm("Usunąć ćwiczenie?")) return;

    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setExercises((prev) => prev.filter((e) => e._id !== id));
  };

  return (
    <div className="exercise-panel">
      <div className="exercise-header">
        <h2>Ćwiczenia w bazie</h2>
      </div>

      <div className="exercise-body">
        {loading && <div className="exercise-info">Ładowanie…</div>}
        {error && <div className="exercise-info">{error}</div>}

        <ul className="exercise-list">
          {exercises.map((ex) => {
            const editing = editingId === ex._id;

            return (
              <li key={ex._id} className="exercise-row">
                {editing ? (
                  <div className="exercise-edit-form">
                    <input
                      value={draft.name}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, name: e.target.value }))
                      }
                      placeholder="Nazwa"
                    />

                    <input
                      value={draft.bodyPart}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, bodyPart: e.target.value }))
                      }
                      placeholder="Część ciała"
                    />

                    <div className="exercise-edit-grid">
                      <input
                        type="number"
                        value={draft.series}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, series: Number(e.target.value) }))
                        }
                        placeholder="Serie"
                      />
                      <input
                        type="number"
                        value={draft.reps}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, reps: Number(e.target.value) }))
                        }
                        placeholder="Powt."
                      />
                      <input
                        type="number"
                        value={draft.kg}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, kg: Number(e.target.value) }))
                        }
                        placeholder="Kg"
                      />
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button className="exercise-primary-btn" onClick={saveEdit}>
                        Zapisz
                      </button>
                      <button
                        className="exercise-secondary-btn"
                        onClick={cancelEdit}
                      >
                        Anuluj
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="exercise-text">
                      {ex.name} – {ex.bodyPart} – {ex.series}x{ex.reps} – {ex.kg}kg
                    </div>

                    <div className="exercise-actions">
                      <button
                        className="exercise-mini-btn"
                        onClick={() => startEdit(ex)}
                      >
                        <PencilSquareIcon className="icon-small" />
                      </button>

                      <button
                        className="exercise-mini-btn"
                        onClick={() => deleteExercise(ex._id)}
                      >
                        <XMarkIcon className="icon-small" />
                      </button>
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>

        {!isEditing && (
          <button className="exercise-secondary-btn" onClick={load}>
            Odśwież listę
          </button>
        )}
      </div>
    </div>
  );
};

export default ExerciseList;
