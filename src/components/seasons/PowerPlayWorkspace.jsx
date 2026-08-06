import { useMemo, useState } from "react";

import {
  POWER_PLAY_CATEGORY_TEMPLATES,
  POWER_PLAY_MULTIPLIERS,
} from "../../constants/powerPlays";
import { formatDateInputValue } from "../../services/dateService";
import {
  createPowerPlayId,
  getPowerPlayReadiness,
  getPowerPlayWeekTiming,
  getSeasonPowerPlayWeeks,
  summarizeCurrentPowerPlay,
} from "../../services/seasons/powerPlayModel";
import {
  correctPowerPlayAssignment,
  savePowerPlayPool,
  selectRandomPowerPlay,
} from "../../services/seasons/powerPlayService";
import { formatNumber } from "../../utils/displayFormatters";
import "./PowerPlayWorkspace.css";

const EMPTY_POWER_PLAYS = Object.freeze([]);

function clonePowerPlays(items = []) {
  return items.map((item) => ({
    ...item,
    categories: [...(item.categories ?? [])],
  }));
}

function categoryLabel(categoryId) {
  return POWER_PLAY_CATEGORY_TEMPLATES.find((item) => item.id === categoryId)?.label
    ?? categoryId;
}

function PowerPlayEditor({ item, onChange, onRemove }) {
  const isBase = item.sourceType === "base";
  return (
    <article className="power-play-editor card">
      <div className="power-play-editor__heading">
        <div>
          <p className="section-kicker">{isBase ? `${categoryLabel(item.baseCategory)} base play` : "Custom Power Play"}</p>
          <h3>{item.name || "Untitled Power Play"}</h3>
        </div>
        {!isBase && (
          <button className="button button--danger button--compact" type="button" onClick={onRemove}>
            Remove
          </button>
        )}
      </div>

      <label className="form-field">
        <span>Theme-specific name</span>
        <input
          value={item.name}
          minLength={4}
          maxLength={80}
          placeholder="Release the Kraken"
          onChange={(event) => onChange({ name: event.target.value })}
        />
      </label>
      <label className="form-field">
        <span>Player-facing description</span>
        <textarea
          value={item.description}
          minLength={10}
          maxLength={260}
          onChange={(event) => onChange({ description: event.target.value })}
        />
      </label>
      <div className="power-play-editor__rules">
        <label className="form-field">
          <span>Multiplier</span>
          <select
            value={item.multiplier}
            onChange={(event) => onChange({ multiplier: Number(event.target.value) })}
          >
            {POWER_PLAY_MULTIPLIERS.map((value) => (
              <option key={value} value={value}>{value}× activity points</option>
            ))}
          </select>
        </label>
        <label className="power-play-toggle">
          <input
            type="checkbox"
            checked={item.enabled !== false}
            onChange={(event) => onChange({ enabled: event.target.checked })}
          />
          <span><strong>Enabled</strong><small>Available for random selection</small></span>
        </label>
        <label className="power-play-toggle">
          <input
            type="checkbox"
            checked={item.themeNameConfirmed === true}
            onChange={(event) => onChange({ themeNameConfirmed: event.target.checked })}
          />
          <span><strong>Theme name confirmed</strong><small>Required before registration opens</small></span>
        </label>
      </div>

      <fieldset className="power-play-categories" disabled={isBase}>
        <legend>Categories receiving the multiplier</legend>
        <div>
          {POWER_PLAY_CATEGORY_TEMPLATES.map((category) => {
            const checked = item.categories?.includes(category.id) ?? false;
            return (
              <label key={category.id}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(event) => {
                    const next = event.target.checked
                      ? [...new Set([...(item.categories ?? []), category.id])]
                      : (item.categories ?? []).filter((value) => value !== category.id);
                    onChange({ categories: next });
                  }}
                />
                <span aria-hidden="true">{category.icon}</span>
                {category.label}
              </label>
            );
          })}
        </div>
      </fieldset>
    </article>
  );
}

function AssignmentCard({ week, assignment, powerPlay, canManage, onSelect, onRedraw }) {
  const { started, ended } = getPowerPlayWeekTiming(week);
  return (
    <article className={`power-play-week card ${assignment ? "power-play-week--assigned" : ""}`}>
      <div className="power-play-week__date">
        <span>Week {week.weekIndex}</span>
        <strong>{formatDateInputValue(week.startDate)} – {formatDateInputValue(week.endDate)}</strong>
        {week.partial && <small>Final partial season week</small>}
      </div>
      {assignment && powerPlay ? (
        <div className="power-play-week__identity">
          <span className="power-play-multiplier">{powerPlay.multiplier}×</span>
          <div>
            <strong>{powerPlay.name}</strong>
            <small>{powerPlay.categories.map(categoryLabel).join(" + ")}</small>
          </div>
        </div>
      ) : (
        <div className="power-play-week__empty">
          <strong>No Power Play selected</strong>
          <small>{ended ? "This week ended without an assignment." : "An administrator must reveal the random play."}</small>
        </div>
      )}
      {canManage && !ended && (
        <div className="power-play-week__actions">
          {!assignment ? (
            <button className="button button--primary button--compact" type="button" onClick={onSelect}>
              Select random Power Play
            </button>
          ) : !started ? (
            <button className="button button--secondary button--compact" type="button" onClick={onRedraw}>
              Redraw before week
            </button>
          ) : (
            <small>Locked after the week begins</small>
          )}
        </div>
      )}
    </article>
  );
}

export default function PowerPlayWorkspace({
  league,
  assignments = [],
  actorId,
  canManage = false,
  isPlatformAdmin = false,
  notify,
}) {
  const sourcePowerPlays = league.ruleset?.powerPlayPolicy?.powerPlays ?? EMPTY_POWER_PLAYS;
  const [draftPowerPlays, setDraftPowerPlays] = useState(() => clonePowerPlays(sourcePowerPlays));
  const [saving, setSaving] = useState(false);
  const [workingWeekKey, setWorkingWeekKey] = useState("");
  const [correctionWeekKey, setCorrectionWeekKey] = useState("");
  const [replacementPowerPlayId, setReplacementPowerPlayId] = useState("");
  const [correctionReason, setCorrectionReason] = useState("");

  const weeks = useMemo(() => getSeasonPowerPlayWeeks(league), [league]);
  const assignmentByWeek = useMemo(
    () => new Map(assignments.map((item) => [item.weekKey, item])),
    [assignments],
  );
  const powerPlayById = useMemo(
    () => new Map(sourcePowerPlays.map((item) => [item.id, item])),
    [sourcePowerPlays],
  );
  const readiness = useMemo(
    () => getPowerPlayReadiness({ league, powerPlays: sourcePowerPlays }),
    [league, sourcePowerPlays],
  );
  const current = useMemo(
    () => summarizeCurrentPowerPlay({ league, assignments }),
    [assignments, league],
  );
  const usedIds = new Set(league.powerPlayState?.usedPowerPlayIds ?? []);
  const availableCorrectionPlays = sourcePowerPlays.filter(
    (item) => item.enabled !== false && item.themeNameConfirmed === true && !usedIds.has(item.id),
  );
  const lockedAssignments = assignments.filter((item) => {
    const week = weeks.find((candidate) => candidate.weekKey === item.weekKey);
    return week && getPowerPlayWeekTiming(week).started;
  });

  function updateDraft(id, patch) {
    setDraftPowerPlays((currentItems) => currentItems.map((item) =>
      item.id === id
        ? {
            ...item,
            ...patch,
            normalizedName: patch.name !== undefined
              ? String(patch.name).trim().replace(/\s+/g, " ").toLocaleLowerCase()
              : item.normalizedName,
          }
        : item,
    ));
  }

  async function savePool() {
    if (saving) return;
    setSaving(true);
    try {
      await savePowerPlayPool({ league, powerPlays: draftPowerPlays, actorId });
      notify?.("The themed Power Play pool was saved.", "success");
    } catch (error) {
      console.error(error);
      notify?.(error.message || "The Power Play pool could not be saved.", "error");
    } finally {
      setSaving(false);
    }
  }

  function addCustomPowerPlay() {
    const name = `${league.theme || "Season"} Custom Power Play`;
    const item = {
      id: createPowerPlayId({ name }),
      sourceType: "custom",
      baseCategory: "",
      name,
      normalizedName: name.toLocaleLowerCase(),
      description: "Describe the themed event and the categories receiving boosted activity points.",
      multiplier: 2,
      categories: ["water"],
      enabled: true,
      themeNameConfirmed: false,
      sortOrder: draftPowerPlays.length + 1,
    };
    setDraftPowerPlays((currentItems) => [...currentItems, item]);
  }

  async function selectWeek(weekKey, redraw = false) {
    if (workingWeekKey) return;
    let reason = "";
    if (redraw) {
      reason = window.prompt("Explain why this pre-week Power Play needs to be redrawn:") ?? "";
      if (!reason) return;
    }
    setWorkingWeekKey(weekKey);
    try {
      const result = await selectRandomPowerPlay({ league, weekKey, actorId, reason });
      notify?.(`${result.powerPlay.name} was selected and cannot appear again this season.`, "success", 5200);
    } catch (error) {
      console.error(error);
      notify?.(error.message || "The weekly Power Play could not be selected.", "error");
    } finally {
      setWorkingWeekKey("");
    }
  }

  async function correctAssignment(event) {
    event.preventDefault();
    if (workingWeekKey) return;
    setWorkingWeekKey(correctionWeekKey);
    try {
      const result = await correctPowerPlayAssignment({
        league,
        weekKey: correctionWeekKey,
        replacementPowerPlayId,
        actorId,
        reason: correctionReason,
        isPlatformAdmin,
      });
      notify?.(`The locked assignment was corrected to ${result.powerPlay.name}.`, "success", 5200);
      setCorrectionWeekKey("");
      setReplacementPowerPlayId("");
      setCorrectionReason("");
    } catch (error) {
      console.error(error);
      notify?.(error.message || "The Power Play correction could not be recorded.", "error");
    } finally {
      setWorkingWeekKey("");
    }
  }

  return (
    <div className="power-play-workspace">
      <section className={`power-play-hero card power-play-hero--${current.status}`}>
        <span aria-hidden="true">⚡</span>
        <div>
          <p className="section-kicker">Weekly season modifier</p>
          <h2>
            {current.powerPlay
              ? `${current.powerPlay.multiplier}× ${current.powerPlay.name}`
              : current.status === "outside-season"
                ? "Power Plays begin with the season"
                : "This week’s Power Play is waiting to be revealed"}
          </h2>
          <p>
            {current.powerPlay
              ? `${current.powerPlay.categories.map(categoryLabel).join(" and ")} competitive activity points are multiplied for this official season week. Goal, streak, mission and evidence-bonus points are unchanged.`
              : "One unused Power Play is selected at random for every official season week. A selected play can never return later in the same season."}
          </p>
        </div>
      </section>

      {league.status === "draft" && canManage && (
        <>
          <section className="power-play-readiness card">
            <div>
              <p className="section-kicker">Theme workshop</p>
              <h2>Name the season’s Power Plays</h2>
              <p>
                The ten base mechanics are already present. Rename each one to match <strong>{league.theme}</strong>—for example, a mythological Water play could become <em>Release the Kraken</em>.
              </p>
            </div>
            <div className="power-play-readiness__score">
              <strong>{readiness.checks.filter((check) => check.complete).length}/{readiness.checks.length}</strong>
              <span>{readiness.ready ? "Ready for registration" : "Setup incomplete"}</span>
            </div>
            <ul>
              {readiness.checks.map((check) => (
                <li key={check.id} className={check.complete ? "is-complete" : ""}>
                  <span aria-hidden="true">{check.complete ? "✓" : "○"}</span>
                  <div><strong>{check.label}</strong><small>{check.detail}</small></div>
                </li>
              ))}
            </ul>
          </section>

          <div className="power-play-editor-grid">
            {draftPowerPlays.map((item) => (
              <PowerPlayEditor
                key={item.id}
                item={item}
                onChange={(patch) => updateDraft(item.id, patch)}
                onRemove={() => setDraftPowerPlays((currentItems) => currentItems.filter((candidate) => candidate.id !== item.id))}
              />
            ))}
          </div>
          <section className="power-play-editor-actions card">
            <div>
              <strong>{formatNumber(draftPowerPlays.length, { whole: true })} Power Plays configured</strong>
              <small>Custom plays may target one or several categories and use a 2× or 3× multiplier.</small>
            </div>
            <button className="button button--secondary" type="button" onClick={addCustomPowerPlay}>Add custom Power Play</button>
            <button className="button button--primary" type="button" disabled={saving} onClick={savePool}>
              {saving ? "Saving…" : "Save Power Play pool"}
            </button>
          </section>
        </>
      )}

      <section className="power-play-schedule">
        <div className="community-section-heading">
          <div>
            <p className="section-kicker">No-repeat season draw</p>
            <h2>Official weekly schedule</h2>
          </div>
          <span>{assignments.length}/{weeks.length} weeks selected</span>
        </div>
        <div className="power-play-week-grid">
          {weeks.map((week) => {
            const assignment = assignmentByWeek.get(week.weekKey);
            return (
              <AssignmentCard
                key={week.weekKey}
                week={week}
                assignment={assignment}
                powerPlay={assignment ? powerPlayById.get(assignment.powerPlayId) : null}
                canManage={canManage && ["registration", "active"].includes(league.status)}
                onSelect={() => selectWeek(week.weekKey)}
                onRedraw={() => selectWeek(week.weekKey, true)}
              />
            );
          })}
        </div>
      </section>

      {isPlatformAdmin && lockedAssignments.length > 0 && availableCorrectionPlays.length > 0 && (
        <form className="power-play-correction card" onSubmit={correctAssignment}>
          <div>
            <p className="section-kicker">Audited factual correction</p>
            <h2>Correct a locked weekly assignment</h2>
            <p>
              This recalculates standings from the immutable activity ledger and the corrected weekly rule. The replaced play stays used and cannot return later in the season.
            </p>
          </div>
          <label className="form-field">
            <span>Locked week</span>
            <select required value={correctionWeekKey} onChange={(event) => setCorrectionWeekKey(event.target.value)}>
              <option value="">Choose a week</option>
              {lockedAssignments.map((assignment) => (
                <option key={assignment.weekKey} value={assignment.weekKey}>
                  Week {assignment.weekIndex}: {assignment.powerPlayName}
                </option>
              ))}
            </select>
          </label>
          <label className="form-field">
            <span>Unused replacement</span>
            <select required value={replacementPowerPlayId} onChange={(event) => setReplacementPowerPlayId(event.target.value)}>
              <option value="">Choose an unused Power Play</option>
              {availableCorrectionPlays.map((item) => (
                <option key={item.id} value={item.id}>{item.multiplier}× {item.name}</option>
              ))}
            </select>
          </label>
          <label className="form-field">
            <span>Correction reason</span>
            <textarea required minLength={8} maxLength={500} value={correctionReason} onChange={(event) => setCorrectionReason(event.target.value)} />
          </label>
          <button className="button button--danger" type="submit" disabled={Boolean(workingWeekKey)}>
            {workingWeekKey ? "Recording correction…" : "Record audited correction"}
          </button>
        </form>
      )}
    </div>
  );
}
