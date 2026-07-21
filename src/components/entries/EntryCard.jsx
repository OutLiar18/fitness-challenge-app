import { getCategory } from "../../utils/categoryHelpers";
import { getUnit } from "../../utils/units";
import { calculateEntryPoints } from "../../services/points";

const WORKOUT_CATEGORIES = new Set(["upperBody", "lowerBody", "core"]);

function formatDuration(data = {}) {
  const hours = Number(data.hours ?? 0);
  const minutes = Number(data.minutes ?? 0);
  const seconds = Number(data.seconds ?? 0);

  const parts = [];

  if (hours > 0) {
    parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
  }

  if (minutes > 0) {
    parts.push(`${minutes} ${minutes === 1 ? "minute" : "minutes"}`);
  }

  if (seconds > 0) {
    parts.push(`${seconds} ${seconds === 1 ? "second" : "seconds"}`);
  }

  return parts.length > 0 ? parts.join(", ") : "No duration recorded";
}

function formatPace(averagePaceSecondsPerKm) {
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

function ReadingDetails({ data = {} }) {
  const book =
    typeof data.book === "string" && data.book.trim()
      ? data.book.trim()
      : "Not recorded";

  const reflection =
    typeof data.reflection === "string" ? data.reflection.trim() : "";

  const hasCompletionAnswer = typeof data.completedBook === "boolean";

  return (
    <>
      <p>
        <strong>Duration:</strong> {formatDuration(data)}
      </p>

      <p>
        <strong>Book:</strong> {book}
      </p>

      <p>
        <strong>Book Completed:</strong>{" "}
        {hasCompletionAnswer
          ? data.completedBook
            ? "Yes"
            : "No"
          : "Not recorded"}
      </p>

      {reflection && (
        <p>
          <strong>Reflection:</strong> {reflection}
        </p>
      )}
    </>
  );
}

function RunningDetails({ data = {} }) {
  const distance = Number(data.distance ?? 0);

  return (
    <>
      <p>
        <strong>Distance:</strong> {Number.isFinite(distance) ? distance : 0} km
      </p>

      <p>
        <strong>Duration:</strong> {formatDuration(data)}
      </p>

      <p>
        <strong>Average Pace:</strong>{" "}
        {formatPace(data.averagePaceSecondsPerKm)}
      </p>
    </>
  );
}

function CardioDetails({ data = {} }) {
  const activity =
    typeof data.activity === "string" && data.activity.trim()
      ? data.activity.trim()
      : "Not recorded";

  return (
    <>
      <p>
        <strong>Activity:</strong> {activity}
      </p>

      <p>
        <strong>Duration:</strong> {formatDuration(data)}
      </p>
    </>
  );
}

function SkillDetails({ data = {} }) {
  const skill =
    typeof data.skill === "string" && data.skill.trim()
      ? data.skill.trim()
      : "Not recorded";

  return (
    <>
      <p>
        <strong>Skill:</strong> {skill}
      </p>

      <p>
        <strong>Duration:</strong> {formatDuration(data)}
      </p>
    </>
  );
}

function WorkoutDetails({ exercises = [] }) {
  if (!Array.isArray(exercises) || exercises.length === 0) {
    return <p>No exercises recorded.</p>;
  }

  return exercises.map((exercise, index) => {
    const exerciseName =
      typeof exercise.exercise === "string" && exercise.exercise.trim()
        ? exercise.exercise.trim()
        : "Exercise";

    const sets = Number(exercise.sets ?? 0);

    const reps = Number(exercise.reps ?? 0);

    const weight = Number(exercise.weight ?? 0);

    const seconds = Number(exercise.seconds ?? 0);

    return (
      <div
        key={`${exerciseName}-${index}`}
        style={{
          marginBottom: "10px",
        }}
      >
        <strong>{exerciseName}</strong>

        <p>
          {Number.isFinite(sets) ? sets : 0} sets ×{" "}
          {Number.isFinite(reps) ? reps : 0} reps
        </p>

        {Number.isFinite(weight) && weight > 0 && <p>Weight: {weight} kg</p>}

        {Number.isFinite(seconds) && seconds > 0 && (
          <p>Hold Time: {seconds}s</p>
        )}
      </div>
    );
  });
}

function SimpleEntryDetails({ category, data = {} }) {
  return (category.fields ?? []).map((field) => {
    const value = data[field.id];

    if (value === undefined || value === null || value === "") {
      return null;
    }

    const unit = getUnit(field.id);

    const displayValue =
      typeof value === "boolean" ? (value ? "Yes" : "No") : value;

    return (
      <p key={field.id}>
        <strong>{field.label}:</strong> {displayValue}
        {unit ? ` ${unit}` : ""}
      </p>
    );
  });
}

export default function EntryCard({ entry, onDelete, readOnly = false }) {
  if (!entry) {
    return null;
  }

  const category = getCategory(entry.category);

  if (!category) {
    return null;
  }

  const points = calculateEntryPoints(entry);

  const isWorkout = WORKOUT_CATEGORIES.has(entry.category);

  const isReading = entry.category === "reading";

  const isRunning = entry.category === "running";

  const isCardio = entry.category === "cardio";

  const isSkill = entry.category === "skill";

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "15px",
        marginBottom: "10px",
      }}
    >
      <h3>
        {category.emoji} {category.name}
      </h3>

      {isWorkout ? (
        <WorkoutDetails exercises={entry.data?.exercises ?? []} />
      ) : isReading ? (
        <ReadingDetails data={entry.data ?? {}} />
      ) : isRunning ? (
        <RunningDetails data={entry.data ?? {}} />
      ) : isCardio ? (
        <CardioDetails data={entry.data ?? {}} />
      ) : isSkill ? (
        <SkillDetails data={entry.data ?? {}} />
      ) : (
        <SimpleEntryDetails category={category} data={entry.data ?? {}} />
      )}

      <hr />

      <p>
        <strong>⭐ Points:</strong>{" "}
        {Number.isFinite(Number(points)) ? points : 0}
      </p>

      {!readOnly && (
        <button type="button" onClick={() => onDelete?.(entry.id)}>
          Delete
        </button>
      )}
    </div>
  );
}
