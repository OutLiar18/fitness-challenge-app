export const PERSONAL_DATA_EXPORT_SCHEMA_VERSION = 2;

export function serializeExportValue(value) {
  if (value == null || typeof value !== "object") {
    return value;
  }

  if (typeof value.toDate === "function") {
    const date = value.toDate();
    return date instanceof Date && !Number.isNaN(date.getTime())
      ? date.toISOString()
      : null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.map(serializeExportValue);
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [
      key,
      serializeExportValue(nestedValue),
    ]),
  );
}

export function createPersonalDataFilename(date = new Date()) {
  const safeDate = date instanceof Date && !Number.isNaN(date.getTime())
    ? date.toISOString().slice(0, 10)
    : "export";
  return `champions-legacy-personal-data-${safeDate}.json`;
}
