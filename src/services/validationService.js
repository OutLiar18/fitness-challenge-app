export function validateEntry(category, data) {
  const errors = [];

  for (const field of category.fields) {
    const value = data[field.id];

    if (field.required) {
      if (
        value === undefined ||
        value === null ||
        value === ""
      ) {
        errors.push(`${field.label} is required.`);
        continue;
      }
    }

    if (field.type === "number") {
      if (Number(value) <= 0) {
        errors.push(`${field.label} must be greater than 0.`);
      }
    }
  }

  return errors;
}