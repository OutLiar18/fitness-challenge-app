import assert from "node:assert/strict";
import test from "node:test";

import {
  ACCOUNT_DELETION_ANONYMISED_COLLECTIONS,
  ACCOUNT_DELETION_PRIVATE_COLLECTIONS,
  buildTrustedAccountDeletionAudit,
  replaceDeletedPlayerIdentity,
} from "../src/services/account/trustedDeletionModel.js";
import { createFormerPlayerIdentity } from "../src/services/account/accountModel.js";
import {
  createTrustedDeletionRecoveryPlan,
  getTrustedDeletionRecoveryDisposition,
  getTrustedDeletionRecoveryPlanHash,
  validateTrustedDeletionRecoveryPlan,
} from "../scripts/trusted-account-deletion-recovery.mjs";

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
  assert.equal(ACCOUNT_DELETION_PRIVATE_COLLECTIONS.includes("leagueCompositionProfiles"), true);
});


test("trusted deletion recovery plans freeze and sort the exact document path set", () => {
  const plan = createTrustedDeletionRecoveryPlan({
    modelVersion: "trusted-account-deletion-v1",
    executionId: "execution-one",
    requestId: "player-one",
    subjectUserId: "player-one",
    fingerprint: "abc123",
    actorId: "admin-one",
    source: { userId: "player-one", email: "player@example.com", displayName: "Player One" },
    identity: { userId: "former-one", displayName: "Former Player TEST" },
    counts: { "delete:challengeEntries": 1 },
    leagueParticipantDecrements: { "league-one": 1 },
    operations: [
      { type: "anonymise", path: "leagues/league-one", collectionName: "leagues", id: "league-one" },
      { type: "delete", path: "challengeEntries/entry-one", collectionName: "challengeEntries", id: "entry-one" },
    ],
    createdAt: "2026-08-11T09:00:00.000Z",
  });

  assert.deepEqual(plan.operations.map((operation) => operation.path), [
    "challengeEntries/entry-one",
    "leagues/league-one",
  ]);
  assert.equal(plan.leagueParticipantDecrements["league-one"], 1);
  assert.equal(getTrustedDeletionRecoveryPlanHash(plan).length, 64);
});

test("trusted deletion recovery validation rejects execution-plan drift", () => {
  const plan = createTrustedDeletionRecoveryPlan({
    modelVersion: "trusted-account-deletion-v1",
    executionId: "execution-one",
    requestId: "player-one",
    subjectUserId: "player-one",
    fingerprint: "abc123",
    actorId: "admin-one",
    operations: [
      { type: "delete", path: "users/player-one", collectionName: "users", id: "player-one" },
    ],
    createdAt: "2026-08-11T09:00:00.000Z",
  });
  const sha256 = getTrustedDeletionRecoveryPlanHash(plan);

  assert.equal(validateTrustedDeletionRecoveryPlan({
    plan,
    sha256,
    request: {
      id: "player-one",
      userId: "player-one",
      executionId: "execution-one",
      status: "failed",
    },
    execution: {
      status: "failed",
      modelVersion: "trusted-account-deletion-v1",
      fingerprint: "abc123",
      recoveryPlanSha256: sha256,
      recoveryPlanOperationCount: 1,
    },
  }), true);

  assert.throws(() => validateTrustedDeletionRecoveryPlan({
    plan,
    sha256,
    request: {
      id: "player-one",
      userId: "player-one",
      executionId: "execution-one",
      status: "failed",
    },
    execution: {
      status: "failed",
      modelVersion: "trusted-account-deletion-v1",
      fingerprint: "different",
      recoveryPlanSha256: sha256,
      recoveryPlanOperationCount: 1,
    },
  }), /fingerprint/);
});

test("trusted deletion recovery distinguishes replay-safe and conflicting documents", () => {
  const operation = {
    type: "anonymise",
    path: "leagueMemberships/member-one",
    collectionName: "leagueMemberships",
    id: "member-one",
  };

  assert.equal(getTrustedDeletionRecoveryDisposition({
    operation,
    exists: true,
    data: {
      accountDeletionAnonymised: true,
      accountDeletionExecutionId: "execution-one",
    },
    executionId: "execution-one",
  }), "already-anonymised");

  assert.equal(getTrustedDeletionRecoveryDisposition({
    operation,
    exists: true,
    data: {
      accountDeletionAnonymised: true,
      accountDeletionExecutionId: "execution-two",
    },
    executionId: "execution-one",
  }), "conflicting-execution");

  assert.equal(getTrustedDeletionRecoveryDisposition({
    operation,
    exists: false,
    data: null,
    executionId: "execution-one",
  }), "missing-anonymised-record");
});

test("trusted deletion recovery refuses duplicate document paths", () => {
  assert.throws(() => createTrustedDeletionRecoveryPlan({
    modelVersion: "trusted-account-deletion-v1",
    executionId: "execution-one",
    requestId: "player-one",
    subjectUserId: "player-one",
    fingerprint: "abc123",
    actorId: "admin-one",
    operations: [
      { type: "delete", path: "users/player-one", collectionName: "users", id: "player-one" },
      { type: "anonymise", path: "users/player-one", collectionName: "users", id: "player-one" },
    ],
  }), /duplicate document paths/);
});
