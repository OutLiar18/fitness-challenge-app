import { getCategory } from "../../utils/categoryHelpers";
import { OPTIONS } from "../../constants/options";

export default function EntryForm({ type, formData, setFormData, onSave }) {
  const category = getCategory(type);

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "20px",
        marginBottom: "20px",
      }}
    >
      <h2>
        {category.emoji} {category.name}
      </h2>

      {category.fields.map((field) => (
        <div key={field.id} style={{ marginBottom: "15px" }}>
          <label>
            <strong>{field.label}</strong>
          </label>

          <br />

          {field.type === "number" && (
            <input
              type="number"
              value={formData[field.id] || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [field.id]: Number(e.target.value),
                })
              }
              placeholder={field.placeholder || ""}
            />
          )}

          {field.type === "text" && (
            <input
              type="text"
              value={formData[field.id] || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [field.id]: e.target.value,
                })
              }
              placeholder={field.label}
            />
          )}

          {field.type === "textarea" && (
            <textarea
              rows={4}
              value={formData[field.id] || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [field.id]: e.target.value,
                })
              }
            />
          )}

          {field.type === "select" && (
            <select
              value={formData[field.id] || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [field.id]: e.target.value,
                })
              }
            >
              <option value="">Select...</option>

              {(OPTIONS[field.id] || []).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}

          {field.type === "image" && <input type="file" />}
        </div>
      ))}

      <button onClick={onSave}>Save Entry</button>
    </div>
  );
}
