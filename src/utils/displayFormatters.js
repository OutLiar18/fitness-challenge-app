const DISPLAY_LOCALE = "en-GB";

const numberFormatter = new Intl.NumberFormat(DISPLAY_LOCALE, {
  maximumFractionDigits: 2,
});

const wholeNumberFormatter = new Intl.NumberFormat(DISPLAY_LOCALE, {
  maximumFractionDigits: 0,
});

const UNIT_LABELS = Object.freeze({
  ml: ["millilitre", "millilitres"],
  km: ["kilometre", "kilometres"],
  min: ["minute", "minutes"],
  minute: ["minute", "minutes"],
  minutes: ["minute", "minutes"],
  points: ["point", "points"],
  point: ["point", "points"],
  steps: ["step", "steps"],
  servings: ["serving", "servings"],
  "effective reps": ["effective repetition", "effective repetitions"],
  "effective repetitions": ["effective repetition", "effective repetitions"],
  categories: ["category", "categories"],
  category: ["category", "categories"],
  entries: ["entry", "entries"],
  entry: ["entry", "entries"],
  days: ["day", "days"],
  day: ["day", "days"],
});

export function formatNumber(value, { whole = false } = {}) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0";
  }

  const formatter = whole ? wholeNumberFormatter : numberFormatter;
  return formatter.format(number);
}

export function pluralize(value, singular, plural = `${singular}s`) {
  return Number(value) === 1 ? singular : plural;
}

export function getUnitLabel(unit, value = 2) {
  const normalizedUnit = String(unit ?? "").trim().toLowerCase();
  const labels = UNIT_LABELS[normalizedUnit];

  if (!labels) {
    return String(unit ?? "").trim();
  }

  return Number(value) === 1 ? labels[0] : labels[1];
}

export function formatMeasurement(value, unit, options = {}) {
  const formattedValue = formatNumber(value, options);
  const label = getUnitLabel(unit, value);
  return label ? `${formattedValue} ${label}` : formattedValue;
}

export function formatPoints(value) {
  return formatMeasurement(value, "points", { whole: true });
}

export function formatExperiencePoints(value) {
  return `${formatNumber(value, { whole: true })} experience ${pluralize(
    value,
    "point",
    "points",
  )}`;
}

export function formatKilometres(value) {
  return formatMeasurement(value, "km");
}

export function formatMillilitres(value) {
  return formatMeasurement(value, "ml", { whole: true });
}

export function formatMinutes(value) {
  return formatMeasurement(value, "minutes");
}

export function formatPaceLong(secondsPerKilometre) {
  const totalSeconds = Math.max(0, Math.round(Number(secondsPerKilometre) || 0));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")} per kilometre`;
}

export function formatRole(role) {
  if (role === "admin") {
    return "Platform Administrator";
  }

  if (role === "leagueAdmin") {
    return "League Administrator";
  }

  return "Player";
}
