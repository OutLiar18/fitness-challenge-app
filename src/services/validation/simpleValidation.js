function validateDuration(data = {}, label = "Duration") {
  const errors = [];

  const hours = Number(data.hours ?? 0);
  const minutes = Number(data.minutes ?? 0);
  const seconds = Number(data.seconds ?? 0);

  if (
    !Number.isFinite(hours) ||
    !Number.isFinite(minutes) ||
    !Number.isFinite(seconds)
  ) {
    return [`${label} must contain valid numbers.`];
  }

  if (hours < 0 || minutes < 0 || seconds < 0) {
    errors.push(`${label} cannot contain negative values.`);
  }

  if (minutes > 59) {
    errors.push(`${label} minutes cannot be greater than 59.`);
  }

  if (seconds > 59) {
    errors.push(`${label} seconds cannot be greater than 59.`);
  }

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  if (totalSeconds <= 0) {
    errors.push(`${label} must be greater than 0.`);
  }

  return errors;
}

function validateReadingEntry(data = {}) {
  const errors = [...validateDuration(data, "Reading duration")];

  if (typeof data.title !== "string" || !data.title.trim()) {
    errors.push("Book title is required.");
  }

  if (data.completed !== true && data.completed !== false) {
    errors.push("Please indicate whether you completed the book.");
  }

  if (
    data.totalPages !== "" &&
    data.totalPages !== undefined &&
    data.totalPages !== null
  ) {
    const totalPages = Number(data.totalPages);

    if (!Number.isFinite(totalPages)) {
      errors.push("Total pages must be a valid number.");
    } else {
      if (!Number.isInteger(totalPages)) {
        errors.push("Total pages must be a whole number.");
      }

      if (totalPages < 1) {
        errors.push("Total pages must be at least 1.");
      }
    }
  }

  return errors;
}

function validateStepsEntry(data = {}) {
  const errors = [];

  const steps = Number(data.steps);

  if (!Number.isFinite(steps)) {
    errors.push("Steps must be a valid number.");

    return errors;
  }

  if (!Number.isInteger(steps)) {
    errors.push("Steps must be a whole number.");
  }

  if (steps < 1) {
    errors.push("Steps must be at least 1.");
  }

  return errors;
}

function validateCardioEntry(data = {}) {
  const errors = [...validateDuration(data, "Cardio duration")];

  if (typeof data.activity !== "string" || !data.activity.trim()) {
    errors.push("Activity is required.");
  }

  const customActivity =
    data.source === "custom" || Boolean(data.activityDefinition);

  if (customActivity) {
    if (!data.activityDefinition?.cardioType?.trim()) {
      errors.push("Cardio type is required.");
    }

    if (!data.activityDefinition?.environment?.trim()) {
      errors.push("Cardio environment is required.");
    }

    if (!data.activityDefinition?.equipment?.trim()) {
      errors.push("Cardio equipment is required.");
    }
  }

  if (
    data.distance !== "" &&
    data.distance !== undefined &&
    data.distance !== null
  ) {
    const distance = Number(data.distance);

    if (!Number.isFinite(distance)) {
      errors.push("Distance must be a valid number.");
    } else if (distance <= 0) {
      errors.push("Distance must be greater than 0.");
    }
  }

  return errors;
}

export function validateSimpleEntry(category, data = {}) {
  if (category.id === "reading") {
    return [...new Set(validateReadingEntry(data))];
  }

  const errors = [];

  if (category.id === "running") {
    errors.push(...validateDuration(data, "Running duration"));
  }

  if (category.id === "cardio") {
    return [...new Set(validateCardioEntry(data))];
  }

  if (category.id === "skill") {
    errors.push(...validateDuration(data, "Skill duration"));

    const customSkill =
      data.source === "custom" || Boolean(data.skillDefinition);

    if (customSkill) {
      if (!data.skillDefinition?.area?.trim()) {
        errors.push("Skill area is required.");
      }
    }
  }

  if (category.id === "steps") {
    return [...new Set(validateStepsEntry(data))];
  }

  for (const field of category.fields ?? []) {
    const value = data[field.id];

    const isEmpty = value === undefined || value === null || value === "";

    if (field.required && isEmpty) {
      errors.push(`${field.label} is required.`);

      continue;
    }

    if (isEmpty) {
      continue;
    }

    if (field.type === "number") {
      const numberValue = Number(value);

      if (!Number.isFinite(numberValue)) {
        errors.push(`${field.label} must be a valid number.`);

        continue;
      }

      if (field.min !== undefined && numberValue < field.min) {
        errors.push(`${field.label} must be at least ${field.min}.`);
      }

      if (field.max !== undefined && numberValue > field.max) {
        errors.push(`${field.label} cannot be greater than ${field.max}.`);
      }
    }

    if (
      field.type === "text" &&
      typeof value === "string" &&
      !value.trim() &&
      field.required
    ) {
      errors.push(`${field.label} is required.`);
    }
  }

  return [...new Set(errors)];
}
