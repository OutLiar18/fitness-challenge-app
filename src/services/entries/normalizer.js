import { WORKOUT_CATEGORIES } from "../../constants/categories";

function toNonNegativeNumber(value) {
  if (value === "" || value === undefined || value === null) {
    return 0;
  }

  const numberValue = Number(value);

  if (!Number.isFinite(numberValue) || numberValue < 0) {
    return 0;
  }

  return numberValue;
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeCompletedBook(value) {
  if (value === true || value === "true" || value === "yes") {
    return true;
  }

  if (value === false || value === "false" || value === "no") {
    return false;
  }

  return "";
}

function getNormalizedDuration(data = {}) {
  const hours = toNonNegativeNumber(data.hours);
  const minutes = toNonNegativeNumber(data.minutes);
  const seconds = toNonNegativeNumber(data.seconds);

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const totalMinutes = totalSeconds / 60;

  return {
    hours,
    minutes,
    seconds,
    totalSeconds,
    totalMinutes,
  };
}

function normalizeFruitEntry(data = {}) {
  const fruitType = data.fruitType ?? data.fruit ?? "";
  const servings = data.servings ?? data.quantity ?? "";

  return {
    fruitType: normalizeText(fruitType),
    servings: servings === "" ? "" : Number(servings),
  };
}

function normalizeReadingEntry(data = {}) {
  const duration = getNormalizedDuration(data);

  return {
    ...duration,

    title: normalizeText(data.title ?? data.book),

    author: normalizeText(data.author),

    totalPages:
      data.totalPages === "" || data.totalPages === undefined
        ? ""
        : Number(data.totalPages),

    reflection: normalizeText(data.reflection),

    completed: normalizeCompletedBook(data.completed ?? data.completedBook),
  };
}

function normalizeRunningEntry(data = {}) {
  const duration = getNormalizedDuration(data);

  const distance = Number(data.distance ?? 0);

  const validDistance =
    Number.isFinite(distance) && distance > 0 ? distance : 0;

  const averagePaceSecondsPerKm =
    validDistance > 0 && duration.totalSeconds > 0
      ? duration.totalSeconds / validDistance
      : 0;

  return {
    distance: validDistance,

    ...duration,

    averagePaceSecondsPerKm,
  };
}

function normalizeCardioDifficulty(difficulty = {}, fallbackTier = "") {
  const tierValue = Number(difficulty.tier ?? fallbackTier);

  const multiplierValue = Number(difficulty.multiplier);

  return {
    tier:
      Number.isInteger(tierValue) && tierValue >= 1 && tierValue <= 5
        ? tierValue
        : 1,

    name: normalizeText(difficulty.name),

    multiplier:
      Number.isFinite(multiplierValue) && multiplierValue > 0
        ? multiplierValue
        : 1,
  };
}

function normalizeLibraryCardioDefinition(definition = {}, activity) {
  const tierValue = Number(definition.tier ?? definition.difficulty?.tier);

  const tier =
    Number.isInteger(tierValue) && tierValue >= 1 && tierValue <= 5
      ? tierValue
      : 1;

  return {
    name: normalizeText(definition.name || activity),

    group: normalizeText(definition.group),

    cardioType: normalizeText(definition.cardioType),

    environment: normalizeText(definition.environment),

    equipment: normalizeText(definition.equipment),

    tier,

    difficulty: normalizeCardioDifficulty(definition.difficulty, tier),
  };
}

function normalizeCustomCardioDefinition(definition = {}, activity) {
  const proposedTierValue = Number(definition.proposedTier);

  return {
    name: normalizeText(definition.name || activity),

    group: normalizeText(definition.group),

    cardioType: normalizeText(definition.cardioType),

    environment: normalizeText(definition.environment),

    equipment: normalizeText(definition.equipment),

    proposedTier:
      Number.isInteger(proposedTierValue) &&
      proposedTierValue >= 1 &&
      proposedTierValue <= 5
        ? proposedTierValue
        : "",
  };
}

function normalizeCardioEntry(data = {}) {
  const duration = getNormalizedDuration(data);

  const activity = normalizeText(data.activity);

  const customActivity = data.source === "custom";

  const activityDefinition = customActivity
    ? normalizeCustomCardioDefinition(data.activityDefinition, activity)
    : normalizeLibraryCardioDefinition(data.activityDefinition, activity);

  const distance =
    data.distance === "" ||
    data.distance === undefined ||
    data.distance === null
      ? ""
      : Number(data.distance);

  return {
    activity,

    source: customActivity ? "custom" : "library",

    suggestionStatus: customActivity ? "pending" : "",

    activityDefinition,

    ...duration,

    distance:
      distance === "" || (Number.isFinite(distance) && distance > 0)
        ? distance
        : "",

    notes: normalizeText(data.notes),
  };
}

function normalizeSkillEntry(data = {}) {
  const duration = getNormalizedDuration(data);

  const customSkill = data.source === "custom" || Boolean(data.skillDefinition);

  return {
    skill: normalizeText(data.skill),

    source: customSkill ? "custom" : "library",

    suggestionStatus: customSkill ? "pending" : "",

    skillDefinition: customSkill
      ? {
          name: normalizeText(data.skillDefinition?.name || data.skill),

          area: normalizeText(data.skillDefinition?.area),

          tags: Array.isArray(data.skillDefinition?.tags)
            ? data.skillDefinition.tags.map(normalizeText).filter(Boolean)
            : [],
        }
      : null,

    ...duration,
  };
}

function normalizeStepsEntry(data = {}) {
  const steps = Number(data.steps);

  return {
    steps:
      Number.isFinite(steps) && Number.isInteger(steps) && steps > 0
        ? steps
        : 0,
  };
}

function normalizeWorkoutSet(set = {}, exerciseType) {
  const weight =
    set.weight === "" || set.weight === undefined || set.weight === null
      ? ""
      : toNonNegativeNumber(set.weight);

  if (exerciseType === "hold") {
    return {
      reps: "",
      seconds: toNonNegativeNumber(set.seconds),
      weight,
    };
  }

  return {
    reps: toNonNegativeNumber(set.reps),
    seconds: "",
    weight,
  };
}

function normalizeExerciseDefinition(
  definition = {},
  fallbackName,
  fallbackCategory,
) {
  const exerciseType =
    definition.exerciseType === "hold"
      ? "hold"
      : definition.exerciseType === "repetition"
        ? "repetition"
        : "";

  return {
    name: normalizeText(definition.name || fallbackName),

    aliases: Array.isArray(definition.aliases)
      ? definition.aliases.map(normalizeText).filter(Boolean)
      : [],

    category: normalizeText(definition.category || fallbackCategory),

    type:
      exerciseType === "hold"
        ? "hold"
        : exerciseType === "repetition"
          ? "dynamic"
          : "",

    exerciseType,

    proposedTier: (() => {
      const proposedTier = Number(definition.proposedTier);

      return Number.isInteger(proposedTier) &&
        proposedTier >= 1 &&
        proposedTier <= 5
        ? proposedTier
        : "";
    })(),

    equipment: normalizeText(definition.equipment),

    movementPattern: normalizeText(definition.movementPattern),

    primaryMuscles: Array.isArray(definition.primaryMuscles)
      ? definition.primaryMuscles.map(normalizeText).filter(Boolean)
      : [],

    secondaryMuscles: Array.isArray(definition.secondaryMuscles)
      ? definition.secondaryMuscles.map(normalizeText).filter(Boolean)
      : [],
  };
}

function normalizeWorkoutExercise(exercise = {}, category) {
  const name = normalizeText(exercise.exercise);

  const customExercise =
    exercise.source === "custom" || Boolean(exercise.exerciseDefinition);

  const exerciseDefinition = customExercise
    ? normalizeExerciseDefinition(exercise.exerciseDefinition, name, category)
    : null;

  const exerciseType = customExercise ? exerciseDefinition.exerciseType : "";

  return {
    exercise: name,

    source: customExercise ? "custom" : "library",

    exerciseDefinition,

    suggestionStatus: customExercise ? "pending" : "",

    sets: Array.isArray(exercise.sets)
      ? exercise.sets.map((set) =>
          normalizeWorkoutSet(
            set,
            exerciseType || (set.seconds ? "hold" : "repetition"),
          ),
        )
      : [],
  };
}

function normalizeWorkoutEntry(data = {}, category) {
  return {
    exercises: Array.isArray(data.exercises)
      ? data.exercises.map((exercise) =>
          normalizeWorkoutExercise(exercise, category),
        )
      : [],
  };
}

export function normalizeEntry(category, data = {}) {
  if (WORKOUT_CATEGORIES.has(category)) {
    return normalizeWorkoutEntry(data, category);
  }

  if (category === "fruit") {
    return normalizeFruitEntry(data);
  }

  if (category === "reading") {
    return normalizeReadingEntry(data);
  }

  if (category === "running") {
    return normalizeRunningEntry(data);
  }

  if (category === "cardio") {
    return normalizeCardioEntry(data);
  }

  if (category === "skill") {
    return normalizeSkillEntry(data);
  }

  if (category === "steps") {
    return normalizeStepsEntry(data);
  }

  return { ...data };
}
