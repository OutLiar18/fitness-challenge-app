export function validateSimpleEntry(category, data = {}) {
  const errors = [];

  for (const field of category.fields ?? []) {
    const value = data[field.id];

    const isEmpty =
      value === undefined ||
      value === null ||
      value === "";

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

      if (numberValue <= 0) {
        errors.push(`${field.label} must be greater than 0.`);
      }
    }

    if (
      field.type === "text" &&
      typeof value === "string" &&
      !value.trim()
    ) {
      errors.push(`${field.label} is required.`);
    }
  }

  return errors;
}