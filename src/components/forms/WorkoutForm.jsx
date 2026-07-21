import { OPTIONS } from "../../constants/options";
import SmartSelect from "../common/SmartSelect/SmartSelect";

export default function WorkoutForm({
  category,
  formData,
  setFormData,
  readOnly,
}) {
  return (
    <>
      {/* Exercise */}
      <div style={{ marginBottom: "15px" }}>
        <label>
          <strong>Exercise</strong>
        </label>

        <SmartSelect
          label="Exercise"
          value={formData.exercise || ""}
          options={OPTIONS.exercise || []}
          disabled={readOnly}
          onChange={(value) =>
            setFormData({
              ...formData,
              exercise: value,
            })
          }
        />
      </div>

      {/* Sets */}
      <div style={{ marginBottom: "15px" }}>
        <label>
          <strong>Sets *</strong>
        </label>

        <input
          type="number"
          disabled={readOnly}
          value={formData.sets || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              sets: Number(e.target.value),
            })
          }
        />
      </div>

      {/* Reps */}
      <div style={{ marginBottom: "15px" }}>
        <label>
          <strong>Reps *</strong>
        </label>

        <input
          type="number"
          disabled={readOnly}
          value={formData.reps || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              reps: Number(e.target.value),
            })
          }
        />
      </div>

      {/* Weight */}
      <div style={{ marginBottom: "15px" }}>
        <label>
          <strong>Weight (Optional)</strong>
        </label>

        <input
          type="number"
          disabled={readOnly}
          value={formData.weight || ""}
          placeholder="kg"
          onChange={(e) =>
            setFormData({
              ...formData,
              weight: Number(e.target.value),
            })
          }
        />
      </div>
    </>
  );
}