import { WORKOUT_POINTS } from "../../constants/workoutPoints";
import {
  getExercise,
  isStaticExercise,
} from "../exerciseLibraryService";

import { getScoreFromTable } from "./utils";

function calculateEffectiveReps(exercises = []) {
  let total = 0;

  for (const exercise of exercises) {
    const metadata = getExercise(exercise.exercise);

    if (!metadata) continue;

    let reps = Number(exercise.reps || 0);

    if (isStaticExercise(exercise.exercise)) {
      const seconds = Number(exercise.seconds || 0);

      reps = Math.floor(
        seconds / metadata.secondsPerRep,
      );
    }

    total +=
      reps *
      metadata.difficulty.multiplier;
  }

  return Math.round(total);
}

export function calculateWorkoutPoints(data = {}) {
  const effectiveReps = calculateEffectiveReps(
    data.exercises || [],
  );

  return getScoreFromTable(
    effectiveReps,
    WORKOUT_POINTS,
  );
}