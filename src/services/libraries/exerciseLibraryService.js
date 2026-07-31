import { EXERCISE_LIBRARY } from "../../constants/libraries/exerciseLibrary";

function normalizeExerciseDefinition(exercise) {
  if (!exercise) {
    return null;
  }

  const exerciseType =
    exercise.exerciseType === "hold" || exercise.type === "hold"
      ? "hold"
      : "repetition";

  return {
    ...exercise,
    exerciseType,
    type: exerciseType === "hold" ? "hold" : "dynamic",
    secondsPerRep:
      exerciseType === "hold" && Number(exercise.secondsPerRep) > 0
        ? Number(exercise.secondsPerRep)
        : 10,
  };
}

export function getExercise(name) {
  return normalizeExerciseDefinition(EXERCISE_LIBRARY[name]);
}

export function getExercises() {
  return Object.values(EXERCISE_LIBRARY).map(normalizeExerciseDefinition);
}

export function getExerciseNames() {
  return getExercises()
    .map((exercise) => exercise.name)
    .sort((first, second) => first.localeCompare(second));
}

export function getExercisesByCategory(category) {
  return getExercises()
    .filter((exercise) => exercise.category === category)
    .sort((first, second) => first.name.localeCompare(second.name));
}

export function getExerciseNamesByCategory(category) {
  return getExercisesByCategory(category).map((exercise) => exercise.name);
}

export function isRepetitionExercise(name) {
  return getExercise(name)?.exerciseType === "repetition";
}

export function isHoldExercise(name) {
  return getExercise(name)?.exerciseType === "hold";
}

export function getExerciseDifficulty(name) {
  return getExercise(name)?.difficulty ?? null;
}
