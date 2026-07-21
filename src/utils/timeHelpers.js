export function calculateTotalSeconds({
  hours = 0,
  minutes = 0,
  seconds = 0,
}) {
  return (
    hours * 3600 +
    minutes * 60 +
    seconds
  );
}

export function calculateTotalMinutes(time) {
  return Math.round(
    calculateTotalSeconds(time) / 60,
  );
}

export function formatDuration(time) {
  const hours = time.hours ?? 0;
  const minutes = time.minutes ?? 0;
  const seconds = time.seconds ?? 0;

  const parts = [];

  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (seconds || parts.length === 0)
    parts.push(`${seconds}s`);

  return parts.join(" ");
}