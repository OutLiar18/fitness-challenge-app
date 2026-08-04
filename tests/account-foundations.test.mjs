import assert from "node:assert/strict";
import test from "node:test";

import {
  ACCOUNT_REQUEST_ACKNOWLEDGEMENT_VERSION,
  ACCOUNT_REQUEST_REASON_OPTIONS,
  CURRENT_ONBOARDING_VERSION,
  getAccountRequestReasonLabel,
  getAccountRequestStatus,
  getOnboardingCompletionValues,
  isActiveAccountRequest,
  normalizeAccountRequestReason,
  shouldShowOnboarding,
} from "../src/services/account/accountModel.js";
import {
  PERSONAL_DATA_EXPORT_SCHEMA_VERSION,
  createPersonalDataFilename,
  serializeExportValue,
} from "../src/services/account/dataExportModel.js";

test("new-player onboarding is explicit and legacy profiles are not interrupted", () => {
  assert.equal(shouldShowOnboarding({ onboardingVersion: 0 }), true);
  assert.equal(shouldShowOnboarding({ onboardingVersion: 1 }), false);
  assert.equal(shouldShowOnboarding({}), false);
  assert.equal(shouldShowOnboarding(null), false);
  assert.deepEqual(getOnboardingCompletionValues(), {
    onboardingVersion: CURRENT_ONBOARDING_VERSION,
  });
});

test("account deletion requests use constrained reasons and understandable states", () => {
  assert.ok(ACCOUNT_REQUEST_REASON_OPTIONS.length >= 5);
  assert.equal(ACCOUNT_REQUEST_ACKNOWLEDGEMENT_VERSION, 1);
  assert.equal(normalizeAccountRequestReason("privacy"), "privacy");
  assert.equal(normalizeAccountRequestReason("invented"), "prefer-not-to-say");
  assert.equal(getAccountRequestReasonLabel("technical"), "Technical problems");
  assert.equal(getAccountRequestStatus("requested").label, "Requested");
  assert.equal(isActiveAccountRequest({ status: "requested" }), true);
  assert.equal(isActiveAccountRequest({ status: "acknowledged" }), true);
  assert.equal(isActiveAccountRequest({ status: "cancelled" }), false);
});

test("personal export values preserve shape and convert dates to portable ISO strings", () => {
  const fakeTimestamp = {
    toDate() {
      return new Date("2026-08-04T08:30:00.000Z");
    },
  };
  const original = {
    timestamp: fakeTimestamp,
    date: new Date("2026-08-03T12:00:00.000Z"),
    nested: [{ value: 3, nullable: null }],
  };

  assert.deepEqual(serializeExportValue(original), {
    timestamp: "2026-08-04T08:30:00.000Z",
    date: "2026-08-03T12:00:00.000Z",
    nested: [{ value: 3, nullable: null }],
  });
  assert.equal(PERSONAL_DATA_EXPORT_SCHEMA_VERSION, 1);
  assert.equal(
    createPersonalDataFilename(new Date("2026-08-04T11:00:00.000Z")),
    "champions-legacy-personal-data-2026-08-04.json",
  );
});
