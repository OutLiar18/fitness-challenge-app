import { getExercise, isHoldExercise } from "../libraries/exerciseLibraryService";

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

export function validateWorkoutEntry(data = {}) {
  const errors = [];

  const exercises = Array.isArray(data.exercises) ? data.exercises : [];

  if (exercises.length === 0) {
    return ["Please add an exercise."];
  }

  exercises.forEach((exercise, exerciseIndex) => {
    const exerciseNumber = exerciseIndex + 1;

    const name =
      typeof exercise?.exercise === "string" ? exercise.exercise.trim() : "";

    if (!name) {
      errors.push(`Exercise ${exerciseNumber}: exercise is required.`);

      return;
    }

    const libraryExercise = getExercise(name);
    const customExercise = isCustomExercise(exercise);

    if (!libraryExercise && !customExercise) {
      errors.push(
        `Exercise ${exerciseNumber}: select an existing exercise or use “Suggest new exercise”.`,
      );

      return;
    }

    if (customExercise) {
      const definition = exercise.exerciseDefinition || {};

      if (definition.name?.trim() !== name) {
        errors.push(
          `Exercise ${exerciseNumber}: the custom exercise name is invalid.`,
        );
      }

      if (
        definition.exerciseType !== "repetition" &&
        definition.exerciseType !== "hold"
      ) {
        errors.push(
          `Exercise ${exerciseNumber}: select whether the exercise uses repetitions or a timed hold.`,
        );
      }

      if (definition.type !== "dynamic" && definition.type !== "hold") {
        errors.push(
          `Exercise ${exerciseNumber}: exercise movement type is invalid.`,
        );
      }

      const proposedTier = Number(definition.proposedTier);

      if (
        !Number.isInteger(proposedTier) ||
        proposedTier < 1 ||
        proposedTier > 4
      ) {
        errors.push(
          `Exercise ${exerciseNumber}: select a suggested difficulty.`,
        );
      }

      if (
        typeof definition.equipment !== "string" ||
        !definition.equipment.trim()
      ) {
        errors.push(`Exercise ${exerciseNumber}: equipment is required.`);
      }

      if (
        !Array.isArray(definition.primaryMuscles) ||
        definition.primaryMuscles.length === 0
      ) {
        errors.push(
          `Exercise ${exerciseNumber}: add at least one primary muscle.`,
        );
      }
    }

    const exerciseType = getExerciseType(exercise);

    if (!exerciseType) {
      return;
    }

    const holdExercise = exerciseType === "hold";

    const sets = Array.isArray(exercise?.sets) ? exercise.sets : [];

    if (sets.length === 0) {
      errors.push(`Exercise ${exerciseNumber}: please add at least one set.`);

      return;
    }

    sets.forEach((set, setIndex) => {
      const setNumber = setIndex + 1;

      const reps =
        set?.reps === "" || set?.reps === undefined || set?.reps === null
          ? null
          : Number(set.reps);

      const seconds =
        set?.seconds === "" ||
        set?.seconds === undefined ||
        set?.seconds === null
          ? null
          : Number(set.seconds);

      const weight =
        set?.weight === "" || set?.weight === undefined || set?.weight === null
          ? null
          : Number(set.weight);

      if (holdExercise) {
        if (seconds === null || !Number.isFinite(seconds) || seconds <= 0) {
          errors.push(
            `Exercise ${exerciseNumber}, set ${setNumber}: hold time must be greater than 0.`,
          );
        }

        if (reps !== null && Number.isFinite(reps) && reps > 0) {
          errors.push(
            `Exercise ${exerciseNumber}, set ${setNumber}: hold exercises cannot have repetitions.`,
          );
        }
      } else {
        if (reps === null || !Number.isFinite(reps) || reps <= 0) {
          errors.push(
            `Exercise ${exerciseNumber}, set ${setNumber}: reps must be greater than 0.`,
          );
        }

        if (seconds !== null && Number.isFinite(seconds) && seconds > 0) {
          errors.push(
            `Exercise ${exerciseNumber}, set ${setNumber}: repetition exercises cannot have a hold time.`,
          );
        }
      }

      if (weight !== null && (!Number.isFinite(weight) || weight < 0)) {
        errors.push(
          `Exercise ${exerciseNumber}, set ${setNumber}: weight cannot be negative.`,
        );
      }
    });
  });

  return errors;
}
