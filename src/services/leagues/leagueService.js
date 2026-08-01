import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  Timestamp,
  where,
  writeBatch,
} from "firebase/firestore";

import { DEFAULT_AVATAR_ID } from "../../constants/avatars";
import { LEAGUE_STATUSES } from "../../constants/leagues";
import { db } from "../../firebase";
import { addAuditWrite } from "../admin/auditService";
import { createTeamInviteCode, normalizeTeamCode } from "../teams/teamModel";
import { canTransitionLeague, validateLeagueInput } from "./leagueModel";

function mapSnapshot(snapshot) {
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

async function reserveLeagueCode() {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const code = createTeamInviteCode();
    const snapshot = await getDoc(doc(db, "leagueInvites", code));
    if (!snapshot.exists()) {
      return code;
    }
  }

  throw new Error("A unique league invitation code could not be created.");
}

export function subscribeToPublishedLeagues(onUpdate, onError) {
  const visibleQuery = query(
    collection(db, "leagues"),
    where("status", "in", [
      LEAGUE_STATUSES.REGISTRATION,
      LEAGUE_STATUSES.ACTIVE,
      LEAGUE_STATUSES.COMPLETED,
      LEAGUE_STATUSES.ARCHIVED,
    ]),
  );

  return onSnapshot(
    visibleQuery,
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
    query(
      collection(db, "leagues"),
      where("administratorIds", "array-contains", userId),
    ),
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
  if (!validation.valid) {
    throw new Error(validation.errors.join(" "));
  }

  const inviteCode = await reserveLeagueCode();
  const leagueReference = doc(collection(db, "leagues"));
  const inviteReference = doc(db, "leagueInvites", inviteCode);
  const batch = writeBatch(db);
  const auditReference = addAuditWrite(batch, {
    actorId,
    action: "league.created",
    entityType: "league",
    entityId: leagueReference.id,
    summary: `Created league: ${validation.value.name}`,
    details: { status: LEAGUE_STATUSES.DRAFT, mode: validation.value.mode },
  });

  batch.set(leagueReference, {
    name: validation.value.name,
    normalizedName: validation.value.name.toLocaleLowerCase(),
    description: validation.value.description,
    type: validation.value.type,
    mode: validation.value.mode,
    status: LEAGUE_STATUSES.DRAFT,
    startDate: Timestamp.fromDate(validation.value.startDate),
    endDate: Timestamp.fromDate(validation.value.endDate),
    rulesVersion: validation.value.ruleset.version,
    ruleset: validation.value.ruleset,
    administratorIds: [actorId],
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
    throw new Error("That league status change is not permitted.");
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
    activatedAt:
      nextStatus === LEAGUE_STATUSES.ACTIVE
        ? serverTimestamp()
        : league.activatedAt ?? null,
    completedAt:
      nextStatus === LEAGUE_STATUSES.COMPLETED
        ? serverTimestamp()
        : league.completedAt ?? null,
    archivedAt:
      nextStatus === LEAGUE_STATUSES.ARCHIVED
        ? serverTimestamp()
        : league.archivedAt ?? null,
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

  const membershipSnapshot = await getDocs(
    query(collection(db, "leagueMemberships"), where("leagueId", "==", league.id)),
  );

  membershipSnapshot.docs.forEach((membershipDocument) => {
    batch.update(membershipDocument.ref, {
      status:
        nextStatus === LEAGUE_STATUSES.ACTIVE
          ? "active"
          : nextStatus === LEAGUE_STATUSES.COMPLETED ||
              nextStatus === LEAGUE_STATUSES.ARCHIVED
            ? "completed"
            : "registered",
      updatedAt: serverTimestamp(),
    });
  });

  await batch.commit();
}

export async function joinLeague({ userId, profile, playerTeam, code }) {
  const inviteCode = normalizeTeamCode(code);
  if (inviteCode.length !== 8) {
    throw new Error("Enter the complete 8-character league invitation code.");
  }

  const inviteSnapshot = await getDoc(doc(db, "leagueInvites", inviteCode));
  if (!inviteSnapshot.exists() || inviteSnapshot.data().status !== "active") {
    throw new Error("That league invitation is unavailable or registration is closed.");
  }

  const invite = inviteSnapshot.data();
  const leagueSnapshot = await getDoc(doc(db, "leagues", invite.leagueId));
  if (!leagueSnapshot.exists() || leagueSnapshot.data().status !== LEAGUE_STATUSES.REGISTRATION) {
    throw new Error("This league is not accepting registrations.");
  }

  const league = leagueSnapshot.data();
  if (league.mode === "team" && !playerTeam?.teamId) {
    throw new Error("Join a team before registering for this team league.");
  }

  const membershipReference = doc(
    db,
    "leagueMemberships",
    `${invite.leagueId}_${userId}`,
  );
  const existingMembership = await getDoc(membershipReference);
  if (existingMembership.exists()) {
    throw new Error("You are already registered for this league.");
  }

  const batch = writeBatch(db);
  batch.set(membershipReference, {
    leagueId: invite.leagueId,
    userId,
    displayName: profile?.displayName || profile?.fullName || "Champion",
    avatarId: profile?.avatarId || DEFAULT_AVATAR_ID,
    teamId: playerTeam?.teamId || "",
    teamName: playerTeam?.teamName || "Independent",
    role: "participant",
    status: "registered",
    inviteCode,
    joinedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await batch.commit();
  return invite.leagueId;
}

export async function leaveLeagueRegistration({ leagueId, userId }) {
  const membershipReference = doc(db, "leagueMemberships", `${leagueId}_${userId}`);
  const snapshot = await getDoc(membershipReference);

  if (!snapshot.exists() || snapshot.data().status !== "registered") {
    throw new Error("Only a registration-stage membership can be withdrawn.");
  }

  const batch = writeBatch(db);
  batch.delete(membershipReference);
  await batch.commit();
}

export async function getLeagueContextsForEntry(userId) {
  if (!userId) {
    return [];
  }

  const membershipSnapshot = await getDocs(
    query(collection(db, "leagueMemberships"), where("userId", "==", userId)),
  );
  const activeMemberships = mapSnapshot(membershipSnapshot).filter(
    (membership) => membership.status === "active",
  );

  const contexts = await Promise.all(
    activeMemberships.map(async (membership) => {
      const leagueSnapshot = await getDoc(doc(db, "leagues", membership.leagueId));
      if (!leagueSnapshot.exists() || leagueSnapshot.data().status !== LEAGUE_STATUSES.ACTIVE) {
        return null;
      }

      return {
        league: { id: leagueSnapshot.id, ...leagueSnapshot.data() },
        membership,
      };
    }),
  );

  return contexts.filter(Boolean);
}
