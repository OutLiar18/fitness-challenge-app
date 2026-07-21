import SmartSelect from "../common/SmartSelect/SmartSelect";
import { getExercisesByCategory } from "../../services/exerciseOptionService";

function createEmptySet() {
  return {
    reps: "",
    seconds: "",
    weight: "",
  };
}

function createEmptyExercise() {
  return {
    exercise: "",
    sets: [createEmptySet()],
  };
}

/*
  Temporarily supports the previous workout structure:

  {
    exercise,
    sets: 3,
    reps: 10,
    seconds: "",
    weight: 20
  }

  It converts that structure into three individual set objects.
*/
function normalizeExercise(exercise) {
  if (Array.isArray(exercise?.sets)) {
    return {
      exercise: exercise.exercise || "",
      sets:
        exercise.sets.length > 0
          ? exercise.sets.map((set) => ({
              reps: set.reps ?? "",
              seconds: set.seconds ?? "",
              weight: set.weight ?? "",
            }))
          : [createEmptySet()],
    };
  }

  const numberOfSets = Number(exercise?.sets) > 0 ? Number(exercise.sets) : 1;

  return {
    exercise: exercise?.exercise || "",
    sets: Array.from({ length: numberOfSets }, () => ({
      reps: exercise?.reps ?? "",
      seconds: exercise?.seconds ?? "",
      weight: exercise?.weight ?? "",
    })),
  };
}

export default function WorkoutForm({
  category,
  formData,
  setFormData,
  readOnly,
}) {
  const exerciseOptions = getExercisesByCategory(category);

  const exercises =
    Array.isArray(formData.exercises) && formData.exercises.length > 0
      ? formData.exercises.map(normalizeExercise)
      : [createEmptyExercise()];

  const updateExercises = (updatedExercises) => {
    setFormData({
      ...formData,
      exercises: updatedExercises,
    });
  };

  const updateExerciseName = (exerciseIndex, value) => {
    const updatedExercises = exercises.map((exercise, index) =>
      index === exerciseIndex
        ? {
            ...exercise,
            exercise: value,
          }
        : exercise,
    );

    updateExercises(updatedExercises);
  };

  const updateSet = (exerciseIndex, setIndex, field, value) => {
    const updatedExercises = exercises.map((exercise, currentExerciseIndex) => {
      if (currentExerciseIndex !== exerciseIndex) {
        return exercise;
      }

      return {
        ...exercise,
        sets: exercise.sets.map((set, currentSetIndex) =>
          currentSetIndex === setIndex
            ? {
                ...set,
                [field]: value,
              }
            : set,
        ),
      };
    });

    updateExercises(updatedExercises);
  };

  const addExercise = () => {
    updateExercises([...exercises, createEmptyExercise()]);
  };

  const removeExercise = (exerciseIndex) => {
    if (exercises.length === 1) {
      return;
    }

    updateExercises(exercises.filter((_, index) => index !== exerciseIndex));
  };

  const addSet = (exerciseIndex) => {
    const updatedExercises = exercises.map((exercise, index) =>
      index === exerciseIndex
        ? {
            ...exercise,
            sets: [...exercise.sets, createEmptySet()],
          }
        : exercise,
    );

    updateExercises(updatedExercises);
  };

  const duplicateSet = (exerciseIndex, setIndex) => {
    const updatedExercises = exercises.map((exercise, index) => {
      if (index !== exerciseIndex) {
        return exercise;
      }

      const setToDuplicate = {
        ...exercise.sets[setIndex],
      };

      return {
        ...exercise,
        sets: [
          ...exercise.sets.slice(0, setIndex + 1),
          setToDuplicate,
          ...exercise.sets.slice(setIndex + 1),
        ],
      };
    });

    updateExercises(updatedExercises);
  };

  const removeSet = (exerciseIndex, setIndex) => {
    const exercise = exercises[exerciseIndex];

    if (exercise.sets.length === 1) {
      return;
    }

    const updatedExercises = exercises.map(
      (currentExercise, currentExerciseIndex) =>
        currentExerciseIndex === exerciseIndex
          ? {
              ...currentExercise,
              sets: currentExercise.sets.filter(
                (_, index) => index !== setIndex,
              ),
            }
          : currentExercise,
    );

    updateExercises(updatedExercises);
  };

  return (
    <>
      {exercises.map((exercise, exerciseIndex) => (
        <div
          key={exerciseIndex}
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "15px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "10px",
              marginBottom: "15px",
            }}
          >
            <h4
              style={{
                margin: 0,
              }}
            >
              Exercise {exerciseIndex + 1}
            </h4>

            {!readOnly && exercises.length > 1 && (
              <button
                type="button"
                onClick={() => removeExercise(exerciseIndex)}
              >
                Remove Exercise
              </button>
            )}
          </div>

          <div
            style={{
              marginBottom: "15px",
            }}
          >
            <label>
              <strong>Exercise *</strong>
            </label>

            <SmartSelect
              label="Exercise"
              value={exercise.exercise || ""}
              options={exerciseOptions}
              disabled={readOnly}
              onChange={(value) => updateExerciseName(exerciseIndex, value)}
            />
          </div>

          {exercise.sets.map((set, setIndex) => (
            <div
              key={setIndex}
              style={{
                borderTop: "1px solid #eee",
                paddingTop: "15px",
                marginTop: setIndex === 0 ? "0" : "15px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px",
                }}
              >
                <strong>Set {setIndex + 1}</strong>

                {!readOnly && (
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => duplicateSet(exerciseIndex, setIndex)}
                    >
                      Duplicate
                    </button>

                    {exercise.sets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSet(exerciseIndex, setIndex)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div
                style={{
                  marginBottom: "15px",
                }}
              >
                <label>
                  <strong>Reps</strong>
                </label>

                <input
                  type="number"
                  min="1"
                  step="1"
                  disabled={readOnly}
                  placeholder="Leave blank for a hold"
                  value={set.reps ?? ""}
                  onWheel={(event) => event.currentTarget.blur()}
                  onChange={(event) =>
                    updateSet(
                      exerciseIndex,
                      setIndex,
                      "reps",
                      event.target.value === ""
                        ? ""
                        : Number(event.target.value),
                    )
                  }
                />
              </div>

              <div
                style={{
                  marginBottom: "15px",
                }}
              >
                <label>
                  <strong>Hold Time (seconds)</strong>
                </label>

                <input
                  type="number"
                  min="1"
                  step="1"
                  disabled={readOnly}
                  placeholder="Leave blank for reps"
                  value={set.seconds ?? ""}
                  onWheel={(event) => event.currentTarget.blur()}
                  onChange={(event) =>
                    updateSet(
                      exerciseIndex,
                      setIndex,
                      "seconds",
                      event.target.value === ""
                        ? ""
                        : Number(event.target.value),
                    )
                  }
                />
              </div>

              <div
                style={{
                  marginBottom: "15px",
                }}
              >
                <label>
                  <strong>External Weight (kg) — Optional</strong>
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.1"
                  disabled={readOnly}
                  placeholder="0"
                  value={set.weight ?? ""}
                  onWheel={(event) => event.currentTarget.blur()}
                  onChange={(event) =>
                    updateSet(
                      exerciseIndex,
                      setIndex,
                      "weight",
                      event.target.value === ""
                        ? ""
                        : Number(event.target.value),
                    )
                  }
                />
              </div>
            </div>
          ))}

          {!readOnly && (
            <button type="button" onClick={() => addSet(exerciseIndex)}>
              + Add Set
            </button>
          )}
        </div>
      ))}

      {!readOnly && (
        <button type="button" onClick={addExercise}>
          + Add Exercise
        </button>
      )}
    </>
  );
}
