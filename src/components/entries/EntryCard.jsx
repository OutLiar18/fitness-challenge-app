import { useState } from "react";

import { WORKOUT_CATEGORIES } from "../../constants/categories";
import { getEvidenceDisplayStatus } from "../../services/evidence/evidenceModel";
import { getEntryPointBreakdown } from "../../services/points";
import {
  formatKilometres,
  formatMeasurement,
  formatNumber,
  formatPoints,
  pluralize,
} from "../../utils/displayFormatters";
import { getCategory } from "../../utils/categoryHelpers";
import { copyTextToClipboard } from "../../utils/clipboard";
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


const evidenceDeadlineFormatter = new Intl.DateTimeFormat("en-ZA", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatEvidenceDeadline(value) {
  const date = typeof value?.toDate === "function"
    ? value.toDate()
    : new Date(value ?? 0);
  return date instanceof Date && !Number.isNaN(date.getTime())
    ? evidenceDeadlineFormatter.format(date)
    : "Deadline unavailable";
}

function getEvidencePointMessage(claim) {
  if (claim.claimType === "daily-bonus") {
    return `Up to ${formatPoints(claim.bonusPointsAvailable)} bonus season points after proof review.`;
  }
  if (claim.category === "running") {
    return `${formatPoints(claim.pendingPoints)} Running points are waiting for proof. Cardio points still count immediately.`;
  }
  return `${formatPoints(claim.pendingPoints)} Steps points are waiting for proof.`;
}

function EvidenceStatus({ claims = [] }) {
  const [copiedCode, setCopiedCode] = useState("");
  if (claims.length === 0) return null;

  async function copyCode(code) {
    try {
      await copyTextToClipboard(code);
      setCopiedCode(code);
      window.setTimeout(() => setCopiedCode(""), 1800);
    } catch (error) {
      console.error(error);
      setCopiedCode("");
    }
  }

  return (
    <section className="entry-evidence" aria-label="Season proof status">
      <div className="entry-evidence__heading">
        <div>
          <span>WhatsApp proof</span>
          <strong>Send the verification ID with your picture or screenshot</strong>
        </div>
      </div>
      <p className="entry-evidence__note">
        Proof media stays in WhatsApp. The app stores only the review status,
        points decision and audit history. Player-facing standings update from
        the latest published daily snapshot.
      </p>
      <div className="entry-evidence__claims">
        {claims.map((claim) => {
          const status = getEvidenceDisplayStatus(claim);
          return (
            <article className="entry-evidence__claim" key={claim.id}>
              <div>
                <span className={`entry-evidence__status entry-evidence__status--${status?.tone ?? "warning"}`}>
                  {status?.label ?? "Evidence status unavailable"}
                </span>
                <strong>{claim.leagueName || "Season evidence"}</strong>
                <small>{getEvidencePointMessage(claim)}</small>
                <small>Submit within 24 hours · deadline {formatEvidenceDeadline(claim.deadlineAt)}</small>
                {claim.reviewReason && <small>{claim.reviewReason}</small>}
              </div>
              <div className="entry-evidence__code">
                <code>{claim.verificationCode}</code>
                <button
                  className="button button--secondary"
                  type="button"
                  onClick={() => copyCode(claim.verificationCode)}
                >
                  {copiedCode === claim.verificationCode ? "Copied" : "Copy ID"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default function EntryCard({ entry, onDelete, readOnly = false, evidenceClaims = [] }) {
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
  const isEvidenceLocked = (entry.evidenceClaimIds ?? []).length > 0;

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
      <EvidenceStatus claims={evidenceClaims} />

      {!readOnly && isEvidenceLocked && (
        <div className="inline-alert">
          This entry is locked because it has a season verification ID. An
          administrator must use the audited correction process if its scoring
          record needs to change.
        </div>
      )}

      {!readOnly && !isEvidenceLocked && (
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
