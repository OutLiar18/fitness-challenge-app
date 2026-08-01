import { formatPaceLong, pluralize } from "./displayFormatters";

export function calculateTotalSeconds({
  hours = 0,
  minutes = 0,
  seconds = 0,
} = {}) {
  const safeHours = Number(hours);
  const safeMinutes = Number(minutes);
  const safeSeconds = Number(seconds);

  return (
    (Number.isFinite(safeHours) ? safeHours : 0) * 3600 +
    (Number.isFinite(safeMinutes) ? safeMinutes : 0) * 60 +
    (Number.isFinite(safeSeconds) ? safeSeconds : 0)
  );
}

export function calculateTotalMinutes(time) {
  return calculateTotalSeconds(time) / 60;
}

export function formatDuration(time = {}, { long = true } = {}) {
  const hours = Number(time.hours ?? 0);
  const minutes = Number(time.minutes ?? 0);
  const seconds = Number(time.seconds ?? 0);
  const parts = [];

  if (hours > 0) {
    parts.push(
      long
        ? `${hours} ${pluralize(hours, "hour", "hours")}`
        : `${hours} hours`,
    );
  }

  if (minutes > 0) {
    parts.push(
      long
        ? `${minutes} ${pluralize(minutes, "minute", "minutes")}`
        : `${minutes} minutes`,
    );
  }

  if (seconds > 0) {
    parts.push(
      long
        ? `${seconds} ${pluralize(seconds, "second", "seconds")}`
        : `${seconds} seconds`,
    );
  }

  return parts.length > 0 ? parts.join(", ") : "No duration recorded";
}

export function formatPace(averagePaceSecondsPerKm) {
  const totalSeconds = Number(averagePaceSecondsPerKm);

  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) {
    return "Not available";
  }

  return formatPaceLong(totalSeconds);
}
