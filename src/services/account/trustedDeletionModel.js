import {
  ACCOUNT_DELETION_WAITING_DAYS,
  TRUSTED_ACCOUNT_DELETION_MODEL_VERSION,
  createFormerPlayerIdentity,
  createTrustedDeletionFingerprint,
  getAccountDeletionTiming,
} from "./accountModel";

export const ACCOUNT_DELETION_PRIVATE_COLLECTIONS = Object.freeze([
  "challengeEntries",
  "playerNotifications",
  "clientErrorReports",
  "leagueCompositionProfiles",
]);

export const ACCOUNT_DELETION_ANONYMISED_COLLECTIONS = Object.freeze([
  "entryCorrectionHeads",
  "entryCorrections",
  "leagueMemberships",
  "leagueContributions",
  "seasonEvidenceClaims",
  "seasonEvidenceDecisions",
  "pocketActivities",
  "pocketRedemptions",
  "exerciseSuggestions",
  "librarySuggestions",
  "leadershipVotes",
  "leagueEvidenceReviewers",
  "leagueHouseAssignmentHistory",
]);

function createIssue(severity, code, message) {
  return { severity, code, message };
}

function countRecords(records = {}) {
  return Object.fromEntries(
    Object.entries(records)
      .map(([name, value]) => [name, Array.isArray(value) ? value.length : Number(value ?? 0)])
      .sort(([first], [second]) => first.localeCompare(second)),
  );
}

function replaceString(value, source, identity) {
  if (!value) return value;
  if (value === source.userId) return identity.userId;
  if (source.email && value === source.email) return "";
  if (source.displayName && value === source.displayName) return identity.displayName;

  let next = value;
  if (source.email && next.includes(source.email)) {
    next = next.split(source.email).join("[redacted email]");
  }
  if (source.displayName && next.includes(source.displayName)) {
    next = next.split(source.displayName).join(identity.displayName);
  }
  if (source.userId && next.includes(source.userId)) {
    next = next.split(source.userId).join(identity.userId);
  }
  return next;
}

export function replaceDeletedPlayerIdentity(value, source = {}, identity = {}) {
  if (Array.isArray(value)) {
    return value.map((item) => replaceDeletedPlayerIdentity(item, source, identity));
  }
  if (value instanceof Date || typeof value?.toDate === "function") return value;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => {
        if (key.toLowerCase() === "email" && nestedValue === source.email) {
          return [key, ""];
        }
        if (key === "avatarId" && nestedValue === source.avatarId) {
          return [key, identity.avatarId];
        }
        return [key, replaceDeletedPlayerIdentity(nestedValue, source, identity)];
      }),
    );
  }
  return typeof value === "string"
    ? replaceString(value, source, identity)
    : value;
}

export function buildTrustedAccountDeletionAudit({
  request,
  profile,
  authUserExists = true,
  administratorCount = 0,
  records = {},
  referenceDate = new Date(),
} = {}) {
  const userId = request?.userId || request?.id || profile?.id || "";
  const identity = userId ? createFormerPlayerIdentity(userId) : null;
  const timing = getAccountDeletionTiming(request, referenceDate);
  const counts = countRecords(records);
  const issues = [];

  if (!request?.id && !request?.userId) {
    issues.push(createIssue("blocking", "REQUEST_MISSING", "A trusted deletion request is required."));
  }
  if (!["acknowledged", "processing", "failed"].includes(request?.status)) {
    issues.push(createIssue("blocking", "REQUEST_NOT_READY", "The request must be acknowledged before trusted deletion can run."));
  }
  if (!timing.eligible && request?.status === "acknowledged") {
    issues.push(createIssue(
      "blocking",
      "WAITING_PERIOD_ACTIVE",
      `The ${ACCOUNT_DELETION_WAITING_DAYS}-day cancellation window has not ended.`,
    ));
  }
  if (profile?.role === "admin" && administratorCount <= 1) {
    issues.push(createIssue(
      "blocking",
      "LAST_PLATFORM_ADMIN",
      "The final Platform Administrator cannot be deleted until another Platform Administrator exists.",
    ));
  }
  if (!profile) {
    issues.push(createIssue("warning", "PROFILE_MISSING", "The player profile is already missing."));
  }
  if (!authUserExists) {
    issues.push(createIssue("warning", "AUTH_USER_MISSING", "Firebase Authentication is already missing; Firestore cleanup may still continue."));
  }

  const blockingCount = issues.filter((issue) => issue.severity === "blocking").length;
  const warningCount = issues.filter((issue) => issue.severity === "warning").length;
  const fingerprint = identity
    ? createTrustedDeletionFingerprint({ request, identity, counts })
    : "";

  return {
    modelVersion: TRUSTED_ACCOUNT_DELETION_MODEL_VERSION,
    requestId: request?.id || userId,
    originalUserId: userId,
    identity,
    timing,
    counts,
    issues,
    issueCounts: {
      blocking: blockingCount,
      warning: warningCount,
    },
    fingerprint,
    processable: blockingCount === 0,
  };
}

export function createCompletedRequestRedaction({ request, identity, executionId, actorId } = {}) {
  return {
    ...request,
    userId: identity.userId,
    email: "",
    displayName: identity.displayName,
    reasonCode: "prefer-not-to-say",
    status: "completed",
    executionId,
    anonymizedPlayerId: identity.userId,
    anonymizedDisplayName: identity.displayName,
    completedBy: actorId,
    failureMessage: "",
  };
}
