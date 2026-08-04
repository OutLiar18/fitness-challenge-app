import { EVIDENCE_REQUIRED_CATEGORIES } from "../../constants/evidence";
import { getLocalDateKey } from "../dateService";
import { allocateEntryPointsForEvidence } from "../evidence/evidenceModel";
import { calculateEntryPoints } from "../points";

export const ENTRY_CORRECTION_REASON_MIN_LENGTH = 8;
export const ENTRY_CORRECTION_REASON_MAX_LENGTH = 500;

export const ENTRY_INTEGRITY_SEVERITY = Object.freeze({
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
});

export function normalizeCorrectionReason(value) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, ENTRY_CORRECTION_REASON_MAX_LENGTH);
}

export function validateEntryCorrectionDraft({
  sourceEntry,
  replacementEntry,
  reason,
} = {}) {
  const errors = [];
  const cleanReason = normalizeCorrectionReason(reason);

  if (!sourceEntry?.id || !sourceEntry?.userId) {
    errors.push("Load a valid source entry before creating a correction.");
  }
  if (sourceEntry?.source === "pocket") {
    errors.push(
      "Pocket redemptions are preserved as final activation records and cannot be replaced through this correction workflow.",
    );
  }
  if (!replacementEntry?.category || replacementEntry.category !== sourceEntry?.category) {
    errors.push("A correction must keep the original activity category.");
  }
  if (
    getLocalDateKey(replacementEntry?.challengeDate) !==
    getLocalDateKey(sourceEntry?.challengeDate)
  ) {
    errors.push("A correction must keep the original challenge date.");
  }
  if (cleanReason.length < ENTRY_CORRECTION_REASON_MIN_LENGTH) {
    errors.push(
      `Explain the factual mistake in at least ${ENTRY_CORRECTION_REASON_MIN_LENGTH} characters.`,
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    value: { reason: cleanReason },
  };
}

function getContributionGroupingKey(contribution) {
  return [
    contribution.leagueId,
    contribution.category,
    contribution.scoreCategory || contribution.category,
    contribution.pointGroup || "activity",
    contribution.houseId || "",
  ].join("::");
}

export function groupNetActivityContributions(contributions = []) {
  const groups = new Map();

  contributions
    .filter((contribution) => (contribution.pointGroup || "activity") === "activity")
    .forEach((contribution) => {
      const key = getContributionGroupingKey(contribution);
      const current = groups.get(key) ?? {
        leagueId: contribution.leagueId,
        category: contribution.category,
        scoreCategory: contribution.scoreCategory || contribution.category,
        pointGroup: contribution.pointGroup || "activity",
        houseId: contribution.houseId || "",
        houseName: contribution.houseName || "Unassigned",
        houseEmblemId: contribution.houseEmblemId || "springbok",
        teamId: contribution.teamId || contribution.houseId || "",
        teamName: contribution.teamName || contribution.houseName || "Unassigned",
        displayName: contribution.displayName || "Champion",
        avatarId: contribution.avatarId || "legacy-trophy",
        rulesVersion: contribution.rulesVersion || "",
        challengeDate: contribution.challengeDate,
        activityPoints: 0,
        sourceContributionIds: [],
      };

      current.activityPoints += Number(contribution.activityPoints ?? 0);
      current.sourceContributionIds.push(contribution.id);
      groups.set(key, current);
    });

  return [...groups.values()]
    .map((group) => ({
      ...group,
      activityPoints: Math.round(group.activityPoints * 100) / 100,
    }))
    .filter((group) => Math.abs(group.activityPoints) > 0.0001);
}

export function createReplacementLeaguePlan({
  replacementEntry,
  league,
  sourceSnapshot,
} = {}) {
  if (!replacementEntry || !league?.id || !sourceSnapshot) {
    return null;
  }

  const policy = league.ruleset?.evidencePolicy;
  const allocation = policy
    ? allocateEntryPointsForEvidence(replacementEntry, policy)
    : {
        immediatePoints: calculateEntryPoints(replacementEntry),
        pendingPoints: 0,
        claimRequired: false,
        claimType: "none",
      };

  return {
    league,
    sourceSnapshot,
    allocation,
    scoreCategory:
      policy && replacementEntry.category === "running"
        ? "cardio"
        : replacementEntry.category,
    requiredProof:
      Boolean(allocation.claimRequired) &&
      EVIDENCE_REQUIRED_CATEGORIES.includes(replacementEntry.category),
  };
}

function diagnostic(code, severity, message, details = {}) {
  return { code, severity, message, details };
}

export function buildEntryIntegrityDiagnostics({
  rootEntryId,
  currentEntry,
  chainEntries = [],
  correctionHead = null,
  corrections = [],
  contributions = [],
  claims = [],
} = {}) {
  const diagnostics = [];
  const entryIds = new Set(chainEntries.map((entry) => entry.id));
  const correctionIds = new Set(corrections.map((correction) => correction.id));

  if (!currentEntry) {
    diagnostics.push(
      diagnostic(
        "CURRENT_ENTRY_MISSING",
        ENTRY_INTEGRITY_SEVERITY.ERROR,
        "The correction chain does not have a readable current entry.",
      ),
    );
  }

  if (correctionHead && correctionHead.currentEntryId !== currentEntry?.id) {
    diagnostics.push(
      diagnostic(
        "HEAD_MISMATCH",
        ENTRY_INTEGRITY_SEVERITY.ERROR,
        "The correction head does not point to the entry currently resolved by the history model.",
        {
          expected: correctionHead.currentEntryId,
          resolved: currentEntry?.id || "",
        },
      ),
    );
  }

  corrections.forEach((correction) => {
    if (!entryIds.has(correction.sourceEntryId)) {
      diagnostics.push(
        diagnostic(
          "CORRECTION_SOURCE_MISSING",
          ENTRY_INTEGRITY_SEVERITY.ERROR,
          "A correction record references a missing source entry.",
          { correctionId: correction.id, entryId: correction.sourceEntryId },
        ),
      );
    }
    if (!entryIds.has(correction.replacementEntryId)) {
      diagnostics.push(
        diagnostic(
          "CORRECTION_REPLACEMENT_MISSING",
          ENTRY_INTEGRITY_SEVERITY.ERROR,
          "A correction record references a missing replacement entry.",
          { correctionId: correction.id, entryId: correction.replacementEntryId },
        ),
      );
    }
  });

  contributions.forEach((contribution) => {
    if (!entryIds.has(contribution.entryId)) {
      diagnostics.push(
        diagnostic(
          "ORPHAN_CONTRIBUTION",
          ENTRY_INTEGRITY_SEVERITY.ERROR,
          "A league contribution references an entry outside this correction chain.",
          { contributionId: contribution.id, entryId: contribution.entryId },
        ),
      );
    }
    if (
      contribution.correctionId &&
      !correctionIds.has(contribution.correctionId)
    ) {
      diagnostics.push(
        diagnostic(
          "CONTRIBUTION_CORRECTION_MISSING",
          ENTRY_INTEGRITY_SEVERITY.ERROR,
          "A correction contribution references a missing correction record.",
          { contributionId: contribution.id, correctionId: contribution.correctionId },
        ),
      );
    }
  });

  claims.forEach((claim) => {
    const linkedIds = [claim.entryId, ...(claim.entryIds ?? [])].filter(Boolean);
    if (!linkedIds.some((entryId) => entryIds.has(entryId))) {
      diagnostics.push(
        diagnostic(
          "ORPHAN_EVIDENCE_CLAIM",
          ENTRY_INTEGRITY_SEVERITY.ERROR,
          "An evidence claim no longer links to an entry in this correction chain.",
          { claimId: claim.id },
        ),
      );
    }
    if (
      claim.status === "superseded" &&
      claim.supersededByClaimId &&
      !claims.some((candidate) => candidate.id === claim.supersededByClaimId)
    ) {
      diagnostics.push(
        diagnostic(
          "SUPERSEDING_CLAIM_MISSING",
          ENTRY_INTEGRITY_SEVERITY.ERROR,
          "A superseded proof claim points to a missing replacement claim.",
          { claimId: claim.id, replacementClaimId: claim.supersededByClaimId },
        ),
      );
    }
  });

  const currentRequiredClaimIds = currentEntry?.evidenceClaimIds ?? [];
  currentRequiredClaimIds.forEach((claimId) => {
    if (!claims.some((claim) => claim.id === claimId)) {
      diagnostics.push(
        diagnostic(
          "ENTRY_CLAIM_MISSING",
          ENTRY_INTEGRITY_SEVERITY.ERROR,
          "The current entry lists a proof claim that could not be found.",
          { entryId: currentEntry?.id || "", claimId },
        ),
      );
    }
  });

  const sequenceValues = corrections
    .map((correction) => Number(correction.sequence ?? 0))
    .sort((first, second) => first - second);
  sequenceValues.forEach((sequence, index) => {
    if (sequence !== index + 1) {
      diagnostics.push(
        diagnostic(
          "CORRECTION_SEQUENCE_GAP",
          ENTRY_INTEGRITY_SEVERITY.WARNING,
          "The correction chain contains a missing or duplicated sequence number.",
          { rootEntryId, sequence },
        ),
      );
    }
  });

  if (diagnostics.length === 0) {
    diagnostics.push(
      diagnostic(
        "ENTRY_CHAIN_HEALTHY",
        ENTRY_INTEGRITY_SEVERITY.INFO,
        "The entry, correction chain, proof links and derived competition records are internally consistent.",
      ),
    );
  }

  return diagnostics;
}
