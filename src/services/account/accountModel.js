export const CURRENT_ONBOARDING_VERSION = 1;
export const ACCOUNT_REQUEST_ACKNOWLEDGEMENT_VERSION = 1;

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
    label: "Acknowledged",
    description: "A Platform Administrator has seen the request and will complete the trusted manual process.",
  },
  cancelled: {
    label: "Cancelled",
    description: "The request is no longer active. You can submit it again later.",
  },
});

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
  return request?.status === "requested" || request?.status === "acknowledged";
}
