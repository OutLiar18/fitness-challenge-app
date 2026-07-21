export function validateWorkoutEntry(data = {}) {
  const errors = [];

  const exercises = Array.isArray(data.exercises)
    ? data.exercises
    : [];

  if (exercises.length === 0) {
    return ["Please add an exercise."];
  }

  exercises.forEach((exercise, index) => {
    const exerciseNumber = index + 1;
    const name = exercise?.exercise;
    const sets = Number(exercise?.sets);
    const reps = Number(exercise?.reps);
    const weight = exercise?.weight;

    if (
      typeof name !== "string" ||
      !name.trim()
    ) {
      errors.push(
        `Exercise ${exerciseNumber}: exercise is required.`,
      );
    }

    if (!Number.isFinite(sets) || sets <= 0) {
      errors.push(
        `Exercise ${exerciseNumber}: sets must be greater than 0.`,
      );
    }

    if (!Number.isFinite(reps) || reps <= 0) {
      errors.push(
        `Exercise ${exerciseNumber}: reps must be greater than 0.`,
      );
    }

    if (
      weight !== undefined &&
      weight !== null &&
      weight !== ""
    ) {
      const numericWeight = Number(weight);

      if (
        !Number.isFinite(numericWeight) ||
        numericWeight < 0
      ) {
        errors.push(
          `Exercise ${exerciseNumber}: weight cannot be negative.`,
        );
      }
    }
  });

  return errors;
}