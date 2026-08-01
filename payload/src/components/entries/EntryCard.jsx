import { WORKOUT_CATEGORIES } from "../../constants/categories";
import { getEntryPointBreakdown } from "../../services/points";
import {
  formatKilometres,
  formatMeasurement,
  formatNumber,
  formatPoints,
  pluralize,
} from "../../utils/displayFormatters";
import { getCategory } from "../../utils/categoryHelpers";
import { formatDuration, formatPace } from "../../utils/timeHelpers";
import "./EntryCard.css";

function cleanText(value, fallback = "Not recorded") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function formatValue(value) {
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  const numericValue = Number(value);

  if (value !== "" && Number.isFinite(numericValue)) {
    return formatNumber(numericValue);
  }

  return String(value);
}

function Detail({ label, children }) {
  if (children === undefined || children === null || children === "") {
    return null;
  }

  return (
    <div className="entry-detail">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function ReadingDetails({ data = {} }) {
  const completed =
    typeof data.completed === "boolean"
      ? data.completed
      : typeof data.completedBook === "boolean"
        ? data.completedBook
        : null;

  return (
    <>
      <Detail label="Book">{cleanText(data.title ?? data.book)}</Detail>
      {cleanText(data.author, "") && (
        <Detail label="Author">{cleanText(data.author, "")}</Detail>
      )}
      <Detail label="Duration">{formatDuration(data)}</Detail>
      {Number(data.totalPages) > 0 && (
        <Detail label="Total pages">
          {formatNumber(Number(data.totalPages), { whole: true })}
        </Detail>
      )}
      <Detail label="Book completed">
        {completed === null ? "Not recorded" : completed ? "Yes" : "No"}
      </Detail>
      {cleanText(data.reflection, "") && (
        <div className="entry-card__reflection">
          <strong>Reflection</strong>
          <p>{cleanText(data.reflection, "")}</p>
        </div>
      )}
    </>
  );
}

function RunningDetails({ data = {} }) {
  return (
    <>
      <Detail label="Distance">{formatKilometres(data.distance ?? 0)}</Detail>
      <Detail label="Duration">{formatDuration(data)}</Detail>
      <Detail label="Average pace">
        {formatPace(data.averagePaceSecondsPerKm)}
      </Detail>
    </>
  );
}

function CardioDetails({ data = {} }) {
  return (
    <>
      <Detail label="Activity">{cleanText(data.activity)}</Detail>
      <Detail label="Duration">{formatDuration(data)}</Detail>
      {Number(data.distance) > 0 && (
        <Detail label="Distance">{formatKilometres(data.distance)}</Detail>
      )}
      {cleanText(data.notes, "") && (
        <div className="entry-card__reflection">
          <strong>Notes</strong>
          <p>{cleanText(data.notes, "")}</p>
        </div>
      )}
    </>
  );
}

function SkillDetails({ data = {} }) {
  return (
    <>
      <Detail label="Skill">{cleanText(data.skill)}</Detail>
      <Detail label="Duration">{formatDuration(data)}</Detail>
    </>
  );
}

function getNormalizedSets(exercise = {}) {
  if (Array.isArray(exercise.sets)) {
    return exercise.sets;
  }

  return Array.from(
    { length: Math.max(Number(exercise.sets ?? 1), 1) },
    () => ({
      reps: exercise.reps,
      seconds: exercise.seconds,
      weight: exercise.weight,
    }),
  );
}

function formatWorkoutSet(set = {}) {
  const repetitions = Number(set.reps ?? 0);
  const seconds = Number(
    set.seconds ?? set.durationSeconds ?? set.holdSeconds ?? 0,
  );
  const weight = Number(set.weight ?? 0);
  const parts = [];

  if (Number.isFinite(repetitions) && repetitions > 0) {
    parts.push(
      `${formatNumber(repetitions)} ${pluralize(
        repetitions,
        "repetition",
        "repetitions",
      )}`,
    );
  }

  if (Number.isFinite(seconds) && seconds > 0) {
    parts.push(
      `${formatNumber(seconds)}-${pluralize(
        seconds,
        "second",
        "seconds",
      )} hold`,
    );
  }

  if (Number.isFinite(weight) && weight > 0) {
    parts.push(
      `${formatNumber(weight)} ${pluralize(weight, "kilogram", "kilograms")}`,
    );
  }

  return parts.join(" · ");
}

function WorkoutDetails({ exercises = [] }) {
  const validExercises = Array.isArray(exercises) ? exercises : [];

  if (validExercises.length === 0) {
    return <p className="entry-card__muted">No exercises recorded.</p>;
  }

  return (
    <div className="entry-card__exercises">
      {validExercises.map((exercise, exerciseIndex) => {
        const name = cleanText(exercise.exercise ?? exercise.name, "Exercise");
        const sets = getNormalizedSets(exercise)
          .map(formatWorkoutSet)
          .filter(Boolean);

        return (
          <section className="entry-exercise" key={`${name}-${exerciseIndex}`}>
            <div className="entry-exercise__header">
              <strong>{name}</strong>
              <span>
                {sets.length} {pluralize(sets.length, "set", "sets")}
              </span>
            </div>
            {sets.length > 0 ? (
              <ol className="entry-exercise__sets">
                {sets.map((set, setIndex) => (
                  <li key={`${name}-set-${setIndex}`}>
                    <span>Set {setIndex + 1}</span>
                    <strong>{set}</strong>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="entry-card__muted">No set details recorded.</p>
            )}
          </section>
        );
      })}
    </div>
  );
}

function SimpleEntryDetails({ category, data = {} }) {
  return (category.fields ?? []).map((field) => {
    const value = data[field.id];

    if (value === undefined || value === null || value === "") {
      return null;
    }

    const unit = field.id === category.scoreField ? category.unit : "";

    return (
      <Detail key={field.id} label={field.label}>
        {unit ? formatMeasurement(value, unit) : formatValue(value)}
      </Detail>
    );
  });
}

function PointBreakdown({ result }) {
  return (
    <section className="entry-points" aria-label="Points earned">
      <div className="entry-points__heading">
        <span>Points earned</span>
        <strong>+{formatPoints(result.total)}</strong>
      </div>

      <div className="entry-points__rows">
        {result.breakdown.map((item) => (
          <div className="entry-points__row" key={item.id}>
            <span className="entry-points__label">
              <span aria-hidden="true">{item.emoji}</span>
              <span>
                {item.label}
                {item.detail && <small>{item.detail}</small>}
              </span>
            </span>
            <strong>+{formatPoints(item.points)}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function EntryCard({ entry, onDelete, readOnly = false }) {
  if (!entry?.category) {
    return null;
  }

  const category = getCategory(entry.category);

  if (!category) {
    return null;
  }

  const data = entry.data ?? {};
  const pointBreakdown = getEntryPointBreakdown(entry);
  const isWorkout = WORKOUT_CATEGORIES.has(entry.category);

  return (
    <article className="entry-card">
      <header className="entry-card__header">
        <span className="entry-card__emoji" aria-hidden="true">
          {category.emoji}
        </span>
        <div>
          <p className="entry-card__type">Challenge entry</p>
          <h3>{category.name}</h3>
        </div>
      </header>

      <div className="entry-card__content">
        {isWorkout ? (
          <WorkoutDetails exercises={data.exercises} />
        ) : entry.category === "reading" ? (
          <dl className="entry-card__details">
            <ReadingDetails data={data} />
          </dl>
        ) : entry.category === "running" ? (
          <dl className="entry-card__details">
            <RunningDetails data={data} />
          </dl>
        ) : entry.category === "cardio" ? (
          <dl className="entry-card__details">
            <CardioDetails data={data} />
          </dl>
        ) : entry.category === "skill" ? (
          <dl className="entry-card__details">
            <SkillDetails data={data} />
          </dl>
        ) : (
          <dl className="entry-card__details">
            <SimpleEntryDetails category={category} data={data} />
          </dl>
        )}
      </div>

      <PointBreakdown result={pointBreakdown} />

      {!readOnly && (
        <div className="entry-card__actions">
          <button
            className="button button--danger"
            type="button"
            onClick={() => onDelete?.(entry.id)}
          >
            Delete entry
          </button>
        </div>
      )}
    </article>
  );
}
