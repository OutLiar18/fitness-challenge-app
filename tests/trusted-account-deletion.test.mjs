import assert from "node:assert/strict";
import test from "node:test";

import {
  ACCOUNT_DELETION_ANONYMISED_COLLECTIONS,
  buildTrustedAccountDeletionAudit,
  replaceDeletedPlayerIdentity,
} from "../src/services/account/trustedDeletionModel.js";
import { createFormerPlayerIdentity } from "../src/services/account/accountModel.js";

test("trusted deletion blocks the cancellation window and the final Platform Administrator", () => {
  const audit = buildTrustedAccountDeletionAudit({
    request: {
      id: "player-one",
      userId: "player-one",
      status: "acknowledged",
      requestedAt: new Date("2026-08-01T08:00:00.000Z"),
      acknowledgedAt: new Date("2026-08-02T08:00:00.000Z"),
      waitingPeriodDays: 7,
    },
    profile: { id: "player-one", role: "admin" },
    administratorCount: 1,
    authUserExists: true,
    referenceDate: new Date("2026-08-05T08:00:00.000Z"),
  });

  assert.equal(audit.processable, false);
  assert.deepEqual(
    audit.issues.filter((issue) => issue.severity === "blocking").map((issue) => issue.code),
    ["WAITING_PERIOD_ACTIVE", "LAST_PLATFORM_ADMIN"],
  );
});

test("trusted deletion becomes processable after seven days and fingerprints the plan", () => {
  const input = {
    request: {
      id: "player-one",
      userId: "player-one",
      status: "acknowledged",
      requestedAt: new Date("2026-08-01T08:00:00.000Z"),
      acknowledgedAt: new Date("2026-08-02T08:00:00.000Z"),
      waitingPeriodDays: 7,
    },
    profile: { id: "player-one", role: "player" },
    administratorCount: 2,
    authUserExists: true,
    records: {
      "delete:challengeEntries": 4,
      "anonymise:leagueMemberships": 1,
    },
    referenceDate: new Date("2026-08-09T08:00:00.000Z"),
  };
  const first = buildTrustedAccountDeletionAudit(input);
  const second = buildTrustedAccountDeletionAudit({
    ...input,
    records: {
      "anonymise:leagueMemberships": 1,
      "delete:challengeEntries": 4,
    },
  });

  assert.equal(first.processable, true);
  assert.equal(first.fingerprint, second.fingerprint);
  assert.equal(first.identity.displayName, createFormerPlayerIdentity("player-one").displayName);
});

test("shared records replace identity without removing competition facts", () => {
  const identity = createFormerPlayerIdentity("player-one");
  const transformed = replaceDeletedPlayerIdentity({
    userId: "player-one",
    displayName: "Kyle Player",
    email: "kyle@example.com",
    activityPoints: 15,
    details: {
      summary: "Kyle Player earned points for player-one",
      contact: "kyle@example.com",
    },
  }, {
    userId: "player-one",
    displayName: "Kyle Player",
    email: "kyle@example.com",
    avatarId: "legacy-lion",
  }, identity);

  assert.equal(transformed.userId, identity.userId);
  assert.equal(transformed.displayName, identity.displayName);
  assert.equal(transformed.email, "");
  assert.equal(transformed.activityPoints, 15);
  assert.equal(transformed.details.summary, `${identity.displayName} earned points for ${identity.userId}`);
  assert.equal(transformed.details.contact, "");
  assert.equal(ACCOUNT_DELETION_ANONYMISED_COLLECTIONS.includes("leagueHouseAssignmentHistory"), true);
});
