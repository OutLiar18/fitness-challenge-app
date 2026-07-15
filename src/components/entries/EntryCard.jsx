import { getCategory } from "../../utils/categoryHelpers";
import { getUnit } from "../../utils/units";
import { calculateEntryPoints } from "../../services/pointsService";

export default function EntryCard({ entry, onDelete }) {
  const category = getCategory(entry.category);
  const points = calculateEntryPoints(entry);

  if (!category) return null;

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
        {category.emoji} {category.name}
      </h3>

      {category.fields.map((field) => {
        const value = entry.data?.[field.id];

        if (value === undefined || value === null || value === "") {
          return null;
        }

        const unit = getUnit(field.id);

        return (
          <p key={field.id}>
            <strong>{field.label}:</strong> {value}
            {unit ? ` ${unit}` : ""}
          </p>
        );
      })}
      <hr />

      <p>
        <strong>⭐ Points:</strong> {points}
      </p>
      <button onClick={() => onDelete(entry.id)}>Delete</button>
    </div>
  );
}
