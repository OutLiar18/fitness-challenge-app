export const CURRENT_ONBOARDING_VERSION = 1;
export const ACCOUNT_REQUEST_ACKNOWLEDGEMENT_VERSION = 2;
export const TRUSTED_ACCOUNT_DELETION_POLICY_VERSION = "trusted-deletion-v1";
export const ACCOUNT_DELETION_WAITING_DAYS = 7;
export const TRUSTED_ACCOUNT_DELETION_MODEL_VERSION = "trusted-account-deletion-v1";

export const ACCOUNT_REQUEST_REASON_OPTIONS = Object.freeze([
  { id: "prefer-not-to-say", label: "Prefer not to say" },
  { id: "privacy", label: "Privacy concerns" },
  { id: "not-using", label: "I no longer use the challenge" },
  { id: "duplicate-account", label: "Duplicate account" },
  { id: "technical", label: "Technical problems" },
  { id: "other", label: "Another reason" },
]);

export const ACCOUNT_REQUEST_STATUSES = Object.freeze({
  requested: {
    label: "Requested",
    description: "Your request is waiting for a Platform Administrator to acknowledge it.",
  },
  acknowledged: {
    label: "Cancellation window",
    description: "Your seven-day cancellation window has started. You may cancel before trusted processing begins.",
  },
  processing: {
    label: "Processing",
    description: "Trusted deletion has started and can no longer be cancelled.",
  },
  completed: {
    label: "Completed",
    description: "Firebase Authentication and eligible private records were removed. Shared season history was anonymised.",
  },
  failed: {
    label: "Needs attention",
    description: "Trusted processing stopped safely and requires a Platform Administrator to resume it.",
  },
  cancelled: {
    label: "Cancelled",
    description: "The request is no longer active. You can submit it again later.",
  },
});

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function toDate(value) {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value?.toDate === "function") {
    const converted = value.toDate();
    return converted instanceof Date && !Number.isNaN(converted.getTime())
      ? converted
      : null;
  }
  const converted = new Date(value ?? "");
  return Number.isNaN(converted.getTime()) ? null : converted;
}

function hashText(value, seed = 0x811c9dc5) {
  const text = String(value ?? "");
  let hash = seed >>> 0;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function encodeFormerPlayerCode(value) {
  let number = hashText(`display:${value}`, 0x9e3779b9);
  let code = "";
  for (let index = 0; index < 4; index += 1) {
    code += CODE_ALPHABET[number % CODE_ALPHABET.length];
    number = Math.floor(number / CODE_ALPHABET.length);
  }
  return code;
}

export function createFormerPlayerIdentity(userId) {
  const normalized = String(userId || "").trim();
  if (!normalized) {
    throw new Error("A player identifier is required for trusted anonymisation.");
  }
  const first = hashText(`identity:${normalized}`, 0x811c9dc5)
    .toString(16)
    .padStart(8, "0");
  const second = hashText(`identity-2:${normalized}`, 0x85ebca6b)
    .toString(16)
    .padStart(8, "0");
  const code = encodeFormerPlayerCode(normalized);
  return {
    userId: `former-${first}${second}`,
    displayName: `Former Player ${code}`,
    avatarId: "legacy-trophy",
    code,
  };
}

export function shouldShowOnboarding(profile) {
  return Number(profile?.onboardingVersion) === 0;
}

export function getOnboardingCompletionValues() {
  return {
    onboardingVersion: CURRENT_ONBOARDING_VERSION,
  };
}

export function normalizeAccountRequestReason(reasonCode) {
  const normalized = String(reasonCode || "").trim();
  return ACCOUNT_REQUEST_REASON_OPTIONS.some((option) => option.id === normalized)
    ? normalized
    : ACCOUNT_REQUEST_REASON_OPTIONS[0].id;
}

export function getAccountRequestReasonLabel(reasonCode) {
  return (
    ACCOUNT_REQUEST_REASON_OPTIONS.find(
      (option) => option.id === normalizeAccountRequestReason(reasonCode),
    )?.label || ACCOUNT_REQUEST_REASON_OPTIONS[0].label
  );
}

export function getAccountRequestStatus(status) {
  return ACCOUNT_REQUEST_STATUSES[status] ?? {
    label: "Unknown",
    description: "The current request state could not be interpreted.",
  };
}

export function isActiveAccountRequest(request) {
  return ["requested", "acknowledged", "processing", "failed"].includes(request?.status);
}

export function canCancelAccountRequest(request) {
  return request?.status === "requested" || request?.status === "acknowledged";
}

export function getAccountDeletionEligibilityDate(request) {
  const acknowledgedAt = toDate(request?.acknowledgedAt);
  if (!acknowledgedAt) return null;
  const days = Number(request?.waitingPeriodDays ?? ACCOUNT_DELETION_WAITING_DAYS);
  const safeDays = Number.isFinite(days) && days >= 0
    ? days
    : ACCOUNT_DELETION_WAITING_DAYS;
  return new Date(acknowledgedAt.getTime() + safeDays * 24 * 60 * 60 * 1000);
}

export function getAccountDeletionTiming(request, referenceDate = new Date()) {
  const eligibleAt = getAccountDeletionEligibilityDate(request);
  const reference = toDate(referenceDate) ?? new Date();
  const millisecondsRemaining = eligibleAt
    ? Math.max(0, eligibleAt.getTime() - reference.getTime())
    : null;
  return {
    eligibleAt,
    eligible: Boolean(
      eligibleAt
      && reference.getTime() >= eligibleAt.getTime()
      && ["acknowledged", "processing", "failed"].includes(request?.status),
    ),
    millisecondsRemaining,
    daysRemaining: millisecondsRemaining == null
      ? null
      : Math.ceil(millisecondsRemaining / (24 * 60 * 60 * 1000)),
  };
}

export function createAccountDeletionRequestDefaults() {
  return {
    deletionPolicyVersion: TRUSTED_ACCOUNT_DELETION_POLICY_VERSION,
    waitingPeriodDays: ACCOUNT_DELETION_WAITING_DAYS,
    processingAt: null,
    processingBy: "",
    completedAt: null,
    completedBy: "",
    executionId: "",
    anonymizedPlayerId: "",
    anonymizedDisplayName: "",
    failureAt: null,
    failureMessage: "",
  };
}

export function createTrustedDeletionFingerprint({ request, identity, counts = {} } = {}) {
  const payload = JSON.stringify({
    modelVersion: TRUSTED_ACCOUNT_DELETION_MODEL_VERSION,
    requestId: request?.id || request?.userId || "",
    status: request?.status || "",
    requestedAt: toDate(request?.requestedAt)?.toISOString() || "",
    acknowledgedAt: toDate(request?.acknowledgedAt)?.toISOString() || "",
    identity,
    counts: Object.fromEntries(
      Object.entries(counts).sort(([first], [second]) => first.localeCompare(second)),
    ),
  });
  return hashText(payload, 0x27d4eb2d).toString(16).padStart(8, "0");
}
