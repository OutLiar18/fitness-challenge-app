import MultiSelect from "../common/Selector/MultiSelect";
import {
  EQUIPMENT_OPTIONS,
  MOVEMENT_PATTERN_OPTIONS,
  MUSCLE_OPTIONS,
  DIFFICULTY_OPTIONS,
} from "../../constants/libraries/exerciseMetaDataLibrary";
import SmartSelect from "../common/Selector/SmartSelect";

import { getExercisesByCategory } from "../../services/exerciseOptionService";

import {
  getExercise,
  isHoldExercise,
} from "../../services/exerciseLibraryService";

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
    source: "",
    exerciseDefinition: null,
    suggestionStatus: "",
    sets: [createEmptySet()],
  };
}

function createCustomExerciseDefinition(name, category) {
  return {
    name,
    aliases: [],
    category,
    type: "",
    exerciseType: "",
    proposedTier: "",
    equipment: "",
    movementPattern: "",
    primaryMuscles: [],
    secondaryMuscles: [],
  };
}

function normalizeExercise(exercise) {
  if (Array.isArray(exercise?.sets)) {
    return {
      exercise: exercise.exercise || "",
      source:
        exercise.source || (exercise.exerciseDefinition ? "custom" : "library"),

      exerciseDefinition: exercise.exerciseDefinition || null,

      suggestionStatus:
        exercise.suggestionStatus ||
        (exercise.exerciseDefinition ? "pending" : ""),

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
    source:
      exercise?.source || (exercise?.exerciseDefinition ? "custom" : "library"),

    exerciseDefinition: exercise?.exerciseDefinition || null,

    suggestionStatus:
      exercise?.suggestionStatus ||
      (exercise?.exerciseDefinition ? "pending" : ""),

    sets: Array.from({ length: numberOfSets }, () => ({
      reps: exercise?.reps ?? "",
      seconds: exercise?.seconds ?? "",
      weight: exercise?.weight ?? "",
    })),
  };
}

function isCustomExercise(exercise) {
  return exercise?.source === "custom" || Boolean(exercise?.exerciseDefinition);
}

function getExerciseType(exercise) {
  if (isCustomExercise(exercise)) {
    return exercise.exerciseDefinition?.exerciseType || "";
  }

  if (isHoldExercise(exercise.exercise)) {
    return "hold";
  }

  if (getExercise(exercise.exercise)) {
    return "repetition";
  }

  return "";
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

  const updateExerciseName = (exerciseIndex, value, selectionDetails = {}) => {
    const customExercise = selectionDetails.isCustom === true;

    const updatedExercises = exercises.map((exercise, index) => {
      if (index !== exerciseIndex) {
        return exercise;
      }

      if (customExercise) {
        return {
          ...exercise,
          exercise: value,
          source: "custom",
          suggestionStatus: "pending",
          exerciseDefinition: createCustomExerciseDefinition(value, category),

          sets: exercise.sets.map((set) => ({
            ...set,
            reps: "",
            seconds: "",
          })),
        };
      }

      const selectedExercise = getExercise(value);

      return {
        ...exercise,
        exercise: value,
        source: "library",
        suggestionStatus: "",
        exerciseDefinition: null,

        sets: exercise.sets.map((set) => ({
          ...set,

          reps: selectedExercise?.exerciseType === "hold" ? "" : set.reps,

          seconds: selectedExercise?.exerciseType === "hold" ? set.seconds : "",
        })),
      };
    });

    updateExercises(updatedExercises);
  };

  const updateCustomDefinition = (exerciseIndex, field, value) => {
    const updatedExercises = exercises.map((exercise, index) => {
      if (index !== exerciseIndex) {
        return exercise;
      }

      const previousType = exercise.exerciseDefinition?.exerciseType || "";

      const nextDefinition = {
        ...exercise.exerciseDefinition,
        [field]: value,
      };

      if (field === "exerciseType") {
        nextDefinition.type = value === "hold" ? "hold" : "dynamic";
      }

      let updatedSets = exercise.sets;

      if (field === "exerciseType" && previousType !== value) {
        updatedSets = exercise.sets.map((set) => ({
          ...set,
          reps: value === "hold" ? "" : set.reps,
          seconds: value === "hold" ? set.seconds : "",
        }));
      }

      return {
        ...exercise,
        exerciseDefinition: nextDefinition,
        sets: updatedSets,
      };
    });

    updateExercises(updatedExercises);
  };

  const updateSet = (exerciseIndex, setIndex, field, value) => {
    const updatedExercises = exercises.map((exercise, currentExerciseIndex) => {
      if (currentExerciseIndex !== exerciseIndex) {
        return exercise;
      }

      const exerciseType = getExerciseType(exercise);

      return {
        ...exercise,

        sets: exercise.sets.map((set, currentSetIndex) => {
          if (currentSetIndex !== setIndex) {
            return set;
          }

          const updatedSet = {
            ...set,
            [field]: value,
          };

          if (exerciseType === "hold") {
            updatedSet.reps = "";
          }

          if (exerciseType === "repetition") {
            updatedSet.seconds = "";
          }

          return updatedSet;
        }),
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
      {exercises.map((exercise, exerciseIndex) => {
        const customExercise = isCustomExercise(exercise);

        const exerciseType = getExerciseType(exercise);

        const holdExercise = exerciseType === "hold";

        const repetitionExercise = exerciseType === "repetition";

        return (
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
              <h4 style={{ margin: 0 }}>Exercise {exerciseIndex + 1}</h4>

              {!readOnly && exercises.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeExercise(exerciseIndex)}
                >
                  Remove Exercise
                </button>
              )}
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label>
                <strong>Exercise *</strong>
              </label>

              <SmartSelect
                label="Exercise"
                value={exercise.exercise || ""}
                options={exerciseOptions}
                disabled={readOnly}
                allowCustom
                customOptionLabel="Suggest new exercise"
                onChange={(value, selectionDetails) =>
                  updateExerciseName(exerciseIndex, value, selectionDetails)
                }
              />
            </div>

            {customExercise && (
              <div
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "15px",
                  marginBottom: "15px",
                }}
              >
                <h5 style={{ marginTop: 0 }}>Suggest New Exercise</h5>

                <p>
                  This exercise is not currently in the library. Add its details
                  so it can be logged correctly and reviewed by an
                  administrator.
                </p>

                <div style={{ marginBottom: "15px" }}>
                  <label>
                    <strong>Exercise Type *</strong>
                  </label>

                  <select
                    disabled={readOnly}
                    value={exercise.exerciseDefinition?.exerciseType || ""}
                    onChange={(event) =>
                      updateCustomDefinition(
                        exerciseIndex,
                        "exerciseType",
                        event.target.value,
                      )
                    }
                  >
                    <option value="">Select exercise type...</option>

                    <option value="repetition">Repetition exercise</option>

                    <option value="hold">Timed hold exercise</option>
                  </select>
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <label>
                    <strong>Suggested Difficulty *</strong>
                  </label>

                  <select
                    disabled={readOnly}
                    value={exercise.exerciseDefinition?.proposedTier || ""}
                    onChange={(event) =>
                      updateCustomDefinition(
                        exerciseIndex,
                        "proposedTier",
                        event.target.value === ""
                          ? ""
                          : Number(event.target.value),
                      )
                    }
                  >
                    <option value="">Select difficulty...</option>

                    {DIFFICULTY_OPTIONS.map((difficulty) => (
                      <option key={difficulty.tier} value={difficulty.tier}>
                        {difficulty.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <label>
                    <strong>Equipment *</strong>
                  </label>

                  <select
                    disabled={readOnly}
                    value={exercise.exerciseDefinition?.equipment || ""}
                    onChange={(event) =>
                      updateCustomDefinition(
                        exerciseIndex,
                        "equipment",
                        event.target.value,
                      )
                    }
                  >
                    <option value="">Select equipment...</option>

                    {EQUIPMENT_OPTIONS.map((equipment) => (
                      <option key={equipment} value={equipment}>
                        {equipment}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <label>
                    <strong>Movement Pattern</strong>
                  </label>

                  <select
                    disabled={readOnly}
                    value={exercise.exerciseDefinition?.movementPattern || ""}
                    onChange={(event) =>
                      updateCustomDefinition(
                        exerciseIndex,
                        "movementPattern",
                        event.target.value,
                      )
                    }
                  >
                    <option value="">Select movement pattern...</option>

                    {MOVEMENT_PATTERN_OPTIONS.map((pattern) => (
                      <option key={pattern} value={pattern}>
                        {pattern}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <MultiSelect
                    label="Primary Muscles *"
                    options={MUSCLE_OPTIONS}
                    value={exercise.exerciseDefinition?.primaryMuscles || []}
                    disabled={readOnly}
                    placeholder="Select primary muscles..."
                    onChange={(value) =>
                      updateCustomDefinition(
                        exerciseIndex,
                        "primaryMuscles",
                        value,
                      )
                    }
                  />
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <MultiSelect
                    label="Secondary Muscles"
                    options={MUSCLE_OPTIONS}
                    value={exercise.exerciseDefinition?.secondaryMuscles || []}
                    disabled={readOnly}
                    placeholder="Select secondary muscles..."
                    onChange={(value) =>
                      updateCustomDefinition(
                        exerciseIndex,
                        "secondaryMuscles",
                        value,
                      )
                    }
                  />
                </div>
              </div>
            )}

            {!exerciseType && exercise.exercise && (
              <p>
                Select whether this is a repetition or timed-hold exercise
                before adding sets.
              </p>
            )}

            {exerciseType &&
              exercise.sets.map((set, setIndex) => (
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

                  {repetitionExercise && (
                    <div style={{ marginBottom: "15px" }}>
                      <label>
                        <strong>Reps *</strong>
                      </label>

                      <input
                        type="number"
                        min="1"
                        step="1"
                        disabled={readOnly}
                        placeholder="Number of repetitions"
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
                  )}

                  {holdExercise && (
                    <div style={{ marginBottom: "15px" }}>
                      <label>
                        <strong>Hold Time (seconds) *</strong>
                      </label>

                      <input
                        type="number"
                        min="1"
                        step="1"
                        disabled={readOnly}
                        placeholder="Duration in seconds"
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
                  )}

                  <div style={{ marginBottom: "15px" }}>
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

            {!readOnly && exerciseType && (
              <button type="button" onClick={() => addSet(exerciseIndex)}>
                + Add Set
              </button>
            )}
          </div>
        );
      })}

      {!readOnly && (
        <button type="button" onClick={addExercise}>
          + Add Exercise
        </button>
      )}
    </>
  );
}
