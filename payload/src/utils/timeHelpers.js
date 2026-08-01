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

export function formatDuration(time = {}, { long = false } = {}) {
  const hours = Number(time.hours ?? 0);
  const minutes = Number(time.minutes ?? 0);
  const seconds = Number(time.seconds ?? 0);
  const parts = [];

  if (hours > 0) {
    parts.push(long ? `${hours} ${hours === 1 ? "hour" : "hours"}` : `${hours}h`);
  }

  if (minutes > 0) {
    parts.push(
      long ? `${minutes} ${minutes === 1 ? "minute" : "minutes"}` : `${minutes}m`,
    );
  }

  if (seconds > 0) {
    parts.push(
      long ? `${seconds} ${seconds === 1 ? "second" : "seconds"}` : `${seconds}s`,
    );
  }

  return parts.length > 0 ? parts.join(long ? ", " : " ") : "No duration recorded";
}

export function formatPace(averagePaceSecondsPerKm) {
  const totalSeconds = Number(averagePaceSecondsPerKm);

  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) {
    return "Not available";
  }

  let minutes = Math.floor(totalSeconds / 60);
  let seconds = Math.round(totalSeconds % 60);

  if (seconds === 60) {
    minutes += 1;
    seconds = 0;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")} min/km`;
}
