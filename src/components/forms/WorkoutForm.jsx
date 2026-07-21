import SmartSelect from "../common/SmartSelect/SmartSelect";
import { getExercisesByCategory } from "../../services/exerciseOptionService";

export default function WorkoutForm({
  category,
  formData,
  setFormData,
  readOnly,
}) {
  const exercises = getExercisesByCategory(category);

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
          options={exercises}
          onChange={(value) =>
            setFormData({
              ...formData,
              exercise: value,
            })
          }
          disabled={readOnly}
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
          placeholder="kg"
          value={formData.weight || ""}
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