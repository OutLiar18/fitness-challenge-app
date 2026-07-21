import { EXERCISE_LIBRARY } from "../constants/libraries/exerciseLibrary";

export function getExercise(name) {
  return EXERCISE_LIBRARY[name] || null;
}

export function getExercises() {
  return Object.values(EXERCISE_LIBRARY);
}

export function getExerciseNames() {
  return Object.keys(EXERCISE_LIBRARY);
}

export function getExercisesByCategory(category) {
  return Object.values(EXERCISE_LIBRARY).filter(
    (exercise) => exercise.category === category,
  );
}

export function getExerciseNamesByCategory(category) {
  return getExercisesByCategory(category).map((exercise) => exercise.name);
}

export function isStaticExercise(name) {
  const exercise = getExercise(name);

  return exercise?.type === "static";
}
