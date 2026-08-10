import assert from "node:assert/strict";
import test from "node:test";
import { isPlatformAdministrator } from "../src/services/admin/adminAuthorityModel.js";

import {
  ANNOUNCEMENT_STATUS_IDS,
  ANNOUNCEMENT_TYPE_IDS,
  USER_ROLES,
  USER_ROLE_IDS,
  getAnnouncementType,
  getRoleLabel,
} from "../src/constants/admin.js";
import {
  mergeAnnouncements,
  normalizeAnnouncement,
  validateAnnouncement,
} from "../src/services/announcements/announcementModel.js";
import {
  buildPublishedLibraryItem,
  createLibraryReleaseId,
  getPublishableSuggestions,
  validateLibraryReleaseDraft,
  validateLibraryVersion,
} from "../src/services/admin/libraryPublishingModel.js";
import {
  mergeLibraryNames,
  normalizePublishedLibraryItem,
} from "../src/services/libraries/globalLibraryModel.js";
import {
  createErrorFingerprint,
  sanitizeErrorReport,
} from "../src/services/monitoring/errorReportModel.js";
import {
  formatExperiencePoints,
  formatKilometres,
  formatMeasurement,
  formatMillilitres,
  formatPaceLong,
  formatPoints,
} from "../src/utils/displayFormatters.js";

test("Platform Administrator UI authority follows only the trusted Firestore profile role", () => {
  assert.equal(isPlatformAdministrator({ role: "admin" }), true);
  assert.equal(isPlatformAdministrator({ role: "leagueAdmin" }), false);
  assert.equal(isPlatformAdministrator({ role: "user" }), false);
  assert.equal(isPlatformAdministrator(null), false);
});

test("Trusted role and announcement identifiers remain unique", () => {
  assert.equal(new Set(USER_ROLE_IDS).size, USER_ROLE_IDS.length);
  assert.equal(new Set(ANNOUNCEMENT_TYPE_IDS).size, ANNOUNCEMENT_TYPE_IDS.length);
  assert.equal(
    new Set(ANNOUNCEMENT_STATUS_IDS).size,
    ANNOUNCEMENT_STATUS_IDS.length,
  );
  assert.equal(USER_ROLES.some((role) => role.id === "admin"), true);
  assert.equal(getRoleLabel("admin"), "Platform Administrator");
  assert.equal(getRoleLabel("unknown"), "Player");
  assert.equal(getAnnouncementType("maintenance").label, "Maintenance");
});

test("Announcement validation accepts polished content and rejects incomplete drafts", () => {
  const valid = validateAnnouncement({
    title: "A stronger administration foundation",
    summary:
      "Trusted administrators can publish updates and review community suggestions.",
    body:
      "Every privileged change is protected by Firestore rules and linked to an immutable audit event.",
    type: "release",
    icon: "🛡️",
    status: "published",
    featured: true,
    version: "0.9.0",
  });

  assert.equal(valid.valid, true);
  assert.equal(valid.errors.length, 0);

  const invalid = validateAnnouncement({
    title: "No",
    summary: "Too short",
    body: "Still too short",
    type: "unknown",
    status: "missing",
  });

  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.length >= 4);
});

test("Live announcements replace bundled copies without publishing drafts", () => {
  const bundled = [
    normalizeAnnouncement({
      id: "release-one",
      title: "Bundled title",
      summary: "Bundled release summary for offline history.",
      body: "Bundled release details remain available as a safe fallback source.",
      type: "release",
      status: "published",
      publishedAt: "2026-07-31",
      source: "bundled",
    }),
  ];

  const merged = mergeAnnouncements(
    [
      {
        id: "release-one",
        title: "Live title",
        summary: "The live Firestore version replaces the bundled fallback.",
        body: "Players see the centrally managed announcement after it is published.",
        type: "release",
        status: "published",
        publishedAt: "2026-08-01",
      },
      {
        id: "draft-one",
        title: "Private draft",
        summary: "This draft is deliberately not visible to ordinary players.",
        body: "Draft announcements stay inside the administrative workspace until published.",
        type: "feature",
        status: "draft",
        publishedAt: null,
      },
    ],
    bundled,
  );

  assert.equal(merged.length, 1);
  assert.equal(merged[0].title, "Live title");
  assert.equal(merged[0].source, "firestore");
});

test("Player-facing formatters use complete measurement names", () => {
  assert.equal(formatMillilitres(2000), "2,000 millilitres");
  assert.equal(formatKilometres(5), "5 kilometres");
  assert.equal(formatMeasurement(1, "min"), "1 minute");
  assert.equal(formatMeasurement(30, "min"), "30 minutes");
  assert.equal(formatMeasurement(50, "effective reps"), "50 effective repetitions");
  assert.equal(formatPoints(1), "1 point");
  assert.equal(formatPoints(12), "12 points");
  assert.equal(formatExperiencePoints(1), "1 experience point");
  assert.equal(formatExperiencePoints(25), "25 experience points");
  assert.equal(formatPaceLong(660), "11:00 per kilometre");
});


test("Approved suggestions become versioned shared library definitions", () => {
  const suggestion = {
    id: "exercise-one",
    kind: "exercise",
    collectionName: "exerciseSuggestions",
    status: "approved",
    definition: {
      name: "Ring Support Hold",
      category: "upperBody",
      exerciseType: "hold",
      proposedTier: 3,
      equipment: "Gymnastic Rings",
      movementPattern: "Static Support",
      primaryMuscles: ["Shoulders", "Triceps"],
      secondaryMuscles: ["Chest"],
    },
  };

  const item = buildPublishedLibraryItem(suggestion, "0.10.0");

  assert.equal(item.itemType, "exercise");
  assert.equal(item.itemId, "exercise_ring-support-hold");
  assert.equal(item.definition.exerciseType, "hold");
  assert.equal(item.definition.difficulty.tier, 3);
  assert.equal(item.definition.difficulty.multiplier, 1.2);
  assert.equal(item.libraryVersion, "0.10.0");
});

test("Only approved unpublished suggestions enter a release candidate list", () => {
  const suggestions = [
    { id: "one", status: "pending" },
    { id: "two", status: "approved", publicationStatus: "unpublished" },
    { id: "three", status: "approved", publicationStatus: "published" },
  ];

  assert.deepEqual(
    getPublishableSuggestions(suggestions).map((item) => item.id),
    ["two"],
  );
  assert.equal(validateLibraryVersion("0.10.0").valid, true);
  assert.equal(createLibraryReleaseId("0.10.0-preview.1"), "release_0.10.0-preview.1");
  assert.equal(validateLibraryVersion("release ten").valid, false);

  const draft = validateLibraryReleaseDraft({
    version: "0.10.1",
    notes: "Publishes one reviewed shared skill.",
    suggestions: [suggestions[1]],
  });
  const invalidDraft = validateLibraryReleaseDraft({
    version: "release ten",
    notes: "Too short",
    suggestions: [],
  });

  assert.equal(draft.valid, true);
  assert.equal(invalidDraft.valid, false);
  assert.ok(invalidDraft.errors.length >= 3);
});

test("Published library items merge with built-in options without duplicates", () => {
  const published = normalizePublishedLibraryItem({
    id: "skill_conflict-resolution",
    itemType: "skill",
    status: "published",
    definition: {
      name: "Conflict Resolution",
      area: "Communication",
      tags: ["Communication"],
    },
  });

  assert.deepEqual(
    mergeLibraryNames(["Chess", "Conflict Resolution"], [published]),
    ["Chess", "Conflict Resolution"],
  );
});

test("Client error reports are sanitised and produce stable fingerprints", () => {
  const error = new TypeError("A component failed");
  const fingerprint = createErrorFingerprint(error, "test");
  const report = sanitizeErrorReport({
    error,
    source: "test",
    context: { safe: true },
  });

  assert.equal(report.name, "TypeError");
  assert.equal(report.message, "A component failed");
  assert.equal(report.fingerprint, fingerprint);
  assert.equal(report.releaseVersion, "0.15.0");
  assert.ok(report.context.summary.includes("safe"));

  const circularContext = {};
  circularContext.self = circularContext;
  const circularReport = sanitizeErrorReport({
    error: new Error("Circular context"),
    context: circularContext,
  });

  assert.match(circularReport.context.summary, /could not be serialised safely/i);
});
