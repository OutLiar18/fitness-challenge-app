import { useMemo } from "react";
import useGlobalLibrary from "../../hooks/useGlobalLibrary";
import {
  DIFFICULTY_OPTIONS,
  EQUIPMENT_OPTIONS,
  MOVEMENT_PATTERN_OPTIONS,
  MUSCLE_OPTIONS,
} from "../../constants/libraries/exerciseMetaDataLibrary";
import {
  getExercise,
  getExerciseNamesByCategory,
} from "../../services/libraries/exerciseLibraryService";
import { mergeLibraryNames } from "../../services/libraries/globalLibraryModel";
import NumberInput from "../common/Form/NumberInput";
import MultiSelect from "../common/Selector/MultiSelect";
import SmartSelect from "../common/Selector/SmartSelect";
import "./FormSections.css";

function createEmptySet() {
  return { reps: "", seconds: "", weight: "" };
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

function normalizeSet(set = {}) {
  return {
    reps: set.reps ?? "",
    seconds: set.seconds ?? "",
    weight: set.weight ?? "",
  };
}

function normalizeExercise(exercise = {}) {
  const custom = exercise.source === "custom";
  const published = exercise.source === "published";

  if (Array.isArray(exercise.sets)) {
    return {
      exercise: exercise.exercise ?? "",
      source: exercise.source || (custom ? "custom" : published ? "published" : "library"),
      exerciseDefinition: exercise.exerciseDefinition ?? null,
      suggestionStatus:
        exercise.suggestionStatus || (custom ? "pending" : ""),
      sets:
        exercise.sets.length > 0
          ? exercise.sets.map(normalizeSet)
          : [createEmptySet()],
    };
  }

  const numberOfSets = Math.max(Number(exercise.sets ?? 1), 1);

  return {
    exercise: exercise.exercise ?? "",
    source: exercise.source || (custom ? "custom" : published ? "published" : "library"),
    exerciseDefinition: exercise.exerciseDefinition ?? null,
    suggestionStatus: exercise.suggestionStatus || (custom ? "pending" : ""),
    sets: Array.from({ length: numberOfSets }, () =>
      normalizeSet({
        reps: exercise.reps,
        seconds: exercise.seconds,
        weight: exercise.weight,
      }),
    ),
  };
}

function getExercises(formData = {}) {
  return Array.isArray(formData.exercises) && formData.exercises.length > 0
    ? formData.exercises.map(normalizeExercise)
    : [createEmptyExercise()];
}

function getExerciseType(exercise) {
  if (["custom", "published"].includes(exercise.source)) {
    return exercise.exerciseDefinition?.exerciseType ?? "";
  }

  return getExercise(exercise.exercise)?.exerciseType ?? "";
}

export default function WorkoutForm({
  category,
  formData,
  setFormData,
  readOnly = false,
}) {
  const { exercises: publishedExercises, findItem } = useGlobalLibrary();

  const categoryPublishedExercises = useMemo(
    () =>
      publishedExercises.filter(
        (item) => item.definition?.category === category,
      ),
    [category, publishedExercises],
  );

  const exerciseOptions = useMemo(
    () =>
      mergeLibraryNames(
        getExerciseNamesByCategory(category),
        categoryPublishedExercises,
      ),
    [category, categoryPublishedExercises],
  );
  const exercises = getExercises(formData);

  function updateExercises(updater) {
    setFormData((currentData) => ({
      ...currentData,
      exercises: updater(getExercises(currentData)),
    }));
  }

  function updateExerciseName(exerciseIndex, value, details = {}) {
    updateExercises((currentExercises) =>
      currentExercises.map((exercise, index) => {
        if (index !== exerciseIndex) {
          return exercise;
        }

        if (details.isCustom === true) {
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

        const publishedItem = findItem("exercise", value);
        const definition = publishedItem?.definition ?? getExercise(value);
        const hold = definition?.exerciseType === "hold";

        return {
          ...exercise,
          exercise: value,
          source: publishedItem ? "published" : "library",
          suggestionStatus: "",
          exerciseDefinition: publishedItem ? definition : null,
          sets: exercise.sets.map((set) => ({
            ...set,
            reps: hold ? "" : set.reps,
            seconds: hold ? set.seconds : "",
          })),
        };
      }),
    );
  }

  function updateCustomDefinition(exerciseIndex, field, value) {
    updateExercises((currentExercises) =>
      currentExercises.map((exercise, index) => {
        if (index !== exerciseIndex) {
          return exercise;
        }

        const previousType = exercise.exerciseDefinition?.exerciseType ?? "";
        const nextDefinition = {
          ...exercise.exerciseDefinition,
          [field]: value,
        };

        if (field === "exerciseType") {
          nextDefinition.type = value === "hold" ? "hold" : "dynamic";
        }

        return {
          ...exercise,
          exerciseDefinition: nextDefinition,
          sets:
            field === "exerciseType" && value !== previousType
              ? exercise.sets.map((set) => ({
                  ...set,
                  reps: value === "hold" ? "" : set.reps,
                  seconds: value === "hold" ? set.seconds : "",
                }))
              : exercise.sets,
        };
      }),
    );
  }

  function updateSet(exerciseIndex, setIndex, field, value) {
    updateExercises((currentExercises) =>
      currentExercises.map((exercise, currentExerciseIndex) => {
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

            return {
              ...set,
              [field]: value,
              ...(exerciseType === "hold" ? { reps: "" } : {}),
              ...(exerciseType === "repetition" ? { seconds: "" } : {}),
            };
          }),
        };
      }),
    );
  }

  function addExercise() {
    updateExercises((currentExercises) => [
      ...currentExercises,
      createEmptyExercise(),
    ]);
  }

  function removeExercise(exerciseIndex) {
    updateExercises((currentExercises) =>
      currentExercises.length === 1
        ? currentExercises
        : currentExercises.filter((_, index) => index !== exerciseIndex),
    );
  }

  function addSet(exerciseIndex) {
    updateExercises((currentExercises) =>
      currentExercises.map((exercise, index) =>
        index === exerciseIndex
          ? { ...exercise, sets: [...exercise.sets, createEmptySet()] }
          : exercise,
      ),
    );
  }

  function duplicateSet(exerciseIndex, setIndex) {
    updateExercises((currentExercises) =>
      currentExercises.map((exercise, index) => {
        if (index !== exerciseIndex) {
          return exercise;
        }

        return {
          ...exercise,
          sets: [
            ...exercise.sets.slice(0, setIndex + 1),
            { ...exercise.sets[setIndex] },
            ...exercise.sets.slice(setIndex + 1),
          ],
        };
      }),
    );
  }

  function removeSet(exerciseIndex, setIndex) {
    updateExercises((currentExercises) =>
      currentExercises.map((exercise, index) =>
        index === exerciseIndex && exercise.sets.length > 1
          ? {
              ...exercise,
              sets: exercise.sets.filter((_, indexToRemove) => indexToRemove !== setIndex),
            }
          : exercise,
      ),
    );
  }

  return (
    <div className="workout-builder">
      {exercises.map((exercise, exerciseIndex) => {
        const exerciseType = getExerciseType(exercise);
        const customExercise = exercise.source === "custom";

        return (
          <section className="workout-exercise" key={`exercise-${exerciseIndex}`}>
            <div className="workout-exercise__header">
              <p className="workout-exercise__index">
                <span aria-hidden="true">{exerciseIndex + 1}</span>
                Exercise
              </p>

              {!readOnly && exercises.length > 1 && (
                <button
                  className="button button--danger button--compact"
                  type="button"
                  onClick={() => removeExercise(exerciseIndex)}
                >
                  Remove exercise
                </button>
              )}
            </div>

            <SmartSelect
              label="Exercise"
              required
              value={exercise.exercise}
              options={exerciseOptions}
              disabled={readOnly}
              allowCustom
              customOptionLabel="Suggest new exercise"
              onChange={(value, details) =>
                updateExerciseName(exerciseIndex, value, details)
              }
            />

            {customExercise && (
              <section
                className="form-section"
                aria-labelledby={`custom-exercise-${exerciseIndex}`}
              >
                <div className="form-section__header">
                  <h3 id={`custom-exercise-${exerciseIndex}`}>
                    New exercise details
                  </h3>
                  <p>
                    These details determine how the exercise scores while it is
                    waiting for library review.
                  </p>
                </div>

                <div className="form-section__grid">
                  <label htmlFor={`exercise-type-${exerciseIndex}`}>
                    Tracking method <span className="form-required">*</span>
                    <select
                      id={`exercise-type-${exerciseIndex}`}
                      disabled={readOnly}
                      value={exercise.exerciseDefinition?.exerciseType ?? ""}
                      onChange={(event) =>
                        updateCustomDefinition(
                          exerciseIndex,
                          "exerciseType",
                          event.target.value,
                        )
                      }
                    >
                      <option value="">Select a method…</option>
                      <option value="repetition">Repetitions</option>
                      <option value="hold">Timed hold</option>
                    </select>
                  </label>

                  <label htmlFor={`exercise-tier-${exerciseIndex}`}>
                    Difficulty <span className="form-required">*</span>
                    <select
                      id={`exercise-tier-${exerciseIndex}`}
                      disabled={readOnly}
                      value={exercise.exerciseDefinition?.proposedTier ?? ""}
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
                      <option value="">Select difficulty…</option>
                      {DIFFICULTY_OPTIONS.map((option) => (
                        <option key={option.tier} value={option.tier}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label htmlFor={`exercise-equipment-${exerciseIndex}`}>
                    Equipment <span className="form-required">*</span>
                    <select
                      id={`exercise-equipment-${exerciseIndex}`}
                      disabled={readOnly}
                      value={exercise.exerciseDefinition?.equipment ?? ""}
                      onChange={(event) =>
                        updateCustomDefinition(
                          exerciseIndex,
                          "equipment",
                          event.target.value,
                        )
                      }
                    >
                      <option value="">Select equipment…</option>
                      {EQUIPMENT_OPTIONS.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </label>

                  <label htmlFor={`exercise-pattern-${exerciseIndex}`}>
                    Movement pattern
                    <select
                      id={`exercise-pattern-${exerciseIndex}`}
                      disabled={readOnly}
                      value={exercise.exerciseDefinition?.movementPattern ?? ""}
                      onChange={(event) =>
                        updateCustomDefinition(
                          exerciseIndex,
                          "movementPattern",
                          event.target.value,
                        )
                      }
                    >
                      <option value="">Select a pattern…</option>
                      {MOVEMENT_PATTERN_OPTIONS.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <MultiSelect
                  label="Primary muscles"
                  required
                  options={MUSCLE_OPTIONS}
                  value={exercise.exerciseDefinition?.primaryMuscles ?? []}
                  disabled={readOnly}
                  placeholder="Select primary muscles…"
                  onChange={(value) =>
                    updateCustomDefinition(exerciseIndex, "primaryMuscles", value)
                  }
                />

                <MultiSelect
                  label="Secondary muscles"
                  options={MUSCLE_OPTIONS}
                  value={exercise.exerciseDefinition?.secondaryMuscles ?? []}
                  disabled={readOnly}
                  placeholder="Select secondary muscles…"
                  onChange={(value) =>
                    updateCustomDefinition(exerciseIndex, "secondaryMuscles", value)
                  }
                />
              </section>
            )}

            {!exerciseType && exercise.exercise && (
              <div className="inline-alert">
                Choose a tracking method before adding set details.
              </div>
            )}

            {exerciseType && (
              <div className="workout-sets">
                {exercise.sets.map((set, setIndex) => (
                  <section className="workout-set" key={`set-${setIndex}`}>
                    <div className="workout-set__header">
                      <strong>Set {setIndex + 1}</strong>

                      {!readOnly && (
                        <div className="workout-set__actions">
                          <button
                            className="button button--secondary button--compact"
                            type="button"
                            onClick={() => duplicateSet(exerciseIndex, setIndex)}
                          >
                            Duplicate
                          </button>
                          {exercise.sets.length > 1 && (
                            <button
                              className="button button--danger button--compact"
                              type="button"
                              onClick={() => removeSet(exerciseIndex, setIndex)}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="form-section__grid">
                      {exerciseType === "repetition" && (
                        <label htmlFor={`exercise-${exerciseIndex}-set-${setIndex}-reps`}>
                          Repetitions <span className="form-required">*</span>
                          <NumberInput
                            id={`exercise-${exerciseIndex}-set-${setIndex}-reps`}
                            min={1}
                            step={1}
                            inputMode="numeric"
                            readOnly={readOnly}
                            value={set.reps}
                            placeholder="Repetitions"
                            onChange={(value) =>
                              updateSet(exerciseIndex, setIndex, "reps", value)
                            }
                          />
                        </label>
                      )}

                      {exerciseType === "hold" && (
                        <label htmlFor={`exercise-${exerciseIndex}-set-${setIndex}-seconds`}>
                          Hold time (seconds) <span className="form-required">*</span>
                          <NumberInput
                            id={`exercise-${exerciseIndex}-set-${setIndex}-seconds`}
                            min={1}
                            step={1}
                            inputMode="numeric"
                            readOnly={readOnly}
                            value={set.seconds}
                            placeholder="Seconds"
                            onChange={(value) =>
                              updateSet(exerciseIndex, setIndex, "seconds", value)
                            }
                          />
                        </label>
                      )}

                      <label htmlFor={`exercise-${exerciseIndex}-set-${setIndex}-weight`}>
                        External weight (kilograms) <span className="form-help-inline">Optional</span>
                        <NumberInput
                          id={`exercise-${exerciseIndex}-set-${setIndex}-weight`}
                          min={0}
                          step={0.1}
                          readOnly={readOnly}
                          value={set.weight}
                          placeholder="0"
                          onChange={(value) =>
                            updateSet(exerciseIndex, setIndex, "weight", value)
                          }
                        />
                      </label>
                    </div>
                  </section>
                ))}

                {!readOnly && (
                  <button
                    className="button button--secondary"
                    type="button"
                    onClick={() => addSet(exerciseIndex)}
                  >
                    + Add set
                  </button>
                )}
              </div>
            )}
          </section>
        );
      })}

      {!readOnly && (
        <div className="workout-builder__footer">
          <button className="button button--secondary" type="button" onClick={addExercise}>
            + Add another exercise
          </button>
        </div>
      )}
    </div>
  );
}
