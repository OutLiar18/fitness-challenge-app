import SmartSelect from "../common/SmartSelect/SmartSelect";
import { getExercisesByCategory } from "../../services/exerciseOptionService";

export default function WorkoutForm({
  category,
  formData,
  setFormData,
  readOnly,
}) {
  const exerciseOptions = getExercisesByCategory(category);

  const currentExercise = formData.exercises?.[0] || {
    exercise: "",
    sets: "",
    reps: "",
    weight: "",
    seconds: 0,
  };

  const updateExercise = (field, value) => {
    setFormData({
      ...formData,
      exercises: [
        {
          ...currentExercise,
          [field]: value,
        },
      ],
    });
  };

  return (
    <>
      <div style={{ marginBottom: "15px" }}>
        <label>
          <strong>Exercise *</strong>
        </label>

        <SmartSelect
          label="Exercise"
          value={currentExercise.exercise || ""}
          options={exerciseOptions}
          disabled={readOnly}
          onChange={(value) => updateExercise("exercise", value)}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>
          <strong>Sets *</strong>
        </label>

        <input
          type="number"
          min="1"
          disabled={readOnly}
          value={currentExercise.sets ?? ""}
          onChange={(event) =>
            updateExercise(
              "sets",
              event.target.value === ""
                ? ""
                : Number(event.target.value),
            )
          }
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>
          <strong>Reps *</strong>
        </label>

        <input
          type="number"
          min="1"
          disabled={readOnly}
          value={currentExercise.reps ?? ""}
          onChange={(event) =>
            updateExercise(
              "reps",
              event.target.value === ""
                ? ""
                : Number(event.target.value),
            )
          }
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>
          <strong>Weight (Optional)</strong>
        </label>

        <input
          type="number"
          min="0"
          step="0.1"
          disabled={readOnly}
          placeholder="kg"
          value={currentExercise.weight ?? ""}
          onChange={(event) =>
            updateExercise(
              "weight",
              event.target.value === ""
                ? ""
                : Number(event.target.value),
            )
          }
        />
      </div>
    </>
  );
}