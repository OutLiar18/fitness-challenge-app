const WORKOUT_CATEGORIES = new Set(["upperBody", "lowerBody", "core"]);

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

function normalizeCardioEntry(data = {}) {
  const duration = getNormalizedDuration(data);

  return {
    activity: normalizeText(data.activity),

    ...duration,
  };
}

function normalizeSkillEntry(data = {}) {
  const duration = getNormalizedDuration(data);

  return {
    skill: normalizeText(data.skill),
    ...duration,
  };
}

function normalizeWorkoutEntry(data = {}) {
  return {
    exercises: Array.isArray(data.exercises) ? data.exercises : [],
  };
}

export function normalizeEntry(category, data = {}) {
  if (WORKOUT_CATEGORIES.has(category)) {
    return normalizeWorkoutEntry(data);
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

  return { ...data };
}
