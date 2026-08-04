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

function PointBreakdown({ result, historical = false }) {
  return (
    <section
      className={`entry-points${historical ? " entry-points--historical" : ""}`}
      aria-label={historical ? "Historical points no longer counted" : "Points earned"}
    >
      <div className="entry-points__heading">
        <span>{historical ? "Historical points · no longer counted" : "Points earned"}</span>
        <strong>{historical ? formatPoints(result.total) : `+${formatPoints(result.total)}`}</strong>
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
            <strong>{historical ? formatPoints(item.points) : `+${formatPoints(item.points)}`}</strong>
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


function formatCorrectionTimestamp(value) {
  const date = typeof value?.toDate === "function"
    ? value.toDate()
    : new Date(value ?? 0);
  return date instanceof Date && !Number.isNaN(date.getTime())
    ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date)
    : "Time unavailable";
}

function CorrectionHistory({ correction }) {
  if (!correction?.isCorrected || correction.chain?.length === 0) return null;

  return (
    <details className="entry-correction">
      <summary>
        <span aria-hidden="true">🧾</span>
        Audited correction history · {correction.chain.length}{" "}
        {correction.chain.length === 1 ? "replacement" : "replacements"}
      </summary>
      <div className="entry-correction__content">
        <p>
          Earlier versions remain preserved for audit and personal export. Only the
          correction chain’s current factual record contributes to personal statistics.
          Competition changes use immutable reversal and replacement records.
        </p>
        <ol>
          {correction.chain.map((item) => (
            <li key={item.id}>
              <div>
                <strong>Correction {item.sequence}</strong>
                <span>{formatCorrectionTimestamp(item.createdAt)}</span>
              </div>
              <p>{item.reason}</p>
              <small>
                Point change: {Number(item.pointDelta ?? 0) >= 0 ? "+" : ""}
                {formatPoints(item.pointDelta ?? 0)} · source {item.sourceEntryId} · replacement {item.replacementEntryId}
              </small>
            </li>
          ))}
        </ol>
      </div>
    </details>
  );
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
  const isCorrectionLocked =
    entry.source === "correction" || entry.correction?.isCorrected === true;
  const isSuperseded = entry.correction?.isSuperseded === true;

  return (
    <article className={`entry-card${isSuperseded ? " entry-card--superseded" : ""}`}>
      <header className="entry-card__header">
        <span className="entry-card__emoji" aria-hidden="true">
          {category.emoji}
        </span>
        <div>
          <p className="entry-card__type">
            {isSuperseded
              ? "Superseded entry · preserved history"
              : isCorrectionLocked
                ? "Current corrected entry"
                : "Challenge entry"}
          </p>
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

      <PointBreakdown result={pointBreakdown} historical={isSuperseded} />
      <EvidenceStatus claims={evidenceClaims} />
      <CorrectionHistory correction={entry.correction} />

      {(isSuperseded || (!readOnly && (isEvidenceLocked || isCorrectionLocked))) && (
        <div className="inline-alert">
          {isSuperseded
            ? "This preserved version is no longer included in your current points or statistics. It remains visible so the factual correction history can be audited."
            : isCorrectionLocked
              ? "This is the current version of an audited correction chain. It cannot be deleted or edited silently; a Platform Administrator must create another replacement if the factual record is still wrong."
              : "This entry is locked because it has a season verification ID. A Platform Administrator must use the audited correction process if its factual record needs to change."}
        </div>
      )}

      {!readOnly && !isEvidenceLocked && !isCorrectionLocked && (
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
