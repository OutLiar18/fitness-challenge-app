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
} from "firebase/firestore";

import { db } from "../../firebase";
import { toDate } from "../dateService";
import {
  createEvidenceClaimIdentity,
  normalizeEvidencePolicy,
} from "../evidence/evidenceModel";
import { calculateEntryPoints } from "../points";
import { validateEntry } from "../validation";
import { getCategory } from "../../utils/categoryHelpers";
import { serializeExportValue } from "../account/dataExportModel";
import {
  buildEntryIntegrityDiagnostics,
  createReplacementLeaguePlan,
  groupNetActivityContributions,
  validateEntryCorrectionDraft,
} from "./entryCorrectionModel";
import { resolveEntryHistory } from "./entryHistoryModel";
import { normalizeEntry } from "./normalizer";

function mapDocuments(snapshot) {
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

function uniqueById(items = []) {
  return [...new Map(items.filter(Boolean).map((item) => [item.id, item])).values()];
}

async function loadEntryByLookup(lookup) {
  const value = String(lookup ?? "").trim();
  if (!value) return null;

  const normalizedCode = value.toUpperCase();
  if (/^(RUN|STEP|WATER|FRUIT)-[A-HJ-NP-Z2-9]{6}$/.test(normalizedCode)) {
    const claims = await getDocs(
      query(
        collection(db, "seasonEvidenceClaims"),
        where("verificationCode", "==", normalizedCode),
      ),
    );
    const claim = claims.docs[0];
    if (!claim) return null;
    const claimData = claim.data();
    const entryId = claimData.entryId || claimData.entryIds?.[0] || "";
    if (!entryId) return null;
    const entrySnapshot = await getDoc(doc(db, "challengeEntries", entryId));
    return entrySnapshot.exists()
      ? { id: entrySnapshot.id, ...entrySnapshot.data() }
      : null;
  }

  const entrySnapshot = await getDoc(doc(db, "challengeEntries", value));
  return entrySnapshot.exists()
    ? { id: entrySnapshot.id, ...entrySnapshot.data() }
    : null;
}

async function loadEntryDocuments(entryIds) {
  const snapshots = await Promise.all(
    [...new Set(entryIds.filter(Boolean))].map((entryId) =>
      getDoc(doc(db, "challengeEntries", entryId)),
    ),
  );
  return snapshots
    .filter((snapshot) => snapshot.exists())
    .map((snapshot) => ({ id: snapshot.id, ...snapshot.data() }));
}

async function loadRelatedDocuments(collectionName, fieldName, entryIds, operator = "==") {
  const snapshots = await Promise.all(
    [...new Set(entryIds.filter(Boolean))].map((entryId) =>
      getDocs(
        query(
          collection(db, collectionName),
          where(fieldName, operator, entryId),
        ),
      ),
    ),
  );
  return uniqueById(snapshots.flatMap(mapDocuments));
}

async function loadLeagues(leagueIds) {
  const snapshots = await Promise.all(
    [...new Set(leagueIds.filter(Boolean))].map((leagueId) =>
      getDoc(doc(db, "leagues", leagueId)),
    ),
  );
  return snapshots
    .filter((snapshot) => snapshot.exists())
    .map((snapshot) => ({ id: snapshot.id, ...snapshot.data() }));
}


export function subscribeToEntryCorrectionHeads(userId, onUpdate, onError) {
  if (!userId) {
    onUpdate?.([]);
    return () => {};
  }

  return onSnapshot(
    query(
      collection(db, "entryCorrectionHeads"),
      where("userId", "==", userId),
    ),
    (snapshot) => onUpdate?.(mapDocuments(snapshot)),
    onError,
  );
}

export function subscribeToEntryCorrections(userId, onUpdate, onError) {
  if (!userId) {
    onUpdate?.([]);
    return () => {};
  }

  return onSnapshot(
    query(
      collection(db, "entryCorrections"),
      where("userId", "==", userId),
    ),
    (snapshot) =>
      onUpdate?.(
        mapDocuments(snapshot).sort(
          (first, second) => Number(first.sequence ?? 0) - Number(second.sequence ?? 0),
        ),
      ),
    onError,
  );
}

export async function getEntryIntegrityBundle(lookup) {
  const locatedEntry = await loadEntryByLookup(lookup);
  if (!locatedEntry) {
    throw new Error("No entry or verification ID matched that search.");
  }

  const rootEntryId = locatedEntry.correctionRootEntryId || locatedEntry.id;
  const [headSnapshot, correctionSnapshot] = await Promise.all([
    getDoc(doc(db, "entryCorrectionHeads", rootEntryId)),
    getDocs(
      query(
        collection(db, "entryCorrections"),
        where("rootEntryId", "==", rootEntryId),
      ),
    ),
  ]);
  const correctionHead = headSnapshot.exists()
    ? { id: headSnapshot.id, ...headSnapshot.data() }
    : null;
  const corrections = mapDocuments(correctionSnapshot).sort(
    (first, second) => Number(first.sequence ?? 0) - Number(second.sequence ?? 0),
  );
  const entryIds = [
    rootEntryId,
    locatedEntry.id,
    correctionHead?.currentEntryId,
    ...corrections.flatMap((correction) => [
      correction.sourceEntryId,
      correction.replacementEntryId,
    ]),
  ];
  const chainEntries = await loadEntryDocuments(entryIds);
  const history = resolveEntryHistory({
    entries: chainEntries,
    correctionHeads: correctionHead ? [correctionHead] : [],
    corrections,
  });
  const currentEntry =
    history.activeEntries.find(
      (entry) => (entry.correctionRootEntryId || entry.id) === rootEntryId,
    ) ?? locatedEntry;
  const chainIds = chainEntries.map((entry) => entry.id);
  const [contributions, directClaims, dailyClaims] = await Promise.all([
    loadRelatedDocuments("leagueContributions", "entryId", chainIds),
    loadRelatedDocuments("seasonEvidenceClaims", "entryId", chainIds),
    loadRelatedDocuments("seasonEvidenceClaims", "entryIds", chainIds, "array-contains"),
  ]);
  const claims = uniqueById([...directClaims, ...dailyClaims]);
  const leagues = await loadLeagues([
    ...contributions.map((item) => item.leagueId),
    ...claims.map((item) => item.leagueId),
  ]);
  const profileSnapshot = await getDoc(doc(db, "users", locatedEntry.userId));
  const profile = profileSnapshot.exists()
    ? { id: profileSnapshot.id, ...profileSnapshot.data() }
    : null;
  const diagnostics = buildEntryIntegrityDiagnostics({
    rootEntryId,
    currentEntry,
    chainEntries,
    correctionHead,
    corrections,
    contributions,
    claims,
  });

  return {
    rootEntryId,
    locatedEntry,
    currentEntry,
    chainEntries: history.historyEntries,
    correctionHead,
    corrections,
    contributions,
    claims,
    leagues,
    profile,
    diagnostics,
    historyWarnings: history.warnings,
  };
}

function getSourceSnapshotForLeague(leagueId, contributions, claims) {
  return (
    contributions.find((item) => item.leagueId === leagueId) ||
    claims.find((item) => item.leagueId === leagueId) ||
    null
  );
}

function getOriginalDeadline(claim, sourceEntry, policy) {
  const existing = toDate(claim?.deadlineAt);
  if (existing) return existing;
  const created = toDate(sourceEntry?.createdAt) ?? new Date();
  return new Date(
    created.getTime() + Number(policy.proofDeadlineHours ?? 24) * 60 * 60 * 1000,
  );
}

function createCorrectionClaimPayload({
  identity,
  league,
  sourceSnapshot,
  replacementEntry,
  allocation,
  deadlineAt,
  correctionId,
  replacesClaimId = "",
}) {
  const challengeDate = toDate(replacementEntry.challengeDate);
  return {
    leagueId: league.id,
    leagueName: league.name,
    userId: replacementEntry.userId,
    displayName: sourceSnapshot.displayName || "Champion",
    avatarId: sourceSnapshot.avatarId || "legacy-trophy",
    houseId: sourceSnapshot.houseId || "",
    houseName: sourceSnapshot.houseName || "Unassigned",
    houseEmblemId: sourceSnapshot.houseEmblemId || "springbok",
    category: replacementEntry.category,
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
    correctionId,
    replacesClaimId,
    correctionIds: [correctionId],
    entryId: identity.claimType === "required-proof" ? replacementEntry.id : "",
    entryIds: [replacementEntry.id],
    deadlineAt: Timestamp.fromDate(deadlineAt),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

function createCorrectionContributionPayload({
  reference,
  correctionId,
  role,
  entryId,
  sourceSnapshot,
  category,
  scoreCategory,
  points,
  sourceContributionIds = [],
}) {
  return {
    id: reference.id,
    data: {
      leagueId: sourceSnapshot.leagueId,
      entryId,
      userId: sourceSnapshot.userId,
      displayName: sourceSnapshot.displayName || "Champion",
      avatarId: sourceSnapshot.avatarId || "legacy-trophy",
      houseId: sourceSnapshot.houseId || "",
      houseName: sourceSnapshot.houseName || "Unassigned",
      houseEmblemId: sourceSnapshot.houseEmblemId || "springbok",
      teamId: sourceSnapshot.teamId || sourceSnapshot.houseId || "",
      teamName: sourceSnapshot.teamName || sourceSnapshot.houseName || "Unassigned",
      category,
      scoreCategory,
      pointGroup: "activity",
      challengeDate: sourceSnapshot.challengeDate,
      activityPoints: Math.round(Number(points ?? 0) * 100) / 100,
      rulesVersion: sourceSnapshot.rulesVersion,
      source: role === "reversal" ? "correction-reversal" : "correction-replacement",
      sourceRedemptionId: "",
      evidenceClaimId: "",
      evidenceDecisionId: "",
      correctionId,
      correctionRole: role,
      replacesContributionIds: sourceContributionIds,
      createdAt: serverTimestamp(),
    },
  };
}

export async function createEntryCorrection({
  lookup,
  replacementData,
  reason,
  actorId,
}) {
  if (!actorId) {
    throw new Error("A Platform Administrator is required to create a correction.");
  }

  const bundle = await getEntryIntegrityBundle(lookup);
  const blockingDiagnostics = bundle.diagnostics.filter(
    (item) => item.severity === "error",
  );
  if (blockingDiagnostics.length > 0) {
    throw new Error(
      "This correction chain has unresolved integrity errors. Download the integrity report and reconcile the missing records before creating another replacement.",
    );
  }
  const sourceEntry = bundle.currentEntry;
  const categoryConfig = getCategory(sourceEntry?.category);
  if (!categoryConfig) {
    throw new Error("The entry category is no longer supported.");
  }

  const normalizedData = normalizeEntry(sourceEntry.category, replacementData);
  const entryErrors = validateEntry(categoryConfig, normalizedData);
  if (entryErrors.length > 0) {
    throw new Error(entryErrors.join(" "));
  }

  const replacementReference = doc(collection(db, "challengeEntries"));
  const correctionReference = doc(collection(db, "entryCorrections"));
  const auditReference = doc(collection(db, "auditEvents"));
  const rootEntryId = bundle.rootEntryId;
  const nextSequence = Number(bundle.correctionHead?.sequence ?? 0) + 1;
  const replacementEntry = {
    id: replacementReference.id,
    userId: sourceEntry.userId,
    category: sourceEntry.category,
    data: normalizedData,
    challengeDate: sourceEntry.challengeDate,
  };
  const draftValidation = validateEntryCorrectionDraft({
    sourceEntry,
    replacementEntry,
    reason,
  });
  if (!draftValidation.valid) {
    throw new Error(draftValidation.errors.join(" "));
  }

  const sourceContributions = bundle.contributions.filter(
    (item) => item.entryId === sourceEntry.id,
  );
  const sourceClaims = bundle.claims.filter(
    (item) =>
      item.entryId === sourceEntry.id || item.entryIds?.includes(sourceEntry.id),
  );
  const leagueIds = [
    ...new Set([
      ...sourceContributions.map((item) => item.leagueId),
      ...sourceClaims.map((item) => item.leagueId),
    ].filter(Boolean)),
  ];
  const leagueById = new Map(bundle.leagues.map((league) => [league.id, league]));
  const replacementPlans = leagueIds
    .map((leagueId) => {
      const league = leagueById.get(leagueId);
      const sourceSnapshot = getSourceSnapshotForLeague(
        leagueId,
        sourceContributions,
        sourceClaims,
      );
      return createReplacementLeaguePlan({ replacementEntry, league, sourceSnapshot });
    })
    .filter(Boolean);

  const newClaimPlans = [];
  const dailyClaimUpdates = [];
  const supersededClaimUpdates = [];
  const evidenceClaimIds = [];

  replacementPlans.forEach((plan) => {
    const { league, sourceSnapshot, allocation } = plan;
    const policy = normalizeEvidencePolicy(league.ruleset?.evidencePolicy);
    const oldRequiredClaim = sourceClaims.find(
      (claim) =>
        claim.leagueId === league.id &&
        claim.claimType === "required-proof" &&
        claim.entryId === sourceEntry.id &&
        claim.status !== "superseded",
    );
    const identity = allocation.claimRequired
      ? createEvidenceClaimIdentity({
          leagueId: league.id,
          userId: sourceEntry.userId,
          category: sourceEntry.category,
          entryId: replacementEntry.id,
          challengeDate: sourceEntry.challengeDate,
        })
      : null;

    if (!identity) {
      if (oldRequiredClaim) {
        supersededClaimUpdates.push({
          claim: oldRequiredClaim,
          identity: null,
        });
      }
      return;
    }
    evidenceClaimIds.push(identity.id);

    if (identity.claimType === "daily-bonus") {
      const existingClaim = sourceClaims.find(
        (claim) => claim.id === identity.id || (
          claim.leagueId === league.id &&
          claim.claimType === "daily-bonus" &&
          claim.category === sourceEntry.category &&
          claim.dateKey === identity.dateKey
        ),
      );
      if (existingClaim) {
        dailyClaimUpdates.push({ claim: existingClaim, identity });
      } else {
        newClaimPlans.push({
          identity,
          league,
          sourceSnapshot,
          allocation,
          deadlineAt: getOriginalDeadline(null, sourceEntry, policy),
          replacesClaimId: "",
        });
      }
      return;
    }

    if (oldRequiredClaim) {
      supersededClaimUpdates.push({
        claim: oldRequiredClaim,
        identity,
      });
    }
    newClaimPlans.push({
      identity,
      league,
      sourceSnapshot,
      allocation,
      deadlineAt: getOriginalDeadline(oldRequiredClaim, sourceEntry, policy),
      replacesClaimId: oldRequiredClaim?.id || "",
    });
  });

  const netGroups = groupNetActivityContributions(sourceContributions);
  const reversalPlans = netGroups.map((group, index) => {
    const reference = doc(
      db,
      "leagueContributions",
      `${correctionReference.id}_reversal_${index + 1}`,
    );
    return createCorrectionContributionPayload({
      reference,
      correctionId: correctionReference.id,
      role: "reversal",
      entryId: sourceEntry.id,
      sourceSnapshot: {
        ...group,
        userId: sourceEntry.userId,
      },
      category: group.category,
      scoreCategory: group.scoreCategory,
      points: -group.activityPoints,
      sourceContributionIds: group.sourceContributionIds,
    });
  });

  const replacementContributionPlans = replacementPlans
    .filter((plan) => Number(plan.allocation.immediatePoints ?? 0) > 0)
    .map((plan) => {
      const reference = doc(
        db,
        "leagueContributions",
        `${plan.league.id}_${replacementEntry.id}`,
      );
      return createCorrectionContributionPayload({
        reference,
        correctionId: correctionReference.id,
        role: "replacement",
        entryId: replacementEntry.id,
        sourceSnapshot: {
          ...plan.sourceSnapshot,
          leagueId: plan.league.id,
          userId: sourceEntry.userId,
          rulesVersion: plan.league.rulesVersion,
          challengeDate: sourceEntry.challengeDate,
        },
        category: sourceEntry.category,
        scoreCategory: plan.scoreCategory,
        points: plan.allocation.immediatePoints,
      });
    });

  const sourcePoints = calculateEntryPoints(sourceEntry);
  const replacementPoints = calculateEntryPoints(replacementEntry);

  await runTransaction(db, async (transaction) => {
    const sourceReference = doc(db, "challengeEntries", sourceEntry.id);
    const headReference = doc(db, "entryCorrectionHeads", rootEntryId);
    const [liveSource, liveHead, ...liveClaims] = await Promise.all([
      transaction.get(sourceReference),
      transaction.get(headReference),
      ...uniqueById([
        ...dailyClaimUpdates.map((item) => item.claim),
        ...supersededClaimUpdates.map((item) => item.claim),
      ]).map((claim) =>
        transaction.get(doc(db, "seasonEvidenceClaims", claim.id)),
      ),
    ]);

    if (!liveSource.exists()) {
      throw new Error("The source entry no longer exists.");
    }
    if (
      liveHead.exists() &&
      liveHead.data().currentEntryId !== sourceEntry.id
    ) {
      throw new Error(
        "This entry was corrected by another administrator. Reload the integrity record before continuing.",
      );
    }
    liveClaims.forEach((claimSnapshot) => {
      if (!claimSnapshot.exists()) {
        throw new Error("A linked proof claim changed while the correction was being prepared.");
      }
    });

    transaction.set(auditReference, {
      actorId,
      action: "entry.correction.completed",
      entityType: "entryCorrection",
      entityId: correctionReference.id,
      summary: `Replaced ${sourceEntry.category} entry ${sourceEntry.id} with an audited factual correction`,
      details: {
        rootEntryId,
        sourceEntryId: sourceEntry.id,
        replacementEntryId: replacementEntry.id,
        userId: sourceEntry.userId,
        category: sourceEntry.category,
        sequence: nextSequence,
        reason: draftValidation.value.reason,
      },
      createdAt: serverTimestamp(),
    });

    transaction.set(replacementReference, {
      userId: sourceEntry.userId,
      category: sourceEntry.category,
      data: normalizedData,
      source: "correction",
      sourceLeagueId: "",
      sourcePocketId: "",
      sourceRedemptionId: "",
      sourceCorrectionId: correctionReference.id,
      replacesEntryId: sourceEntry.id,
      correctionRootEntryId: rootEntryId,
      correctionSequence: nextSequence,
      evidenceClaimIds: [...new Set(evidenceClaimIds)],
      createdAt: serverTimestamp(),
      challengeDate: sourceEntry.challengeDate,
    });

    reversalPlans.forEach((plan) => {
      transaction.set(doc(db, "leagueContributions", plan.id), plan.data);
    });
    replacementContributionPlans.forEach((plan) => {
      transaction.set(doc(db, "leagueContributions", plan.id), plan.data);
    });

    newClaimPlans.forEach((plan) => {
      transaction.set(
        doc(db, "seasonEvidenceClaims", plan.identity.id),
        createCorrectionClaimPayload({
          ...plan,
          replacementEntry,
          correctionId: correctionReference.id,
        }),
      );
    });

    dailyClaimUpdates.forEach(({ claim }) => {
      transaction.update(doc(db, "seasonEvidenceClaims", claim.id), {
        entryIds: [...new Set([...(claim.entryIds ?? []), replacementEntry.id])],
        correctionIds: [...new Set([...(claim.correctionIds ?? []), correctionReference.id])],
        updatedAt: serverTimestamp(),
      });
    });

    supersededClaimUpdates.forEach(({ claim, identity }) => {
      transaction.update(doc(db, "seasonEvidenceClaims", claim.id), {
        status: "superseded",
        reviewedAt: serverTimestamp(),
        reviewedBy: actorId,
        reviewReason: draftValidation.value.reason,
        supersededByClaimId: identity?.id || "",
        correctionId: correctionReference.id,
        correctionIds: [...new Set([...(claim.correctionIds ?? []), correctionReference.id])],
        updatedAt: serverTimestamp(),
      });
    });

    transaction.set(correctionReference, {
      rootEntryId,
      sourceEntryId: sourceEntry.id,
      replacementEntryId: replacementEntry.id,
      userId: sourceEntry.userId,
      category: sourceEntry.category,
      challengeDate: sourceEntry.challengeDate,
      sequence: nextSequence,
      reason: draftValidation.value.reason,
      actorId,
      sourcePoints,
      replacementPoints,
      pointDelta: Math.round((replacementPoints - sourcePoints) * 100) / 100,
      affectedLeagueIds: leagueIds,
      sourceContributionIds: sourceContributions.map((item) => item.id),
      reversalContributionIds: reversalPlans.map((item) => item.id),
      replacementContributionIds: replacementContributionPlans.map((item) => item.id),
      sourceClaimIds: sourceClaims.map((item) => item.id),
      replacementClaimIds: newClaimPlans.map((item) => item.identity.id),
      dailyClaimIds: dailyClaimUpdates.map((item) => item.claim.id),
      status: "completed",
      lastAuditId: auditReference.id,
      createdAt: serverTimestamp(),
    });

    transaction.set(headReference, {
      rootEntryId,
      currentEntryId: replacementEntry.id,
      userId: sourceEntry.userId,
      category: sourceEntry.category,
      sequence: nextSequence,
      status: "active",
      lastCorrectionId: correctionReference.id,
      lastAuditId: auditReference.id,
      updatedAt: serverTimestamp(),
      updatedBy: actorId,
      ...(liveHead.exists()
        ? {
            createdAt: liveHead.data().createdAt,
            createdBy: liveHead.data().createdBy,
          }
        : {
            createdAt: serverTimestamp(),
            createdBy: actorId,
          }),
    });
  });

  return getEntryIntegrityBundle(replacementEntry.id);
}

export function createEntryIntegrityReport(bundle) {
  if (!bundle?.rootEntryId) {
    throw new Error("Load an entry integrity record before exporting it.");
  }
  return serializeExportValue({
    metadata: {
      product: "Champions Legacy Challenge",
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      scope: "targeted-entry-integrity",
    },
    rootEntryId: bundle.rootEntryId,
    currentEntryId: bundle.currentEntry?.id || "",
    player: bundle.profile
      ? {
          id: bundle.profile.id,
          displayName: bundle.profile.displayName || bundle.profile.fullName || "Champion",
        }
      : null,
    chainEntries: bundle.chainEntries,
    correctionHead: bundle.correctionHead,
    corrections: bundle.corrections,
    contributions: bundle.contributions,
    claims: bundle.claims,
    diagnostics: bundle.diagnostics,
  });
}

export function downloadEntryIntegrityReport(report) {
  const blob = new Blob([`${JSON.stringify(report, null, 2)}\n`], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `champions-legacy-entry-integrity-${report.rootEntryId}.json`;
  anchor.hidden = true;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}
