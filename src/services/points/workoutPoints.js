import { DIFFICULTY } from "../../constants/libraries/difficulty";
import { WORKOUT_POINTS } from "../../constants/points/workoutPoints";
import { getExercise } from "../libraries/exerciseLibraryService";
import { getScoreFromTable } from "./utils";

function resolveExerciseMetadata(exercise = {}) {
  const libraryExercise = getExercise(exercise.exercise);

  if (libraryExercise) {
    return libraryExercise;
  }

  const embeddedDefinition = exercise.exerciseDefinition;

  if (
    !embeddedDefinition ||
    !["custom", "published"].includes(exercise.source)
  ) {
    return null;
  }

  const difficultyTier = Number(
    embeddedDefinition.tier ||
      embeddedDefinition.difficulty?.tier ||
      embeddedDefinition.proposedTier,
  );
  const difficulty =
    DIFFICULTY[`TIER_${difficultyTier}`] ??
    embeddedDefinition.difficulty;

  if (!difficulty) {
    return null;
  }

  return {
    exerciseType: embeddedDefinition.exerciseType,
    difficulty,
    secondsPerRep: Number(embeddedDefinition.secondsPerRep) || 10,
  };
}

function calculateSetEffectiveReps(set = {}, metadata) {
  if (metadata.exerciseType === "hold") {
    const seconds = Number(set.seconds ?? 0);
    const secondsPerRep = Number(metadata.secondsPerRep ?? 10);

    if (!Number.isFinite(seconds) || !Number.isFinite(secondsPerRep)) {
      return 0;
    }

    return Math.floor(seconds / Math.max(secondsPerRep, 1));
  }

  const reps = Number(set.reps ?? 0);

  return Number.isFinite(reps) && reps > 0 ? reps : 0;
}

export function calculateEffectiveReps(exercises = []) {
  const total = exercises.reduce((exerciseTotal, exercise) => {
    const metadata = resolveExerciseMetadata(exercise);

    if (!metadata) {
      return exerciseTotal;
    }

    const multiplier = Number(metadata.difficulty?.multiplier ?? 1);
    const safeMultiplier = Number.isFinite(multiplier) && multiplier > 0 ? multiplier : 1;

    const exerciseReps = (Array.isArray(exercise.sets) ? exercise.sets : []).reduce(
      (setTotal, set) =>
        setTotal + calculateSetEffectiveReps(set, metadata) * safeMultiplier,
      0,
    );

    return exerciseTotal + exerciseReps;
  }, 0);

  return Math.round(total);
}

export function calculateWorkoutPointBreakdown(data = {}) {
  const effectiveReps = calculateEffectiveReps(data.exercises ?? []);
  const points = getScoreFromTable(effectiveReps, WORKOUT_POINTS);

  return {
    effectiveReps,
    points,
  };
}

export function calculateWorkoutPoints(data = {}) {
  return calculateWorkoutPointBreakdown(data).points;
}
