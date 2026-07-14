export default function EntryCard({ entry, onDelete }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "15px",
        marginBottom: "10px",
      }}
    >
      <h3>
        {entry.emoji} {entry.name}
      </h3>

      <p>
        {entry.value} {entry.unit}
      </p>

      <button onClick={() => onDelete(entry.id)}>
        Delete
      </button>
    </div>
  );
}