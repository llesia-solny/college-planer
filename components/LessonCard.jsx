function LessonCard({ lesson, onDelete }) {
  return (
    <div
      style={{
        padding: "15px",
        marginBottom: "10px",
        background: "rgba(255,255,255,0.2)",
        backdropFilter: "blur(10px)",
        borderRadius: "12px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <span>{lesson}</span>
      <button
        onClick={onDelete}
        style={{
          background: "#ef4444",
          color: "white",
          border: "none",
          borderRadius: "6px",
          padding: "5px 10px",
          cursor: "pointer",
        }}
      >
        Удалить
      </button>
    </div>
  );
}

export default LessonCard;
