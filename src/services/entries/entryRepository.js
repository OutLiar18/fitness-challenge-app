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
import { db } from "../../firebase";
import { calculateEntryPoints } from "../points";
import { normalizeChallengeDate } from "../dateService";
import {
  allocateEntryPointsForEvidence,
  createEvidenceClaimIdentity,
} from "../evidence/evidenceModel";
import { isEntryWithinLeague } from "../leagues/leagueModel";

function getCreatedAtMillis(entry) {
  if (typeof entry.createdAt?.toMillis === "function") {
    return entry.createdAt.toMillis();
  }

  const parsed = new Date(entry.createdAt ?? 0).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

function sortEntriesNewestFirst(entries) {
  return [...entries].sort(
    (first, second) => getCreatedAtMillis(second) - getCreatedAtMillis(first),
  );
}

export async function createEntry(
  userId,
  category,
  data,
  selectedDate,
  leagueContexts = [],
  metadata = {},
) {
  if (!userId) {
    throw new Error("A user is required to save an entry.");
  }

  if (!category) {
    throw new Error("A category is required to save an entry.");
  }

  const challengeDate = normalizeChallengeDate(selectedDate);

  if (!challengeDate) {
    throw new Error("A valid challenge date is required.");
  }

  const entryReference = doc(collection(db, "challengeEntries"));
  const entry = {
    id: entryReference.id,
    userId,
    category,
    data,
    challengeDate,
  };
  const activityPoints = calculateEntryPoints(entry);
  const activeLeagueContexts = leagueContexts.filter(({ league }) =>
    isEntryWithinLeague(entry, league),
  );
  const leaguePlans = activeLeagueContexts.map(({ league, membership }) => {
    const policy = league.ruleset?.evidencePolicy;
    const allocation = policy
      ? allocateEntryPointsForEvidence(entry, policy)
      : {
          immediatePoints: activityPoints,
          pendingPoints: 0,
          claimRequired: false,
          claimType: "none",
        };
    const identity = policy && allocation.claimRequired
      ? createEvidenceClaimIdentity({
          leagueId: league.id,
          userId,
          category,
          entryId: entryReference.id,
          challengeDate,
        })
      : null;
    return { league, membership, policy, allocation, identity };
  });
  const evidenceClaimIds = [
    ...new Set(leaguePlans.map((plan) => plan.identity?.id).filter(Boolean)),
  ];
  const dailyClaimSnapshots = new Map();

  await Promise.all(
    leaguePlans.map(async ({ identity }) => {
      if (!identity || identity.claimType !== "daily-bonus") return;
      dailyClaimSnapshots.set(
        identity.id,
        await getDoc(doc(db, "seasonEvidenceClaims", identity.id)),
      );
    }),
  );

  const batch = writeBatch(db);

  batch.set(entryReference, {
    userId,
    category,
    data,
    source: metadata.source || "activity",
    sourceLeagueId: metadata.sourceLeagueId || "",
    sourcePocketId: metadata.sourcePocketId || "",
    sourceRedemptionId: metadata.sourceRedemptionId || "",
    sourceCorrectionId: "",
    replacesEntryId: "",
    correctionRootEntryId: "",
    correctionSequence: 0,
    evidenceClaimIds,
    createdAt: serverTimestamp(),
    challengeDate: Timestamp.fromDate(challengeDate),
  });

  const evidenceClaims = [];

  leaguePlans.forEach(({ league, membership, policy, allocation, identity }) => {
    const baseScoreCategory =
      policy && category === "running" ? "cardio" : category;

    if (allocation.immediatePoints > 0) {
      const contributionReference = doc(
        db,
        "leagueContributions",
        `${league.id}_${entryReference.id}`,
      );

      batch.set(contributionReference, {
        leagueId: league.id,
        entryId: entryReference.id,
        userId,
        displayName: membership.displayName || "Champion",
        avatarId: membership.avatarId || "legacy-trophy",
        houseId: membership.currentHouseId || "",
        houseName: membership.currentHouseName || "Unassigned",
        houseEmblemId: membership.currentHouseEmblemId || "springbok",
        teamId: membership.currentHouseId || "",
        teamName: membership.currentHouseName || "Unassigned",
        category,
        scoreCategory: baseScoreCategory,
        pointGroup: "activity",
        challengeDate: Timestamp.fromDate(challengeDate),
        activityPoints: Math.max(
          0,
          Math.round(Number(allocation.immediatePoints ?? 0) * 100) / 100,
        ),
        rulesVersion: league.rulesVersion,
        source: metadata.source || "activity",
        sourceRedemptionId: metadata.sourceRedemptionId || "",
        evidenceClaimId: "",
        evidenceDecisionId: "",
        createdAt: serverTimestamp(),
      });
    }

    if (!policy || !allocation.claimRequired) return;

    if (!identity) return;

    const claimReference = doc(db, "seasonEvidenceClaims", identity.id);
    const deadlineAt = Timestamp.fromDate(
      new Date(Date.now() + Number(policy.proofDeadlineHours ?? 24) * 60 * 60 * 1000),
    );
    const commonClaim = {
      leagueId: league.id,
      leagueName: league.name,
      userId,
      displayName: membership.displayName || "Champion",
      avatarId: membership.avatarId || "legacy-trophy",
      houseId: membership.currentHouseId || "",
      houseName: membership.currentHouseName || "Unassigned",
      houseEmblemId: membership.currentHouseEmblemId || "springbok",
      category,
      claimType: identity.claimType,
      verificationCode: identity.verificationCode,
      dateKey: identity.dateKey,
      challengeDate: Timestamp.fromDate(challengeDate),
      status: "pending",
      pendingPoints: Math.max(0, Number(allocation.pendingPoints ?? 0)),
      bonusPointsAvailable: Math.max(
        0,
        Number(allocation.bonusPointsAvailable ?? 0),
      ),
      rulesVersion: league.rulesVersion,
      releasedPoints: 0,
      releasedPointGroup: "",
      reviewedAt: null,
      reviewedBy: "",
      reviewReason: "",
      whatsappSubmittedAt: null,
      verifiedQuantity: 0,
      decisionId: "",
      releasedContributionId: "",
      reversedByDecisionId: "",
      supersededByClaimId: "",
      correctionId: "",
      replacesClaimId: "",
      correctionIds: [],
    };

    if (identity.claimType === "daily-bonus") {
      const existing = dailyClaimSnapshots.get(identity.id);
      if (!existing?.exists()) {
        batch.set(claimReference, {
          ...commonClaim,
          entryId: "",
          entryIds: [entryReference.id],
          deadlineAt,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } else {
      batch.set(claimReference, {
        ...commonClaim,
        entryId: entryReference.id,
        entryIds: [entryReference.id],
        deadlineAt,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    evidenceClaims.push({
      id: identity.id,
      verificationCode: identity.verificationCode,
      category,
      claimType: identity.claimType,
    });
  });

  await batch.commit();
  return { reference: entryReference, evidenceClaims };
}

export function subscribeToEntries(userId, onUpdate, onError) {
  if (!userId) {
    onUpdate([]);
    return () => {};
  }

  const entriesQuery = query(
    collection(db, "challengeEntries"),
    where("userId", "==", userId),
  );

  return onSnapshot(
    entriesQuery,
    (snapshot) => {
      const entries = snapshot.docs.map((entryDocument) => ({
        id: entryDocument.id,
        ...entryDocument.data(),
      }));

      onUpdate(sortEntriesNewestFirst(entries));
    },
    onError,
  );
}

export async function deleteEntry(entryId, userId) {
  if (!entryId) {
    throw new Error("An entry ID is required.");
  }

  if (!userId) {
    throw new Error("A user is required to delete an entry.");
  }

  const entrySnapshot = await getDoc(doc(db, "challengeEntries", entryId));
  if (entrySnapshot.exists() && entrySnapshot.data().source === "pocket") {
    throw new Error("Pocket redemptions are final and cannot be deleted.");
  }
  if (entrySnapshot.exists() && entrySnapshot.data().source === "correction") {
    throw new Error("Corrected entries are immutable and cannot be deleted.");
  }
  if (entrySnapshot.exists()) {
    const rootEntryId = entrySnapshot.data().correctionRootEntryId || entryId;
    const correctionHead = await getDoc(doc(db, "entryCorrectionHeads", rootEntryId));
    if (correctionHead.exists()) {
      throw new Error(
        "This entry belongs to an audited correction chain and cannot be deleted.",
      );
    }
  }
  if (
    entrySnapshot.exists()
    && (entrySnapshot.data().evidenceClaimIds ?? []).length > 0
  ) {
    throw new Error(
      "This season entry is linked to a verification ID and cannot be deleted. Ask an administrator to record an audited correction.",
    );
  }

  const contributionSnapshot = await getDocs(
    query(
      collection(db, "leagueContributions"),
      where("entryId", "==", entryId),
      where("userId", "==", userId),
    ),
  );
  const uniqueLeagueIds = [
    ...new Set(
      contributionSnapshot.docs
        .map((contributionDocument) => contributionDocument.data().leagueId)
        .filter(Boolean),
    ),
  ];
  const leagueStatuses = new Map(
    await Promise.all(
      uniqueLeagueIds.map(async (leagueId) => {
        const leagueSnapshot = await getDoc(doc(db, "leagues", leagueId));
        return [
          leagueId,
          leagueSnapshot.exists() ? leagueSnapshot.data().status : "",
        ];
      }),
    ),
  );
  const batch = writeBatch(db);

  contributionSnapshot.docs.forEach((contributionDocument) => {
    const contribution = contributionDocument.data();

    if (leagueStatuses.get(contribution.leagueId) === "active") {
      batch.delete(contributionDocument.ref);
    }
  });

  batch.delete(doc(db, "challengeEntries", entryId));
  await batch.commit();
}

export async function createExerciseSuggestion({
  userId,
  challengeEntryId,
  exerciseDefinition,
}) {
  if (!userId) {
    throw new Error("A user is required to suggest an exercise.");
  }

  if (!exerciseDefinition?.name) {
    throw new Error("An exercise name is required.");
  }

  const reference = doc(collection(db, "exerciseSuggestions"));
  const batch = writeBatch(db);
  batch.set(reference, {
    submittedBy: userId,
    challengeEntryId,
    exerciseDefinition,
    status: "pending",
    createdAt: serverTimestamp(),
    reviewedAt: null,
    reviewedBy: null,
    rejectionReason: "",
  });
  await batch.commit();
  return reference;
}

export async function createLibrarySuggestion({
  userId,
  challengeEntryId,
  itemType,
  definition,
}) {
  if (!userId) {
    throw new Error("A user is required to create a library suggestion.");
  }

  if (!itemType || !definition?.name) {
    throw new Error("A valid library suggestion is required.");
  }

  const reference = doc(collection(db, "librarySuggestions"));
  const batch = writeBatch(db);
  batch.set(reference, {
    submittedBy: userId,
    challengeEntryId,
    itemType,
    definition,
    status: "pending",
    createdAt: serverTimestamp(),
    reviewedAt: null,
    reviewedBy: null,
    rejectionReason: "",
  });
  await batch.commit();
  return reference;
}
