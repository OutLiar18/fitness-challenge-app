import { EXERCISE_LIBRARY } from "../constants/libraries/exerciseLibrary";

export function getExercise(name) {
  return EXERCISE_LIBRARY[name] ?? null;
}

export function getDifficulty(name) {
  return getExercise(name)?.difficulty ?? null;
}

export function isStaticExercise(name) {
  return getExercise(name)?.type === "static";
}

export function getSecondsPerRep(name) {
  return getExercise(name)?.secondsPerRep ?? null;
}