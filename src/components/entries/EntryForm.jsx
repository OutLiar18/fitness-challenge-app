import { getCategory } from "../../utils/categoryHelpers";
import { OPTIONS } from "../../constants/options";
import SmartSelect from "../common/SmartSelect/SmartSelect";
export default function EntryForm({
  type,
  formData,
  setFormData,
  onSave,
}) {
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
        <div
          key={field.id}
          style={{ marginBottom: "15px" }}
        >
          <label>
            <strong>{field.label}</strong>
          </label>

          <br />

          {field.type === "number" && (
            <input
              type="number"
              value={formData[field.id] || ""}
              placeholder={field.placeholder || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [field.id]: Number(e.target.value),
                })
              }
            />
          )}

          {field.type === "text" && (
            <input
              type="text"
              value={formData[field.id] || ""}
              placeholder={field.placeholder || field.label}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [field.id]: e.target.value,
                })
              }
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
            <SmartSelect
              label={field.label}
              value={formData[field.id] || ""}
              options={OPTIONS[field.id] || []}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  [field.id]: value,
                })
              }
            />
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={onSave}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Save Entry
      </button>
    </div>
  );
}