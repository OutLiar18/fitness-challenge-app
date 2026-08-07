import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  Timestamp,
  where,
  writeBatch,
} from "firebase/firestore";

import { DEFAULT_AVATAR_ID } from "../../constants/avatars";
import {
  LEAGUE_PARTICIPANT_LIMIT,
  LEAGUE_STATUSES,
} from "../../constants/leagues";
import { db } from "../../firebase";
import { addAuditWrite } from "../admin/auditService";
import { createSeasonInviteCode, normalizeSeasonCode } from "../seasons/seasonModel";
import {
  canTransitionLeague,
  validateLeagueInput,
  validatePowerPlayReadinessForRegistration,
} from "./leagueModel";

function mapSnapshot(snapshot) {
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

async function reserveLeagueCode() {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const code = createSeasonInviteCode();
    const snapshot = await getDoc(doc(db, "leagueInvites", code));
    if (!snapshot.exists()) return code;
  }
  throw new Error("A unique league invitation code could not be created.");
}

export function subscribeToPublishedLeagues(onUpdate, onError) {
  return onSnapshot(
    query(
      collection(db, "leagues"),
      where("status", "in", [
        LEAGUE_STATUSES.REGISTRATION,
        LEAGUE_STATUSES.ACTIVE,
        LEAGUE_STATUSES.COMPLETED,
        LEAGUE_STATUSES.ARCHIVED,
      ]),
    ),
    (snapshot) => onUpdate?.(mapSnapshot(snapshot)),
    onError,
  );
}

export function subscribeToManagedLeagues(userId, onUpdate, onError) {
  if (!userId) {
    onUpdate?.([]);
    return () => {};
  }
  return onSnapshot(
    query(collection(db, "leagues"), where("administratorIds", "array-contains", userId)),
    (snapshot) => onUpdate?.(mapSnapshot(snapshot)),
    onError,
  );
}

export function subscribeToAllLeagues(onUpdate, onError) {
  return onSnapshot(
    collection(db, "leagues"),
    (snapshot) => onUpdate?.(mapSnapshot(snapshot)),
    onError,
  );
}

export function subscribeToPlayerLeagueMemberships(userId, onUpdate, onError) {
  if (!userId) {
    onUpdate?.([]);
    return () => {};
  }
  return onSnapshot(
    query(collection(db, "leagueMemberships"), where("userId", "==", userId)),
    (snapshot) => onUpdate?.(mapSnapshot(snapshot)),
    onError,
  );
}

export function subscribeToLeagueMemberships(leagueId, onUpdate, onError) {
  if (!leagueId) {
    onUpdate?.([]);
    return () => {};
  }
  return onSnapshot(
    query(collection(db, "leagueMemberships"), where("leagueId", "==", leagueId)),
    (snapshot) => onUpdate?.(mapSnapshot(snapshot)),
    onError,
  );
}

export function subscribeToLeagueContributions(leagueId, onUpdate, onError) {
  if (!leagueId) {
    onUpdate?.([]);
    return () => {};
  }
  return onSnapshot(
    query(collection(db, "leagueContributions"), where("leagueId", "==", leagueId)),
    (snapshot) => onUpdate?.(mapSnapshot(snapshot)),
    onError,
  );
}

export async function createLeague({ actorId, input }) {
  const validation = validateLeagueInput(input);
  if (!validation.valid) throw new Error(validation.errors.join(" "));

  const inviteCode = await reserveLeagueCode();
  const leagueReference = doc(collection(db, "leagues"));
  const inviteReference = doc(db, "leagueInvites", inviteCode);
  const batch = writeBatch(db);
  const auditReference = addAuditWrite(batch, {
    actorId,
    action: "league.created",
    entityType: "league",
    entityId: leagueReference.id,
    summary: `Created season: ${validation.value.name}`,
    details: {
      status: LEAGUE_STATUSES.DRAFT,
      mode: validation.value.mode,
      theme: validation.value.theme,
      houseCount: validation.value.houseCount,
    },
  });

  batch.set(leagueReference, {
    name: validation.value.name,
    normalizedName: validation.value.name.toLocaleLowerCase(),
    description: validation.value.description,
    theme: validation.value.theme,
    type: validation.value.type,
    mode: validation.value.mode,
    status: LEAGUE_STATUSES.DRAFT,
    startDate: Timestamp.fromDate(validation.value.startDate),
    endDate: Timestamp.fromDate(validation.value.endDate),
    pocketEnabled: validation.value.pocketEnabled,
    pocketStartDate: Timestamp.fromDate(validation.value.pocketStartDate),
    pocketEndDate: Timestamp.fromDate(validation.value.pocketEndDate),
    houseCount: validation.value.houseCount,
    chaosStatus: "not-started",
    chaosActivatedAt: null,
    chaosActivatedBy: "",
    rulesVersion: validation.value.ruleset.version,
    ruleset: validation.value.ruleset,
    powerPlayState: {
      usedPowerPlayIds: [],
      selectionCount: 0,
      lastWeekKey: "",
      lastPowerPlayId: "",
      lastSelectionAt: null,
      lastSelectionBy: "",
    },
    administratorIds: [actorId],
    participantCount: 0,
    participantLimit: LEAGUE_PARTICIPANT_LIMIT,
    publishedLeaderboardSnapshotId: "",
    publishedLeaderboardAt: null,
    publishedLeaderboardBy: "",
    publishedLeaderboardRevision: 0,
    inviteCode,
    createdAt: serverTimestamp(),
    createdBy: actorId,
    updatedAt: serverTimestamp(),
    updatedBy: actorId,
    activatedAt: null,
    completedAt: null,
    archivedAt: null,
    lastAuditId: auditReference.id,
  });

  batch.set(inviteReference, {
    leagueId: leagueReference.id,
    leagueName: validation.value.name,
    status: "closed",
    createdAt: serverTimestamp(),
    createdBy: actorId,
    updatedAt: serverTimestamp(),
    updatedBy: actorId,
  });
  await batch.commit();
  return leagueReference.id;
}

export async function transitionLeague({ league, nextStatus, actorId }) {
  if (!league?.id || !canTransitionLeague(league.status, nextStatus)) {
    throw new Error("That season status change is not permitted.");
  }
  if (nextStatus === LEAGUE_STATUSES.REGISTRATION && league.mode === "season") {
    const houseSnapshot = await getDocs(
      query(collection(db, "leagueHouses"), where("leagueId", "==", league.id)),
    );
    if (houseSnapshot.size !== Number(league.houseCount ?? 0)) {
      throw new Error(`Create all ${league.houseCount} Houses before opening registration.`);
    }
    const powerPlayReadiness = validatePowerPlayReadinessForRegistration(league);
    if (!powerPlayReadiness.ready) {
      const incomplete = powerPlayReadiness.checks.find((check) => !check.complete);
      throw new Error(incomplete?.detail || "Complete the Power Play pool before opening registration.");
    }
  }
  if (
    nextStatus === LEAGUE_STATUSES.ACTIVE &&
    league.mode === "season" &&
    league.chaosStatus !== "activated"
  ) {
    throw new Error("Activate C.H.A.O.S. before starting a House season.");
  }

  const membershipSnapshot = await getDocs(
    query(collection(db, "leagueMemberships"), where("leagueId", "==", league.id)),
  );
  if (membershipSnapshot.size > LEAGUE_PARTICIPANT_LIMIT) {
    throw new Error(`This season exceeds the supported ${LEAGUE_PARTICIPANT_LIMIT}-participant limit.`);
  }

  const batch = writeBatch(db);
  const leagueReference = doc(db, "leagues", league.id);
  const auditReference = addAuditWrite(batch, {
    actorId,
    action: `league.${nextStatus}`,
    entityType: "league",
    entityId: league.id,
    summary: `Changed ${league.name} from ${league.status} to ${nextStatus}`,
    details: { previousStatus: league.status, nextStatus },
  });
  const lifecycleFields = {
    activatedAt: nextStatus === LEAGUE_STATUSES.ACTIVE ? serverTimestamp() : league.activatedAt ?? null,
    completedAt: nextStatus === LEAGUE_STATUSES.COMPLETED ? serverTimestamp() : league.completedAt ?? null,
    archivedAt: nextStatus === LEAGUE_STATUSES.ARCHIVED ? serverTimestamp() : league.archivedAt ?? null,
  };

  batch.update(leagueReference, {
    status: nextStatus,
    updatedAt: serverTimestamp(),
    updatedBy: actorId,
    ...lifecycleFields,
    lastAuditId: auditReference.id,
  });
  batch.update(doc(db, "leagueInvites", league.inviteCode), {
    status: nextStatus === LEAGUE_STATUSES.REGISTRATION ? "active" : "closed",
    updatedAt: serverTimestamp(),
    updatedBy: actorId,
  });
  membershipSnapshot.docs.forEach((membershipDocument) => {
    batch.update(membershipDocument.ref, {
      status:
        nextStatus === LEAGUE_STATUSES.ACTIVE
          ? "active"
          : nextStatus === LEAGUE_STATUSES.COMPLETED || nextStatus === LEAGUE_STATUSES.ARCHIVED
            ? "completed"
            : "registered",
      updatedAt: serverTimestamp(),
    });
  });
  await batch.commit();
}

export async function joinLeague({ userId, profile, code }) {
  if (!userId) throw new Error("Sign in before joining a season.");
  const inviteCode = normalizeSeasonCode(code);
  if (inviteCode.length !== 8) throw new Error("Enter the complete 8-character season invitation code.");

  return runTransaction(db, async (transaction) => {
    const inviteReference = doc(db, "leagueInvites", inviteCode);
    const inviteSnapshot = await transaction.get(inviteReference);
    if (!inviteSnapshot.exists() || inviteSnapshot.data().status !== "active") {
      throw new Error("That season invitation is unavailable or registration is closed.");
    }

    const invite = inviteSnapshot.data();
    const leagueReference = doc(db, "leagues", invite.leagueId);
    const membershipReference = doc(db, "leagueMemberships", `${invite.leagueId}_${userId}`);
    const [leagueSnapshot, existingMembership] = await Promise.all([
      transaction.get(leagueReference),
      transaction.get(membershipReference),
    ]);
    if (!leagueSnapshot.exists() || leagueSnapshot.data().status !== LEAGUE_STATUSES.REGISTRATION) {
      throw new Error("This season is not accepting registrations.");
    }
    if (existingMembership.exists()) throw new Error("You are already registered for this season.");

    const league = leagueSnapshot.data();
    const participantLimit = Number(league.participantLimit ?? LEAGUE_PARTICIPANT_LIMIT);
    const participantCount = Number(league.participantCount ?? 0);
    if (participantCount >= participantLimit) {
      throw new Error(`This season has reached its ${participantLimit}-participant limit.`);
    }

    transaction.set(membershipReference, {
      leagueId: invite.leagueId,
      userId,
      displayName: profile?.displayName || profile?.fullName || "Champion",
      avatarId: profile?.avatarId || DEFAULT_AVATAR_ID,
      role: "participant",
      status: "registered",
      inviteCode,
      currentHouseId: "",
      currentHouseName: "Unassigned",
      currentHouseEmblemId: "",
      currentHouseAccentId: "",
      houseAssignedAt: null,
      houseAssignmentMethod: "",
      lastRosterSwapId: "",
      lastRosterWeekKey: "",
      rosterLockThroughWeekKey: "",
      rosterEligibleWeekKey: "",
      joinedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    transaction.update(leagueReference, {
      participantCount: participantCount + 1,
      participantLimit,
      updatedAt: serverTimestamp(),
      updatedBy: userId,
    });
    return invite.leagueId;
  });
}

export async function leaveLeagueRegistration({ leagueId, userId }) {
  if (!leagueId || !userId) throw new Error("A valid season registration is required.");
  return runTransaction(db, async (transaction) => {
    const leagueReference = doc(db, "leagues", leagueId);
    const membershipReference = doc(db, "leagueMemberships", `${leagueId}_${userId}`);
    const [leagueSnapshot, membershipSnapshot] = await Promise.all([
      transaction.get(leagueReference),
      transaction.get(membershipReference),
    ]);
    if (!leagueSnapshot.exists() || leagueSnapshot.data().status !== LEAGUE_STATUSES.REGISTRATION) {
      throw new Error("Registration is no longer open for this season.");
    }
    if (!membershipSnapshot.exists() || membershipSnapshot.data().status !== "registered") {
      throw new Error("Only a registration-stage membership can be withdrawn.");
    }
    const participantCount = Number(leagueSnapshot.data().participantCount ?? 0);
    transaction.delete(membershipReference);
    transaction.update(leagueReference, {
      participantCount: Math.max(0, participantCount - 1),
      participantLimit: Number(leagueSnapshot.data().participantLimit ?? LEAGUE_PARTICIPANT_LIMIT),
      updatedAt: serverTimestamp(),
      updatedBy: userId,
    });
  });
}

export async function getLeagueContextsForEntry(userId) {
  if (!userId) return [];
  const membershipSnapshot = await getDocs(
    query(collection(db, "leagueMemberships"), where("userId", "==", userId)),
  );
  const activeMemberships = mapSnapshot(membershipSnapshot).filter(
    (membership) => membership.status === "active",
  );
  const contexts = await Promise.all(
    activeMemberships.map(async (membership) => {
      const leagueSnapshot = await getDoc(doc(db, "leagues", membership.leagueId));
      if (!leagueSnapshot.exists() || leagueSnapshot.data().status !== LEAGUE_STATUSES.ACTIVE) return null;
      return { league: { id: leagueSnapshot.id, ...leagueSnapshot.data() }, membership };
    }),
  );
  return contexts.filter(Boolean);
}
