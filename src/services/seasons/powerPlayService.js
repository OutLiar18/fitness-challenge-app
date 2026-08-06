import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  Timestamp,
  where,
  writeBatch,
} from "firebase/firestore";

import { db } from "../../firebase";
import { addAuditWrite } from "../admin/auditService";
import { createPlayerNotificationWrite } from "../notifications/notificationService";
import {
  chooseRandomPowerPlay,
  createPowerPlayDefinitionMap,
  createPowerPlayWeekId,
  getPowerPlayWeekTiming,
  getSeasonPowerPlayWeeks,
  normalizePowerPlayInput,
} from "./powerPlayModel";

function mapSnapshot(snapshot) {
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

function cleanReason(value) {
  return String(value ?? "").trim().replace(/\s+/g, " ").slice(0, 500);
}

function findWeek(league, weekKey) {
  return getSeasonPowerPlayWeeks(league).find((week) => week.weekKey === weekKey) ?? null;
}

function resolvePowerPlay(policy, powerPlayId) {
  return (policy?.powerPlays ?? []).find((item) => item.id === powerPlayId) ?? null;
}

const POWER_PLAY_CATEGORY_LABELS = Object.freeze({
  water: "Water",
  fruit: "Fruit",
  reading: "Reading",
  running: "Running",
  upperBody: "Upper Body",
  lowerBody: "Lower Body",
  core: "Core",
  cardio: "Cardio",
  skill: "Skill Development",
  steps: "Steps",
});

function createInitialPowerPlayState() {
  return {
    usedPowerPlayIds: [],
    selectionCount: 0,
    lastWeekKey: "",
    lastPowerPlayId: "",
    lastSelectionAt: null,
    lastSelectionBy: "",
  };
}

export function subscribeToLeaguePowerPlayWeeks(
  leagueOrId,
  onUpdate,
  onError,
  { includeFuture = false } = {},
) {
  const league = typeof leagueOrId === "string"
    ? { id: leagueOrId }
    : (leagueOrId ?? {});
  const leagueId = league.id || "";
  if (!leagueId) {
    onUpdate?.([]);
    return () => {};
  }

  if (includeFuture) {
    return onSnapshot(
      query(collection(db, "leaguePowerPlayWeeks"), where("leagueId", "==", leagueId)),
      (snapshot) => onUpdate?.(
        mapSnapshot(snapshot).sort(
          (first, second) => Number(first.weekIndex ?? 0) - Number(second.weekIndex ?? 0),
        ),
      ),
      onError,
    );
  }

  const startedWeeks = getSeasonPowerPlayWeeks(league).filter(
    (week) => getPowerPlayWeekTiming(week).started,
  );
  if (startedWeeks.length === 0) {
    onUpdate?.([]);
    return () => {};
  }

  const records = new Map();
  const emit = () => onUpdate?.(
    [...records.values()].sort(
      (first, second) => Number(first.weekIndex ?? 0) - Number(second.weekIndex ?? 0),
    ),
  );
  const unsubscribers = startedWeeks.map((week) => onSnapshot(
    doc(db, "leaguePowerPlayWeeks", createPowerPlayWeekId(leagueId, week.weekKey)),
    (snapshot) => {
      if (snapshot.exists()) {
        records.set(snapshot.id, { id: snapshot.id, ...snapshot.data() });
      } else {
        records.delete(snapshot.id);
      }
      emit();
    },
    onError,
  ));

  return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
}

export async function savePowerPlayPool({ league, powerPlays, actorId }) {
  if (!league?.id || !actorId) throw new Error("A managed season is required.");
  if (league.status !== "draft") {
    throw new Error("Power Play names and custom rules freeze when registration opens.");
  }
  const normalized = [];
  for (const input of powerPlays ?? []) {
    const result = normalizePowerPlayInput(input, normalized);
    if (!result.valid) throw new Error(result.errors.join(" "));
    normalized.push(result.value);
  }
  const reference = doc(db, "leagues", league.id);
  const batch = writeBatch(db);
  const auditReference = addAuditWrite(batch, {
    actorId,
    action: "power-play.pool-updated",
    entityType: "league",
    entityId: league.id,
    summary: `Updated the themed Power Play pool for ${league.name}`,
    details: {
      powerPlayCount: normalized.length,
      enabledCount: normalized.filter((item) => item.enabled).length,
      names: normalized.map((item) => item.name),
    },
  });
  batch.update(reference, {
    ruleset: {
      ...league.ruleset,
      powerPlayPolicy: {
        ...league.ruleset.powerPlayPolicy,
        powerPlays: normalized,
        powerPlayDefinitions: createPowerPlayDefinitionMap(normalized),
      },
    },
    updatedAt: serverTimestamp(),
    updatedBy: actorId,
    lastAuditId: auditReference.id,
  });
  await batch.commit();
}

async function sendPowerPlayNotifications({ league, powerPlay, week, correction = false }) {
  if (!getPowerPlayWeekTiming(week).started) return;
  const memberships = await getDocs(
    query(collection(db, "leagueMemberships"), where("leagueId", "==", league.id)),
  );
  if (memberships.empty) return;
  const batch = writeBatch(db);
  memberships.docs.slice(0, 450).forEach((membershipDocument) => {
    const membership = membershipDocument.data();
    createPlayerNotificationWrite(batch, {
      userId: membership.userId,
      type: correction ? "power-play-corrected" : "power-play-selected",
      title: correction ? "Weekly Power Play corrected" : `${powerPlay.multiplier}× Power Play revealed`,
      message: `${powerPlay.name} boosts ${powerPlay.categories.map((category) => POWER_PLAY_CATEGORY_LABELS[category] || category).join(", ")} activity points during ${week.startDateKey} to ${week.endDateKey}.`,
      leagueId: league.id,
      houseId: membership.currentHouseId || "",
      actionPath: `/seasons?league=${league.id}&tab=power-plays`,
    });
  });
  await batch.commit();
}

export async function selectRandomPowerPlay({ league, weekKey, actorId, reason = "" }) {
  if (!league?.id || !actorId) throw new Error("A managed season is required.");
  const requestedWeek = findWeek(league, weekKey);
  if (!requestedWeek) throw new Error("Choose a valid official season week.");
  const weekReference = doc(db, "leaguePowerPlayWeeks", createPowerPlayWeekId(league.id, weekKey));
  const leagueReference = doc(db, "leagues", league.id);
  const cleanSelectionReason = cleanReason(reason);

  const result = await runTransaction(db, async (transaction) => {
    const [leagueSnapshot, weekSnapshot] = await Promise.all([
      transaction.get(leagueReference),
      transaction.get(weekReference),
    ]);
    if (!leagueSnapshot.exists()) throw new Error("That season no longer exists.");
    const liveLeague = { id: leagueSnapshot.id, ...leagueSnapshot.data() };
    if (liveLeague.ruleset?.modules?.powerPlay !== true) {
      throw new Error("This historical season does not use Power Plays.");
    }
    if (!["registration", "active"].includes(liveLeague.status)) {
      throw new Error("Power Plays may be selected only for a registration or active season.");
    }
    const liveWeek = findWeek(liveLeague, weekKey);
    if (!liveWeek) throw new Error("The season dates changed and this week is no longer valid.");
    const timing = getPowerPlayWeekTiming(liveWeek);
    if (timing.ended) throw new Error("This season week has already ended.");
    if (weekSnapshot.exists() && timing.started) {
      throw new Error("This Power Play is locked because the week has started. Use the audited Platform Administrator correction path.");
    }
    if (weekSnapshot.exists() && cleanSelectionReason.length < 8) {
      throw new Error("Explain the pre-week redraw in at least 8 characters.");
    }

    const policy = liveLeague.ruleset.powerPlayPolicy;
    const state = liveLeague.powerPlayState ?? createInitialPowerPlayState();
    const usedIds = [...new Set(state.usedPowerPlayIds ?? [])];
    const eligible = (policy.powerPlays ?? []).filter(
      (item) => item.enabled !== false && item.themeNameConfirmed === true && !usedIds.includes(item.id),
    );
    const sequence = Number(state.selectionCount ?? 0) + 1;
    const selected = chooseRandomPowerPlay({
      leagueId: liveLeague.id,
      weekKey,
      sequence,
      eligiblePowerPlays: eligible,
    });
    if (!selected) {
      throw new Error("No unused enabled Power Play remains. Add enough unique Power Plays before the season starts.");
    }

    const previous = weekSnapshot.exists() ? weekSnapshot.data() : null;
    const auditReference = addAuditWrite(transaction, {
      actorId,
      action: previous ? "power-play.week-redrawn" : "power-play.week-selected",
      entityType: "league",
      entityId: liveLeague.id,
      summary: `${previous ? "Redrew" : "Selected"} ${selected.name} for ${liveLeague.name} ${weekKey}`,
      details: {
        weekKey,
        weekIndex: liveWeek.weekIndex,
        powerPlayId: selected.id,
        previousPowerPlayId: previous?.powerPlayId || "",
        reason: cleanSelectionReason,
        multiplier: selected.multiplier,
        categories: selected.categories,
      },
    });

    transaction.set(weekReference, {
      leagueId: liveLeague.id,
      leagueName: liveLeague.name,
      weekKey,
      weekIndex: liveWeek.weekIndex,
      startDate: Timestamp.fromDate(liveWeek.startDate),
      endDate: Timestamp.fromDate(liveWeek.endDate),
      powerPlayId: selected.id,
      powerPlayName: selected.name,
      multiplier: selected.multiplier,
      categories: selected.categories,
      selectionSequence: sequence,
      previousPowerPlayIds: [
        ...new Set([
          ...(previous?.previousPowerPlayIds ?? []),
          ...(previous?.powerPlayId ? [previous.powerPlayId] : []),
        ]),
      ],
      redrawCount: Number(previous?.redrawCount ?? 0) + (previous ? 1 : 0),
      lastSelectionReason: cleanSelectionReason,
      selectedAt: serverTimestamp(),
      selectedBy: actorId,
      correctedAt: previous?.correctedAt ?? null,
      correctedBy: previous?.correctedBy ?? "",
      correctionReason: previous?.correctionReason ?? "",
      correctionCount: Number(previous?.correctionCount ?? 0),
      lastAuditId: auditReference.id,
    });
    transaction.update(leagueReference, {
      powerPlayState: {
        usedPowerPlayIds: [...usedIds, selected.id],
        selectionCount: sequence,
        lastWeekKey: weekKey,
        lastPowerPlayId: selected.id,
        lastSelectionAt: serverTimestamp(),
        lastSelectionBy: actorId,
      },
      updatedAt: serverTimestamp(),
      updatedBy: actorId,
      lastAuditId: auditReference.id,
    });
    return { league: liveLeague, powerPlay: selected, week: liveWeek };
  });

  await sendPowerPlayNotifications(result);
  return result;
}

export async function correctPowerPlayAssignment({
  league,
  weekKey,
  replacementPowerPlayId,
  actorId,
  reason,
  isPlatformAdmin = false,
}) {
  if (!isPlatformAdmin) throw new Error("Only a Platform Administrator may correct a locked Power Play.");
  const cleanCorrectionReason = cleanReason(reason);
  if (cleanCorrectionReason.length < 8) throw new Error("Explain the factual correction in at least 8 characters.");
  const weekReference = doc(db, "leaguePowerPlayWeeks", createPowerPlayWeekId(league.id, weekKey));
  const leagueReference = doc(db, "leagues", league.id);

  const result = await runTransaction(db, async (transaction) => {
    const [leagueSnapshot, weekSnapshot] = await Promise.all([
      transaction.get(leagueReference),
      transaction.get(weekReference),
    ]);
    if (!leagueSnapshot.exists() || !weekSnapshot.exists()) {
      throw new Error("The selected Power Play assignment could not be loaded.");
    }
    const liveLeague = { id: leagueSnapshot.id, ...leagueSnapshot.data() };
    const liveWeek = findWeek(liveLeague, weekKey);
    if (!liveWeek) throw new Error("That official season week no longer exists.");
    const current = weekSnapshot.data();
    if (current.powerPlayId === replacementPowerPlayId) {
      throw new Error("Choose a different unused Power Play for the correction.");
    }
    const state = liveLeague.powerPlayState ?? createInitialPowerPlayState();
    const usedIds = [...new Set(state.usedPowerPlayIds ?? [])];
    if (usedIds.includes(replacementPowerPlayId)) {
      throw new Error("A Power Play already selected earlier in this season cannot be used again.");
    }
    const replacement = resolvePowerPlay(liveLeague.ruleset?.powerPlayPolicy, replacementPowerPlayId);
    if (!replacement || replacement.enabled === false || replacement.themeNameConfirmed !== true) {
      throw new Error("Choose an enabled, theme-confirmed Power Play from this season.");
    }
    const sequence = Number(state.selectionCount ?? 0) + 1;
    const auditReference = addAuditWrite(transaction, {
      actorId,
      action: "power-play.assignment-corrected",
      entityType: "league",
      entityId: liveLeague.id,
      summary: `Corrected ${liveLeague.name} ${weekKey} Power Play to ${replacement.name}`,
      details: {
        weekKey,
        previousPowerPlayId: current.powerPlayId,
        replacementPowerPlayId,
        reason: cleanCorrectionReason,
      },
    });
    transaction.update(weekReference, {
      powerPlayId: replacement.id,
      powerPlayName: replacement.name,
      multiplier: replacement.multiplier,
      categories: replacement.categories,
      selectionSequence: sequence,
      previousPowerPlayIds: [
        ...new Set([...(current.previousPowerPlayIds ?? []), current.powerPlayId]),
      ],
      correctedAt: serverTimestamp(),
      correctedBy: actorId,
      correctionReason: cleanCorrectionReason,
      correctionCount: Number(current.correctionCount ?? 0) + 1,
      lastAuditId: auditReference.id,
    });
    transaction.update(leagueReference, {
      powerPlayState: {
        usedPowerPlayIds: [...usedIds, replacement.id],
        selectionCount: sequence,
        lastWeekKey: weekKey,
        lastPowerPlayId: replacement.id,
        lastSelectionAt: serverTimestamp(),
        lastSelectionBy: actorId,
      },
      updatedAt: serverTimestamp(),
      updatedBy: actorId,
      lastAuditId: auditReference.id,
    });
    return { league: liveLeague, powerPlay: replacement, week: liveWeek };
  });

  await sendPowerPlayNotifications({ ...result, correction: true });
  return result;
}
