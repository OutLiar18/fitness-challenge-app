export function validateWorkoutEntry(data = {}) {
  const errors = [];

  const exercises = Array.isArray(data.exercises) ? data.exercises : [];

  if (exercises.length === 0) {
    return ["Please add an exercise."];
  }

  exercises.forEach((exercise, exerciseIndex) => {
    const exerciseNumber = exerciseIndex + 1;
    const name = exercise?.exercise;

    if (typeof name !== "string" || !name.trim()) {
      errors.push(`Exercise ${exerciseNumber}: exercise is required.`);
    }

    const sets = Array.isArray(exercise?.sets) ? exercise.sets : [];

    if (sets.length === 0) {
      errors.push(`Exercise ${exerciseNumber}: please add at least one set.`);

      return;
    }

    sets.forEach((set, setIndex) => {
      const setNumber = setIndex + 1;

      const reps =
        set?.reps === "" || set?.reps === undefined || set?.reps === null
          ? 0
          : Number(set.reps);

      const seconds =
        set?.seconds === "" ||
        set?.seconds === undefined ||
        set?.seconds === null
          ? 0
          : Number(set.seconds);

      const weight =
        set?.weight === "" || set?.weight === undefined || set?.weight === null
          ? null
          : Number(set.weight);

      const hasValidReps = Number.isFinite(reps) && reps > 0;

      const hasValidSeconds = Number.isFinite(seconds) && seconds > 0;

      if (!hasValidReps && !hasValidSeconds) {
        errors.push(
          `Exercise ${exerciseNumber}, set ${setNumber}: enter reps or a hold time.`,
        );
      }

      if (
        set?.reps !== "" &&
        set?.reps !== undefined &&
        set?.reps !== null &&
        (!Number.isFinite(reps) || reps <= 0)
      ) {
        errors.push(
          `Exercise ${exerciseNumber}, set ${setNumber}: reps must be greater than 0.`,
        );
      }

      if (
        set?.seconds !== "" &&
        set?.seconds !== undefined &&
        set?.seconds !== null &&
        (!Number.isFinite(seconds) || seconds <= 0)
      ) {
        errors.push(
          `Exercise ${exerciseNumber}, set ${setNumber}: hold time must be greater than 0.`,
        );
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
