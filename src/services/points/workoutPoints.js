import { WORKOUT_POINTS } from "../../constants/workoutPoints";
import {
  getExercise,
  isHoldExercise,
} from "../exerciseLibraryService";

import { getScoreFromTable } from "./utils";

function calculateSetEffectiveReps(
  exerciseName,
  set,
  metadata,
) {
  if (isHoldExercise(exerciseName)) {
    const seconds = Number(set.seconds || 0);
    const secondsPerRep = Number(
      metadata.secondsPerRep || 10,
    );

    return Math.floor(
      seconds / secondsPerRep,
    );
  }

  return Number(set.reps || 0);
}

function calculateEffectiveReps(
  exercises = [],
) {
  let total = 0;

  for (const exercise of exercises) {
    const metadata = getExercise(
      exercise.exercise,
    );

    if (!metadata) {
      continue;
    }

    const sets = Array.isArray(exercise.sets)
      ? exercise.sets
      : [];

    for (const set of sets) {
      const setEffectiveReps =
        calculateSetEffectiveReps(
          exercise.exercise,
          set,
          metadata,
        );

      total +=
        setEffectiveReps *
        metadata.difficulty.multiplier;
    }
  }

  return Math.round(total);
}

export function calculateWorkoutPoints(
  data = {},
) {
  const effectiveReps =
    calculateEffectiveReps(
      data.exercises || [],
    );

  return getScoreFromTable(
    effectiveReps,
    WORKOUT_POINTS,
  );
}