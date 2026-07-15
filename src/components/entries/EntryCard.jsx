import { getCategory } from "../../utils/categoryHelpers";

export default function EntryCard({ entry, onDelete }) {
  const category = getCategory(entry.category);

  const getValue = (field) => {
    const value = entry.data?.[field.id];

    if (value === undefined || value === null || value === "") {
      return "";
    }

    if (field.type === "number" && category?.unit) {
      return `${value} ${category.unit}`;
    }

    return value;
  };

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

      {category?.fields.map((field) => (
        <p key={field.id}>
          <strong>{field.label}:</strong> {getValue(field)}
        </p>
      ))}

      <button onClick={() => onDelete(entry.id)}>
        Delete
      </button>
    </div>
  );
}