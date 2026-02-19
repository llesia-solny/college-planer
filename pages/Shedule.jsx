import { useEffect, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import LessonCard from "../components/LessonCard";

const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];

function Schedule() {
  const [selectedDay, setSelectedDay] = useState("monday");
  const [lessons, setLessons] = useState([]);
  const [newLesson, setNewLesson] = useState("");

  // 🔥 Загрузка + realtime
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "schedule", selectedDay),
      (docSnap) => {
        if (docSnap.exists()) {
          setLessons(docSnap.data().lessons);
        } else {
          setLessons([]);
        }
      }
    );

    return () => unsub();
  }, [selectedDay]);

  // 🔥 Сохранение
  const saveLessons = async (updatedLessons) => {
    await setDoc(doc(db, "schedule", selectedDay), {
      lessons: updatedLessons,
    });
  };

  const addLesson = async () => {
    if (!newLesson.trim()) return;

    const updated = [...lessons, newLesson];
    await saveLessons(updated);
    setNewLesson("");
  };

  const deleteLesson = async (index) => {
    const updated = lessons.filter((_, i) => i !== index);
    await saveLessons(updated);
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Расписание</h1>

      {/* Переключение дней */}
      <div style={{ marginBottom: "20px" }}>
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            style={{
              marginRight: "10px",
              padding: "8px 15px",
              background:
                selectedDay === day ? "#6366f1" : "#e5e7eb",
              color: selectedDay === day ? "white" : "black",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Добавление урока */}
      <div style={{ marginBottom: "20px" }}>
        <input
          value={newLesson}
          onChange={(e) => setNewLesson(e.target.value)}
          placeholder="Введите урок"
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginRight: "10px",
          }}
        />
        <button
          onClick={addLesson}
          style={{
            padding: "10px 15px",
            borderRadius: "8px",
            background: "#10b981",
            color: "white",
            border: "none",
          }}
        >
          Добавить
        </button>
      </div>

      {/* Список уроков */}
      {lessons.map((lesson, index) => (
        <LessonCard
          key={index}
          lesson={lesson}
          onDelete={() => deleteLesson(index)}
        />
      ))}
    </div>
  );
}

export default Schedule;
