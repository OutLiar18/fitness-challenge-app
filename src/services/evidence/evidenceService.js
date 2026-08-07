import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
  writeBatch,
} from "firebase/firestore";

import { db } from "../../firebase";
import { addAuditWrite } from "../admin/auditService";
import { calculateLeagueStandings, calculateSeasonHonours } from "../leagues/leagueModel";
import { createPlayerNotificationWrite } from "../notifications/notificationService";
import {
  canReviewEvidenceCategory,
  getEvidenceClaimSortValue,
  getTimeZoneDateKey,
  isLateEvidenceSubmission,
  normalizeEvidencePolicy,
  validateEvidenceDecision,
} from "./evidenceModel";

function mapSnapshot(snapshot) {
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

function sortClaims(items = []) {
  return [...items].sort(
    (first, second) =>
      getEvidenceClaimSortValue(first) - getEvidenceClaimSortValue(second) ||
      String(first.verificationCode).localeCompare(String(second.verificationCode)),
  );
}

async function ensureExpiredEvidenceNotifications(userId, claims = []) {
  const expired = claims.filter((claim) => {
    const deadline = claim.deadlineAt?.toDate?.() ?? new Date(claim.deadlineAt ?? 0);
    return claim.userId === userId
      && claim.status === "pending"
      && deadline instanceof Date
      && !Number.isNaN(deadline.getTime())
      && deadline.getTime() < Date.now();
  });

  await Promise.all(expired.map(async (claim) => {
    const reference = doc(db, "playerNotifications", `evidence-deadline_${claim.id}`);
    const snapshot = await getDoc(reference);
    if (snapshot.exists()) return;
    await setDoc(reference, {
      userId,
      type: "evidence-deadline-missed",
      title: "Proof submission window closed",
      message: `${claim.verificationCode} was not submitted within the 24-hour proof window. The activity remains in your history, but proof-dependent season points were not added.`,
      leagueId: claim.leagueId,
      houseId: claim.houseId || "",
      evidenceClaimId: claim.id,
      actionPath: "/activity?tab=journal",
      createdAt: serverTimestamp(),
      readAt: null,
      readBy: "",
    });
  }));
}

export function subscribeToUserEvidenceClaims(userId, onUpdate, onError) {
  if (!userId) {
    onUpdate?.([]);
    return () => {};
  }
  return onSnapshot(
    query(collection(db, "seasonEvidenceClaims"), where("userId", "==", userId)),
    (snapshot) => {
      const claims = sortClaims(mapSnapshot(snapshot));
      onUpdate?.(claims);
      ensureExpiredEvidenceNotifications(userId, claims).catch((error) => {
        console.error("Could not create evidence deadline notification:", error);
      });
    },
    onError,
  );
}

export function subscribeToLeagueEvidenceClaims(
  { leagueId, categories = [], canViewAll = false },
  onUpdate,
  onError,
) {
  if (!leagueId || (!canViewAll && categories.length === 0)) {
    onUpdate?.([]);
    return () => {};
  }

  if (canViewAll) {
    return onSnapshot(
      query(collection(db, "seasonEvidenceClaims"), where("leagueId", "==", leagueId)),
      (snapshot) => onUpdate?.(sortClaims(mapSnapshot(snapshot))),
      onError,
    );
  }

  const categorySnapshots = new Map();
  const uniqueCategories = [...new Set(categories)].filter((category) =>
    ["water", "fruit", "running", "steps"].includes(category),
  );
  const publishMergedClaims = () => {
    const claimsById = new Map();
    categorySnapshots.forEach((items) => {
      items.forEach((item) => claimsById.set(item.id, item));
    });
    onUpdate?.(sortClaims([...claimsById.values()]));
  };

  const unsubscribers = uniqueCategories.map((category) =>
    onSnapshot(
      query(
        collection(db, "seasonEvidenceClaims"),
        where("leagueId", "==", leagueId),
        where("category", "==", category),
      ),
      (snapshot) => {
        categorySnapshots.set(category, mapSnapshot(snapshot));
        publishMergedClaims();
      },
      onError,
    ),
  );

  return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
}

export function subscribeToReviewerAssignmentsForUser(userId, onUpdate, onError) {
  if (!userId) {
    onUpdate?.([]);
    return () => {};
  }
  return onSnapshot(
    query(collection(db, "leagueEvidenceReviewers"), where("userId", "==", userId)),
    (snapshot) => onUpdate?.(mapSnapshot(snapshot)),
    onError,
  );
}

export function subscribeToEvidenceReviewers(leagueId, onUpdate, onError) {
  if (!leagueId) {
    onUpdate?.([]);
    return () => {};
  }
  return onSnapshot(
    query(collection(db, "leagueEvidenceReviewers"), where("leagueId", "==", leagueId)),
    (snapshot) => onUpdate?.(mapSnapshot(snapshot)),
    onError,
  );
}

export async function saveEvidenceReviewerAssignment({
  league,
  member,
  categories,
  actorId,
}) {
  if (!league?.id || !member?.userId || !actorId) {
    throw new Error("Choose a valid season member and reviewer assignment.");
  }
  const uniqueCategories = [...new Set(categories ?? [])].filter((category) =>
    ["water", "fruit", "running", "steps"].includes(category),
  );
  const reference = doc(db, "leagueEvidenceReviewers", `${league.id}_${member.userId}`);
  const existingSnapshot = await getDoc(reference);
  const existing = existingSnapshot.exists() ? existingSnapshot.data() : null;
  const batch = writeBatch(db);
  const action = uniqueCategories.length > 0
    ? "evidence.reviewer.assigned"
    : "evidence.reviewer.removed";
  const auditReference = addAuditWrite(batch, {
    actorId,
    action,
    entityType: "league",
    entityId: league.id,
    summary: `${uniqueCategories.length > 0 ? "Assigned" : "Removed"} evidence reviewer: ${member.displayName || member.userId}`,
    details: {
      reviewerId: member.userId,
      categories: uniqueCategories,
    },
  });

  batch.set(reference, {
    leagueId: league.id,
    userId: member.userId,
    displayName: member.displayName || "Champion",
    avatarId: member.avatarId || "legacy-trophy",
    categories: uniqueCategories,
    status: uniqueCategories.length > 0 ? "active" : "inactive",
    createdAt: existing?.createdAt ?? serverTimestamp(),
    createdBy: existing?.createdBy ?? actorId,
    updatedAt: serverTimestamp(),
    updatedBy: actorId,
    lastAuditId: auditReference.id,
  }, { merge: true });
  await batch.commit();
}

function getDecisionNotification(claim, nextStatus, points, reason) {
  if (nextStatus === "verified") {
    if (claim.claimType === "daily-bonus") {
      return {
        type: "evidence-bonus-awarded",
        title: `${claim.category === "water" ? "Water" : "Fruit"} proof bonus awarded`,
        message: `${points} bonus points were added after your WhatsApp proof was accepted.`,
      };
    }
    return {
      type: "evidence-accepted",
      title: `${claim.category === "running" ? "Running" : "Steps"} proof accepted`,
      message: `${points} pending season points were released to your individual and House totals.`,
    };
  }
  if (nextStatus === "rejected") {
    return {
      type: "evidence-rejected",
      title: "Proof was not accepted",
      message: reason || "The administrator recorded a reason for this evidence decision.",
    };
  }
  return {
    type: "evidence-decision-reversed",
    title: "Evidence decision corrected",
    message: reason || "An earlier proof decision was reversed with an audit record.",
  };
}

function createContributionPayload({ claim, points, source, decisionId, pointGroup }) {
  return {
    leagueId: claim.leagueId,
    entryId: claim.entryId || claim.entryIds?.[0] || claim.id,
    userId: claim.userId,
    displayName: claim.displayName || "Champion",
    avatarId: claim.avatarId || "legacy-trophy",
    houseId: claim.houseId || "",
    houseName: claim.houseName || "Unassigned",
    houseEmblemId: claim.houseEmblemId || "springbok",
    teamId: claim.houseId || "",
    teamName: claim.houseName || "Unassigned",
    category: claim.category,
    scoreCategory: claim.category,
    pointGroup,
    challengeDate: claim.challengeDate,
    activityPoints: points,
    rulesVersion: claim.rulesVersion,
    source,
    sourceRedemptionId: "",
    evidenceClaimId: claim.id,
    evidenceDecisionId: decisionId,
    createdAt: serverTimestamp(),
  };
}

export async function decideEvidenceClaim({
  claim,
  league,
  action,
  actorId,
  submittedAt,
  verifiedQuantity,
  reason,
  isPlatformAdmin = false,
  reviewerAssignments = [],
}) {
  if (!actorId || !claim?.id || !league?.id) {
    throw new Error("Choose a valid evidence claim.");
  }
  if (!canReviewEvidenceCategory({
    category: claim.category,
    userId: actorId,
    isPlatformAdmin,
    reviewerAssignments,
  })) {
    throw new Error("You are not assigned to review this evidence category.");
  }

  const policy = normalizeEvidencePolicy(league.ruleset?.evidencePolicy);
  const validation = validateEvidenceDecision({
    claim,
    action,
    submittedAt,
    verifiedQuantity,
    reason,
    isPlatformAdmin,
    policy,
  });
  if (!validation.valid) throw new Error(validation.errors.join(" "));

  return runTransaction(db, async (transaction) => {
    const claimReference = doc(db, "seasonEvidenceClaims", claim.id);
    const liveClaimSnapshot = await transaction.get(claimReference);
    if (!liveClaimSnapshot.exists()) throw new Error("That evidence claim no longer exists.");
    const liveClaim = { id: liveClaimSnapshot.id, ...liveClaimSnapshot.data() };
    if (liveClaim.status === "superseded") {
      throw new Error("This proof claim was replaced by an audited entry correction.");
    }
    if (liveClaim.status === "verified" && action !== "reverse") {
      throw new Error("This proof has already been accepted.");
    }
    if (liveClaim.status === "rejected" && action !== "reverse") {
      throw new Error("Reverse the rejected decision before recording a replacement.");
    }

    const decisionReference = doc(collection(db, "seasonEvidenceDecisions"));
    const late = action === "verify" && isLateEvidenceSubmission(liveClaim, validation.value.submittedAt);
    const decisionType = action === "verify" && late ? "late-verify" : action;
    let points = 0;
    let contributionReference = null;
    let nextStatus = action === "verify" ? "verified" : action === "reject" ? "rejected" : "reversed";
    let pointGroup = liveClaim.claimType === "daily-bonus" ? "evidenceBonus" : "activity";

    if (action === "verify") {
      points = liveClaim.claimType === "daily-bonus"
        ? Number(liveClaim.bonusPointsAvailable ?? 0)
        : Number(liveClaim.pendingPoints ?? 0);
      contributionReference = doc(
        db,
        "leagueContributions",
        `${liveClaim.leagueId}_${liveClaim.id}_${decisionReference.id}`,
      );
      transaction.set(contributionReference, createContributionPayload({
        claim: liveClaim,
        points: Math.max(0, points),
        source: liveClaim.claimType === "daily-bonus" ? "evidence-bonus" : "evidence-release",
        decisionId: decisionReference.id,
        pointGroup,
      }));
    } else if (action === "reverse") {
      const originalDecisionId = liveClaim.decisionId;
      if (!originalDecisionId) throw new Error("There is no recorded decision to reverse.");
      points = Number(liveClaim.releasedPoints ?? 0);
      if (points > 0) {
        contributionReference = doc(
          db,
          "leagueContributions",
          `${liveClaim.leagueId}_${liveClaim.id}_${decisionReference.id}`,
        );
        transaction.set(contributionReference, createContributionPayload({
          claim: liveClaim,
          points: -Math.abs(points),
          source: "evidence-reversal",
          decisionId: decisionReference.id,
          pointGroup: liveClaim.releasedPointGroup || pointGroup,
        }));
      }
    }

    transaction.set(decisionReference, {
      claimId: liveClaim.id,
      leagueId: liveClaim.leagueId,
      userId: liveClaim.userId,
      entryId: liveClaim.entryId || "",
      category: liveClaim.category,
      verificationCode: liveClaim.verificationCode,
      decisionType,
      previousStatus: liveClaim.status,
      nextStatus,
      pointsDelta: action === "reverse" ? -Math.abs(points) : Math.max(0, points),
      verifiedQuantity: validation.value.verifiedQuantity,
      whatsappSubmittedAt: validation.value.submittedAt
        ? Timestamp.fromDate(validation.value.submittedAt)
        : null,
      reason: validation.value.reason,
      lateException: late,
      actorId,
      contributionId: contributionReference?.id || "",
      createdAt: serverTimestamp(),
    });

    transaction.update(claimReference, {
      status: nextStatus,
      reviewedAt: serverTimestamp(),
      reviewedBy: actorId,
      reviewReason: validation.value.reason,
      whatsappSubmittedAt: validation.value.submittedAt
        ? Timestamp.fromDate(validation.value.submittedAt)
        : null,
      verifiedQuantity: validation.value.verifiedQuantity,
      decisionId: decisionReference.id,
      releasedContributionId: contributionReference?.id || "",
      releasedPoints: action === "verify" ? Math.max(0, points) : 0,
      releasedPointGroup: action === "verify" ? pointGroup : "",
      reversedByDecisionId: action === "reverse" ? decisionReference.id : "",
      updatedAt: serverTimestamp(),
    });

    const notification = getDecisionNotification(
      liveClaim,
      nextStatus,
      Math.max(0, points),
      validation.value.reason,
    );
    createPlayerNotificationWrite(transaction, {
      userId: liveClaim.userId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      leagueId: liveClaim.leagueId,
      houseId: liveClaim.houseId || "",
      actionPath: "/activity?tab=journal",
      evidenceClaimId: liveClaim.id,
    });

    return { decisionId: decisionReference.id, status: nextStatus, points };
  });
}

function sanitizeSnapshotRows(rows = []) {
  return rows.map((row) => Object.fromEntries(
    Object.entries(row).filter(([, value]) => value !== undefined),
  ));
}

export async function publishLeaderboardSnapshot({
  league,
  members,
  contributions,
  actorId,
  publicationType = "manual",
  replacesSnapshotId = "",
}) {
  if (!league?.id || !actorId) throw new Error("A managed season is required.");
  const standings = calculateLeagueStandings(contributions, members, league.ruleset);
  const honours = calculateSeasonHonours(contributions, members, league.ruleset);
  const snapshotReference = doc(collection(db, "leagueLeaderboardSnapshots"));

  return runTransaction(db, async (transaction) => {
    const leagueReference = doc(db, "leagues", league.id);
    const liveLeagueSnapshot = await transaction.get(leagueReference);
    if (!liveLeagueSnapshot.exists()) throw new Error("That season no longer exists.");
    const liveLeague = { id: liveLeagueSnapshot.id, ...liveLeagueSnapshot.data() };
    const policy = normalizeEvidencePolicy(liveLeague.ruleset?.evidencePolicy);
    const todayKey = getTimeZoneDateKey(new Date(), policy.leaderboardPublication.timezone);
    const lastPublishedKey = liveLeague.publishedLeaderboardAt
      ? getTimeZoneDateKey(liveLeague.publishedLeaderboardAt, policy.leaderboardPublication.timezone)
      : "";

    if (publicationType === "automatic-fallback" && lastPublishedKey === todayKey) {
      return liveLeague.publishedLeaderboardSnapshotId || "";
    }

    const auditReference = addAuditWrite(transaction, {
      actorId,
      action: replacesSnapshotId
        ? "leaderboard.snapshot.corrected"
        : "leaderboard.snapshot.published",
      entityType: "league",
      entityId: liveLeague.id,
      summary: `${replacesSnapshotId ? "Corrected" : "Published"} player leaderboard snapshot for ${liveLeague.name}`,
      details: {
        snapshotId: snapshotReference.id,
        replacesSnapshotId,
        publicationType,
        playerCount: standings.players.length,
        houseCount: standings.houses.length,
      },
    });

    transaction.set(snapshotReference, {
      leagueId: liveLeague.id,
      rulesVersion: liveLeague.rulesVersion,
      publicationType,
      replacesSnapshotId,
      publicationDateKey: todayKey,
      players: sanitizeSnapshotRows(standings.players),
      houses: sanitizeSnapshotRows(standings.houses),
      honours: {
        individual: sanitizeSnapshotRows(honours.individual),
        houseChampions: sanitizeSnapshotRows(honours.houseChampions),
        houseOfChampions: honours.houseOfChampions
          ? Object.fromEntries(Object.entries(honours.houseOfChampions).filter(([, value]) => value !== undefined))
          : null,
      },
      publishedAt: serverTimestamp(),
      publishedBy: actorId,
      lastAuditId: auditReference.id,
    });
    transaction.update(leagueReference, {
      publishedLeaderboardSnapshotId: snapshotReference.id,
      publishedLeaderboardAt: serverTimestamp(),
      publishedLeaderboardBy: actorId,
      publishedLeaderboardRevision: Number(liveLeague.publishedLeaderboardRevision ?? 0) + 1,
      updatedAt: serverTimestamp(),
      updatedBy: actorId,
      lastAuditId: auditReference.id,
    });
    return snapshotReference.id;
  });
}

export function subscribeToLeaderboardSnapshot(snapshotId, onUpdate, onError) {
  if (!snapshotId) {
    onUpdate?.(null);
    return () => {};
  }
  return onSnapshot(
    doc(db, "leagueLeaderboardSnapshots", snapshotId),
    (snapshot) => onUpdate?.(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null),
    onError,
  );
}

export async function getEvidenceClaimByCode(code) {
  const normalized = String(code ?? "").trim().toUpperCase();
  if (!normalized) return null;
  const snapshot = await getDocs(
    query(
      collection(db, "seasonEvidenceClaims"),
      where("verificationCode", "==", normalized),
    ),
  );
  const match = snapshot.docs[0];
  return match ? { id: match.id, ...match.data() } : null;
}
