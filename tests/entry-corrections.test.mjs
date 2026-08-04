import assert from "node:assert/strict";
import test from "node:test";

import { DEFAULT_SEASON_EVIDENCE_POLICY } from "../src/constants/evidence.js";
import {
  buildEntryIntegrityDiagnostics,
  createReplacementLeaguePlan,
  groupNetActivityContributions,
  validateEntryCorrectionDraft,
} from "../src/services/entries/entryCorrectionModel.js";
import {
  getJournalHistoryPage,
  resolveEntryHistory,
} from "../src/services/entries/entryHistoryModel.js";

function timestamp(value) {
  return { toDate: () => new Date(value) };
}

function entry(id, options = {}) {
  return {
    id,
    userId: "player-one",
    category: "water",
    data: { amount: 500 },
    source: "activity",
    correctionRootEntryId: "",
    correctionSequence: 0,
    challengeDate: timestamp("2026-08-04T00:00:00.000Z"),
    createdAt: timestamp("2026-08-04T08:00:00.000Z"),
    ...options,
  };
}

test("entry history exposes only the correction head as active while preserving every version", () => {
  const original = entry("entry-one");
  const replacement = entry("entry-two", {
    source: "correction",
    correctionRootEntryId: "entry-one",
    correctionSequence: 1,
    createdAt: timestamp("2026-08-04T10:00:00.000Z"),
  });
  const correction = {
    id: "correction-one",
    rootEntryId: "entry-one",
    sourceEntryId: "entry-one",
    replacementEntryId: "entry-two",
    sequence: 1,
  };

  const resolved = resolveEntryHistory({
    entries: [original, replacement],
    correctionHeads: [{ rootEntryId: "entry-one", currentEntryId: "entry-two" }],
    corrections: [correction],
  });

  assert.deepEqual(resolved.activeEntries.map((item) => item.id), ["entry-two"]);
  assert.equal(resolved.historyEntries.length, 2);
  assert.equal(
    resolved.historyEntries.find((item) => item.id === "entry-one").correction.isSuperseded,
    true,
  );
});

test("entry history falls back to the newest available correction when a head target is missing", () => {
  const original = entry("entry-one");
  const replacement = entry("entry-two", {
    source: "correction",
    correctionRootEntryId: "entry-one",
    correctionSequence: 1,
  });
  const resolved = resolveEntryHistory({
    entries: [original, replacement],
    correctionHeads: [{ rootEntryId: "entry-one", currentEntryId: "missing-entry" }],
  });

  assert.equal(resolved.activeEntries[0].id, "entry-two");
  assert.equal(resolved.warnings[0].code, "HEAD_CURRENT_ENTRY_MISSING");
});

test("entry history uses the latest immutable correction while a head subscription is delayed", () => {
  const original = entry("entry-one");
  const replacement = entry("entry-two", {
    source: "correction",
    correctionRootEntryId: "entry-one",
    correctionSequence: 1,
  });
  const resolved = resolveEntryHistory({
    entries: [original, replacement],
    corrections: [{
      id: "correction-one",
      rootEntryId: "entry-one",
      sourceEntryId: "entry-one",
      replacementEntryId: "entry-two",
      sequence: 1,
    }],
  });

  assert.deepEqual(resolved.activeEntries.map((item) => item.id), ["entry-two"]);
  assert.equal(resolved.warnings[0].code, "CORRECTION_HEAD_MISSING");
});

test("Journal history paginates recorded days without subscribing to duplicate entry lists", () => {
  const entries = Array.from({ length: 9 }, (_, index) => {
    const date = new Date(Date.UTC(2026, 7, 9 - index));
    return entry(`entry-${index}`, {
      challengeDate: timestamp(date.toISOString()),
      createdAt: timestamp(date.toISOString()),
    });
  });

  const firstPage = getJournalHistoryPage({ entries, page: 0 });
  const secondPage = getJournalHistoryPage({ entries, page: 1 });

  assert.equal(firstPage.items.length, 7);
  assert.equal(firstPage.pageCount, 2);
  assert.equal(firstPage.hasOlder, true);
  assert.equal(secondPage.items.length, 2);
  assert.equal(secondPage.hasNewer, true);
  assert.equal(firstPage.items[0].dateKey, "2026-08-09");
});

test("net activity grouping keeps Running Cardio and proof-released Running points separate", () => {
  const grouped = groupNetActivityContributions([
    {
      id: "cardio-immediate",
      leagueId: "season-one",
      category: "running",
      scoreCategory: "cardio",
      pointGroup: "activity",
      houseId: "house-a",
      activityPoints: 7,
    },
    {
      id: "running-release",
      leagueId: "season-one",
      category: "running",
      scoreCategory: "running",
      pointGroup: "activity",
      houseId: "house-a",
      activityPoints: 18,
    },
    {
      id: "prior-running-reversal",
      leagueId: "season-one",
      category: "running",
      scoreCategory: "running",
      pointGroup: "activity",
      houseId: "house-a",
      activityPoints: -3,
    },
    {
      id: "photo-bonus",
      leagueId: "season-one",
      category: "fruit",
      scoreCategory: "fruit",
      pointGroup: "evidenceBonus",
      houseId: "house-a",
      activityPoints: 3,
    },
  ]);

  assert.deepEqual(
    grouped.map((item) => [item.scoreCategory, item.activityPoints]),
    [["cardio", 7], ["running", 15]],
  );
});

test("a corrected qualifying Running entry preserves immediate Cardio and pending Running proof", () => {
  const replacementEntry = {
    id: "replacement-run",
    userId: "player-one",
    category: "running",
    data: { distance: 5, totalMinutes: 30, totalSeconds: 1800 },
    challengeDate: timestamp("2026-08-04T00:00:00.000Z"),
  };
  const plan = createReplacementLeaguePlan({
    replacementEntry,
    league: {
      id: "season-one",
      rulesVersion: "season-houses-v2",
      ruleset: { evidencePolicy: DEFAULT_SEASON_EVIDENCE_POLICY },
    },
    sourceSnapshot: { leagueId: "season-one", houseId: "house-a" },
  });

  assert.equal(plan.allocation.immediatePoints, 7);
  assert.equal(plan.allocation.pendingPoints, 18);
  assert.equal(plan.allocation.claimRequired, true);
  assert.equal(plan.scoreCategory, "cardio");
});

test("a corrected non-qualifying Running entry removes the required proof allocation", () => {
  const plan = createReplacementLeaguePlan({
    replacementEntry: {
      id: "replacement-run",
      userId: "player-one",
      category: "running",
      data: { distance: 2, totalMinutes: 20, totalSeconds: 1200 },
      challengeDate: timestamp("2026-08-04T00:00:00.000Z"),
    },
    league: {
      id: "season-one",
      rulesVersion: "season-houses-v2",
      ruleset: { evidencePolicy: DEFAULT_SEASON_EVIDENCE_POLICY },
    },
    sourceSnapshot: { leagueId: "season-one", houseId: "house-a" },
  });

  assert.equal(plan.allocation.immediatePoints, 2);
  assert.equal(plan.allocation.pendingPoints, 0);
  assert.equal(plan.allocation.claimRequired, false);
});

test("correction drafts keep category and challenge date fixed and require a reason", () => {
  const sourceEntry = entry("entry-one");
  const valid = validateEntryCorrectionDraft({
    sourceEntry,
    replacementEntry: entry("entry-two", { data: { amount: 750 } }),
    reason: "The logged bottle size was entered incorrectly.",
  });
  const invalid = validateEntryCorrectionDraft({
    sourceEntry,
    replacementEntry: entry("entry-three", {
      category: "fruit",
      challengeDate: timestamp("2026-08-05T00:00:00.000Z"),
    }),
    reason: "Too short",
  });

  assert.equal(valid.valid, true);
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.some((message) => message.includes("category")));
  assert.ok(invalid.errors.some((message) => message.includes("challenge date")));
});

test("Pocket redemption entries are diagnosed but cannot enter the replacement workflow", () => {
  const result = validateEntryCorrectionDraft({
    sourceEntry: entry("pocket-entry", { source: "pocket" }),
    replacementEntry: entry("replacement-entry"),
    reason: "The source record needs a factual replacement.",
  });

  assert.equal(result.valid, false);
  assert.ok(result.errors.some((message) => message.includes("Pocket redemptions")));
});

test("integrity diagnostics report a healthy complete chain", () => {
  const original = entry("entry-one");
  const replacement = entry("entry-two", {
    source: "correction",
    correctionRootEntryId: "entry-one",
    correctionSequence: 1,
    evidenceClaimIds: ["claim-two"],
  });
  const correction = {
    id: "correction-one",
    rootEntryId: "entry-one",
    sourceEntryId: "entry-one",
    replacementEntryId: "entry-two",
    sequence: 1,
  };
  const diagnostics = buildEntryIntegrityDiagnostics({
    rootEntryId: "entry-one",
    currentEntry: replacement,
    chainEntries: [original, replacement],
    correctionHead: { rootEntryId: "entry-one", currentEntryId: "entry-two" },
    corrections: [correction],
    contributions: [{
      id: "replacement-points",
      entryId: "entry-two",
      correctionId: "correction-one",
    }],
    claims: [{ id: "claim-two", entryId: "entry-two", entryIds: ["entry-two"] }],
  });

  assert.deepEqual(diagnostics.map((item) => item.code), ["ENTRY_CHAIN_HEALTHY"]);
});

test("integrity diagnostics surface missing replacements, orphan records and sequence gaps", () => {
  const original = entry("entry-one");
  const diagnostics = buildEntryIntegrityDiagnostics({
    rootEntryId: "entry-one",
    currentEntry: original,
    chainEntries: [original],
    correctionHead: { rootEntryId: "entry-one", currentEntryId: "missing-entry" },
    corrections: [{
      id: "correction-two",
      sourceEntryId: "entry-one",
      replacementEntryId: "missing-entry",
      sequence: 2,
    }],
    contributions: [{
      id: "orphan-contribution",
      entryId: "other-entry",
      correctionId: "missing-correction",
    }],
    claims: [{
      id: "claim-one",
      status: "superseded",
      supersededByClaimId: "missing-claim",
      entryId: "entry-one",
      entryIds: ["entry-one"],
    }],
  });
  const codes = diagnostics.map((item) => item.code);

  assert.ok(codes.includes("HEAD_MISMATCH"));
  assert.ok(codes.includes("CORRECTION_REPLACEMENT_MISSING"));
  assert.ok(codes.includes("ORPHAN_CONTRIBUTION"));
  assert.ok(codes.includes("CONTRIBUTION_CORRECTION_MISSING"));
  assert.ok(codes.includes("SUPERSEDING_CLAIM_MISSING"));
  assert.ok(codes.includes("CORRECTION_SEQUENCE_GAP"));
});
