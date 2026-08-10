import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from "firebase/firestore";

import { db } from "../../firebase";
import { addAuditWrite } from "../admin/auditService";
import {
  SEASON_BONUS_AUDIT_ACTIONS,
  SEASON_BONUS_AWARD_SOURCES,
  SEASON_BONUS_REQUEST_STATUSES,
  createSeasonBonusAwardDraft,
  createSeasonBonusCorrectionDraft,
  getSeasonBonusMemberIdentity,
  validateSeasonBonusInput,
} from "./seasonBonusModel";

function mapSnapshot(snapshot) {
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

function activeMembershipReference(leagueId, userId) {
  return doc(db, "leagueMemberships", `${leagueId}_${userId}`);
}

async function readCurrentMembership(leagueId, userId) {
  const snapshot = await getDoc(activeMembershipReference(leagueId, userId));
  if (!snapshot.exists()) throw new Error("That player is no longer registered in this season.");
  const membership = { id: snapshot.id, ...snapshot.data() };
  if (membership.status !== "active" || !membership.currentHouseId) {
    throw new Error("That player must be active and assigned to a House before bonus points can be awarded.");
  }
  return membership;
}

function createContributionWrite(batch, { awardReference, award, challengeDate }) {
  const contributionReference = doc(db, "leagueContributions", `season_bonus_${awardReference.id}`);
  batch.set(contributionReference, {
    leagueId: award.leagueId,
    entryId: "",
    userId: award.userId,
    displayName: award.displayName,
    avatarId: award.avatarId,
    houseId: award.houseId,
    houseName: award.houseName,
    houseEmblemId: award.houseEmblemId,
    teamId: award.houseId,
    teamName: award.houseName,
    category: "seasonBonus",
    scoreCategory: "seasonBonus",
    pointGroup: "seasonBonus",
    challengeDate,
    activityPoints: award.points,
    rulesVersion: award.rulesVersion,
    source: "season-bonus",
    sourceRedemptionId: "",
    evidenceClaimId: "",
    evidenceDecisionId: "",
    correctionId: "",
    correctionRole: "",
    replacesContributionIds: [],
    bonusAwardId: awardReference.id,
    createdAt: serverTimestamp(),
  });
  return contributionReference;
}

function createAwardWrite(batch, {
  awardReference,
  award,
  contributionReference,
  auditReference,
  challengeDate,
  actorId,
}) {
  batch.set(awardReference, {
    ...award,
    contributionId: contributionReference.id,
    challengeDate,
    awardedAt: serverTimestamp(),
    awardedBy: actorId,
    lastAuditId: auditReference.id,
  });
}

export function subscribeToSeasonBonusRequests(leagueId, onUpdate, onError) {
  if (!leagueId) {
    onUpdate?.([]);
    return () => {};
  }
  return onSnapshot(
    query(collection(db, "seasonBonusRequests"), where("leagueId", "==", leagueId)),
    (snapshot) => onUpdate?.(mapSnapshot(snapshot)),
    onError,
  );
}

export function subscribeToPendingSeasonBonusRequests(onUpdate, onError) {
  return onSnapshot(
    query(collection(db, "seasonBonusRequests"), where("status", "==", SEASON_BONUS_REQUEST_STATUSES.PENDING)),
    (snapshot) => onUpdate?.(mapSnapshot(snapshot)),
    onError,
  );
}

export function subscribeToSeasonBonusAwards(leagueId, onUpdate, onError) {
  if (!leagueId) {
    onUpdate?.([]);
    return () => {};
  }
  return onSnapshot(
    query(collection(db, "seasonBonusAwards"), where("leagueId", "==", leagueId)),
    (snapshot) => onUpdate?.(mapSnapshot(snapshot)),
    onError,
  );
}

export async function requestSeasonBonus({ league, member, points, reason, actorId }) {
  const validation = validateSeasonBonusInput({ points, reason });
  if (!validation.valid) throw new Error(validation.errors.join(" "));
  if (!league?.id || league.status !== "active" || !actorId) {
    throw new Error("Bonus requests can be submitted only during an active league season.");
  }
  const currentMembership = await readCurrentMembership(league.id, member?.userId);
  const identity = getSeasonBonusMemberIdentity(currentMembership);
  const requestReference = doc(collection(db, "seasonBonusRequests"));
  const batch = writeBatch(db);
  const auditReference = addAuditWrite(batch, {
    actorId,
    action: SEASON_BONUS_AUDIT_ACTIONS.REQUESTED,
    entityType: "league",
    entityId: league.id,
    summary: `Requested ${validation.value.points} season bonus points for ${identity.displayName}`,
    details: {
      referenceId: requestReference.id,
      userId: identity.userId,
      points: validation.value.points,
    },
  });
  batch.set(requestReference, {
    leagueId: league.id,
    userId: identity.userId,
    displayName: identity.displayName,
    points: validation.value.points,
    reason: validation.value.reason,
    status: SEASON_BONUS_REQUEST_STATUSES.PENDING,
    requestedBy: actorId,
    requestedAt: serverTimestamp(),
    reviewedBy: "",
    reviewedAt: null,
    reviewReason: "",
    awardId: "",
    lastAuditId: auditReference.id,
  });
  await batch.commit();
  return requestReference.id;
}

export async function awardSeasonBonusDirect({ league, member, points, reason, actorId }) {
  const currentMembership = await readCurrentMembership(league?.id, member?.userId);
  const award = createSeasonBonusAwardDraft({
    league,
    member: currentMembership,
    points,
    reason,
    source: SEASON_BONUS_AWARD_SOURCES.PLATFORM_DIRECT,
  });
  const awardReference = doc(collection(db, "seasonBonusAwards"));
  const batch = writeBatch(db);
  const auditReference = addAuditWrite(batch, {
    actorId,
    action: SEASON_BONUS_AUDIT_ACTIONS.DIRECT_AWARDED,
    entityType: "league",
    entityId: league.id,
    summary: `Awarded ${award.points} season bonus points to ${award.displayName}`,
    details: {
      referenceId: awardReference.id,
      userId: award.userId,
      houseId: award.houseId,
      points: award.points,
    },
  });
  const contributionReference = createContributionWrite(batch, {
    awardReference,
    award,
    challengeDate: serverTimestamp(),
  });
  createAwardWrite(batch, {
    awardReference,
    award,
    contributionReference,
    auditReference,
    challengeDate: serverTimestamp(),
    actorId,
  });
  await batch.commit();
  return awardReference.id;
}

export async function reviewSeasonBonusRequest({ league, request, decision, reviewReason = "", actorId }) {
  if (!league?.id || !request?.id || !actorId || request.leagueId !== league.id) {
    throw new Error("Choose a valid season bonus request.");
  }
  if (request.status !== SEASON_BONUS_REQUEST_STATUSES.PENDING) {
    throw new Error("That bonus request has already been reviewed.");
  }
  if (![SEASON_BONUS_REQUEST_STATUSES.APPROVED, SEASON_BONUS_REQUEST_STATUSES.REJECTED].includes(decision)) {
    throw new Error("Choose approve or reject.");
  }
  const note = String(reviewReason ?? "").trim().replace(/\s+/g, " ").slice(0, 300);
  if (decision === SEASON_BONUS_REQUEST_STATUSES.REJECTED && note.length < 4) {
    throw new Error("Give a short reason when rejecting a bonus request.");
  }
  const batch = writeBatch(db);
  const requestReference = doc(db, "seasonBonusRequests", request.id);
  const auditReference = addAuditWrite(batch, {
    actorId,
    action: decision === SEASON_BONUS_REQUEST_STATUSES.APPROVED
      ? SEASON_BONUS_AUDIT_ACTIONS.REQUEST_APPROVED
      : SEASON_BONUS_AUDIT_ACTIONS.REQUEST_REJECTED,
    entityType: "league",
    entityId: league.id,
    summary: `${decision === SEASON_BONUS_REQUEST_STATUSES.APPROVED ? "Approved" : "Rejected"} season bonus request for ${request.displayName}`,
    details: {
      referenceId: request.id,
      userId: request.userId,
      points: request.points,
    },
  });
  if (decision === SEASON_BONUS_REQUEST_STATUSES.REJECTED) {
    batch.update(requestReference, {
      status: decision,
      reviewedBy: actorId,
      reviewedAt: serverTimestamp(),
      reviewReason: note,
      awardId: "",
      lastAuditId: auditReference.id,
    });
    await batch.commit();
    return null;
  }
  const currentMembership = await readCurrentMembership(league.id, request.userId);
  const award = createSeasonBonusAwardDraft({
    league,
    member: currentMembership,
    points: request.points,
    reason: request.reason,
    source: SEASON_BONUS_AWARD_SOURCES.LEAGUE_ADMIN_REQUEST,
    requestId: request.id,
    requestedBy: request.requestedBy,
  });
  const awardReference = doc(collection(db, "seasonBonusAwards"));
  const contributionReference = createContributionWrite(batch, {
    awardReference,
    award,
    challengeDate: serverTimestamp(),
  });
  createAwardWrite(batch, {
    awardReference,
    award,
    contributionReference,
    auditReference,
    challengeDate: serverTimestamp(),
    actorId,
  });
  batch.update(requestReference, {
    status: decision,
    reviewedBy: actorId,
    reviewedAt: serverTimestamp(),
    reviewReason: note,
    awardId: awardReference.id,
    lastAuditId: auditReference.id,
  });
  await batch.commit();
  return awardReference.id;
}

export async function correctSeasonBonusAward({ league, originalAward, points, reason, actorId }) {
  if (!league?.id || !originalAward?.id || originalAward.leagueId !== league.id || !actorId) {
    throw new Error("Choose a valid bonus award to correct.");
  }
  const award = createSeasonBonusCorrectionDraft({ originalAward, points, reason });
  const awardReference = doc(collection(db, "seasonBonusAwards"));
  const batch = writeBatch(db);
  const auditReference = addAuditWrite(batch, {
    actorId,
    action: SEASON_BONUS_AUDIT_ACTIONS.CORRECTED,
    entityType: "league",
    entityId: league.id,
    summary: `Adjusted historical season bonus for ${award.displayName} by ${award.points}`,
    details: {
      referenceId: awardReference.id,
      correctsAwardId: originalAward.id,
      userId: award.userId,
      houseId: award.houseId,
      points: award.points,
    },
  });
  const contributionReference = createContributionWrite(batch, {
    awardReference,
    award,
    challengeDate: award.challengeDate,
  });
  createAwardWrite(batch, {
    awardReference,
    award,
    contributionReference,
    auditReference,
    challengeDate: award.challengeDate,
    actorId,
  });
  await batch.commit();
  return awardReference.id;
}
