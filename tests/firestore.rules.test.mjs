import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { after, before, beforeEach, test } from "node:test";

import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

const PROJECT_ID = "champions-legacy-rules-test";
let testEnvironment;

function playerContext(userId = "player-one") {
  return testEnvironment.authenticatedContext(userId, {
    email: `${userId}@example.com`,
  });
}

function leagueAdminContext(userId = "league-admin") {
  return testEnvironment.authenticatedContext(userId, {
    email: `${userId}@example.com`,
  });
}

function adminContext(userId = "admin-one") {
  return testEnvironment.authenticatedContext(userId, {
    email: `${userId}@example.com`,
  });
}

function claimOnlyAdminContext(userId = "claim-only-admin") {
  return testEnvironment.authenticatedContext(userId, {
    email: `${userId}@example.com`,
    admin: true,
  });
}

function createProfile(userId, role = "user") {
  return {
    uid: userId,
    firstName: "Test",
    lastName: "Player",
    fullName: "Test Player",
    displayName: "Test Player",
    email: `${userId}@example.com`,
    role,
    team: "",
    avatarId: "legacy-trophy",
    joinedAt: Timestamp.now(),
    profileUpdatedAt: Timestamp.now(),
  };
}

before(async () => {
  const rules = await fs.readFile(
    path.resolve("firestore.rules"),
    "utf8",
  );

  testEnvironment = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: { rules },
  });
});

beforeEach(async () => {
  await testEnvironment.clearFirestore();

  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    await setDoc(doc(firestore, "users", "player-one"), createProfile("player-one"));
    await setDoc(doc(firestore, "users", "player-two"), createProfile("player-two"));
    await setDoc(doc(firestore, "users", "player-three"), createProfile("player-three"));
    await setDoc(doc(firestore, "users", "player-four"), createProfile("player-four"));
    await setDoc(doc(firestore, "users", "league-admin"), createProfile("league-admin", "leagueAdmin"));
    await setDoc(doc(firestore, "users", "admin-one"), createProfile("admin-one", "admin"));
  });
});

after(async () => {
  await testEnvironment?.cleanup();
});

test("ordinary players can read published library items but not archived items", async () => {
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    const common = {
      itemType: "skill",
      name: "Conflict Resolution",
      normalizedName: "conflict resolution",
      definition: {
        name: "Conflict Resolution",
        area: "Communication",
        tags: ["Communication"],
      },
      libraryVersion: "0.10.0",
      sourceSuggestionId: "suggestion-one",
      sourceCollection: "librarySuggestions",
      releaseId: "release-one",
      createdAt: Timestamp.now(),
      createdBy: "admin-one",
      updatedAt: Timestamp.now(),
      updatedBy: "admin-one",
      publishedAt: Timestamp.now(),
      archivedAt: null,
      lastAuditId: "audit-one",
    };

    await setDoc(doc(firestore, "publishedLibraryItems", "skill_conflict-resolution"), {
      ...common,
      status: "published",
    });
    await setDoc(doc(firestore, "publishedLibraryItems", "skill_archived"), {
      ...common,
      name: "Archived Skill",
      normalizedName: "archived skill",
      status: "archived",
      archivedAt: Timestamp.now(),
    });
  });

  const firestore = playerContext().firestore();

  await assertSucceeds(
    getDoc(doc(firestore, "publishedLibraryItems", "skill_conflict-resolution")),
  );
  await assertFails(
    getDoc(doc(firestore, "publishedLibraryItems", "skill_archived")),
  );
});

test("players cannot change their trusted role", async () => {
  const firestore = playerContext().firestore();

  await assertFails(
    updateDoc(doc(firestore, "users", "player-one"), {
      role: "admin",
    }),
  );
});

test("Platform Administrator authority follows only the trusted Firestore profile role", async () => {
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    await setDoc(
      doc(context.firestore(), "users", "claim-only-admin"),
      createProfile("claim-only-admin", "user"),
    );
  });

  await assertFails(
    getDocs(collection(claimOnlyAdminContext().firestore(), "users")),
  );

  await assertSucceeds(
    getDocs(collection(adminContext().firestore(), "users")),
  );
});

test("a stale admin custom claim cannot survive an audited profile demotion", async () => {
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    await setDoc(
      doc(context.firestore(), "users", "stale-admin"),
      createProfile("stale-admin", "admin"),
    );
  });

  const staleClaimFirestore = claimOnlyAdminContext("stale-admin").firestore();

  await assertSucceeds(
    getDocs(collection(staleClaimFirestore, "users")),
  );

  const firestore = adminContext().firestore();
  const auditId = "demote-stale-admin";
  const batch = writeBatch(firestore);

  batch.set(doc(firestore, "auditEvents", auditId), {
    actorId: "admin-one",
    action: "user.access.updated",
    entityType: "user",
    entityId: "stale-admin",
    summary: "Demoted stale-claim administrator",
    details: {
      previousRole: "admin",
      nextRole: "user",
    },
    createdAt: serverTimestamp(),
  });

  batch.update(doc(firestore, "users", "stale-admin"), {
    role: "user",
    adminUpdatedAt: serverTimestamp(),
    adminUpdatedBy: "admin-one",
    lastAuditId: auditId,
  });

  await assertSucceeds(batch.commit());

  await assertFails(
    getDocs(collection(staleClaimFirestore, "users")),
  );
});

test("players may select only one of the 16 supported MBTI Legacy Profiles", async () => {
  const firestore = playerContext().firestore();

  await assertSucceeds(
    updateDoc(doc(firestore, "users", "player-one"), {
      mbtiType: "INTJ",
      profileUpdatedAt: serverTimestamp(),
    }),
  );

  await assertFails(
    updateDoc(doc(firestore, "users", "player-one"), {
      mbtiType: "ABCD",
      profileUpdatedAt: serverTimestamp(),
    }),
  );
});

test("authenticated players can create sanitised error reports", async () => {
  const firestore = playerContext().firestore();

  await assertSucceeds(
    setDoc(doc(firestore, "clientErrorReports", "report-one"), {
      name: "TypeError",
      message: "A component failed while rendering.",
      stack: "TypeError: A component failed",
      source: "react.error-boundary",
      route: "/dashboard",
      releaseVersion: "0.10.0",
      context: { summary: "{}" },
      userAgent: "Rules test",
      occurredAt: Timestamp.now(),
      fingerprint: "react.error-boundary|TypeError|render",
      userId: "player-one",
      status: "open",
      reportedAt: serverTimestamp(),
      resolvedAt: null,
      resolvedBy: "",
      resolutionNote: "",
      lastAuditId: "",
    }),
  );
});

test("publishing an approved suggestion requires an administrator and audit records", async () => {
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    await setDoc(
      doc(context.firestore(), "librarySuggestions", "skill-suggestion"),
      {
        submittedBy: "player-one",
        challengeEntryId: "entry-one",
        itemType: "skill",
        definition: {
          name: "Conflict Resolution",
          area: "Communication",
          tags: ["Communication"],
        },
        status: "approved",
        createdAt: Timestamp.now(),
        reviewedAt: Timestamp.now(),
        reviewedBy: "admin-one",
        rejectionReason: "",
        lastAuditId: "review-audit",
      },
    );
  });

  const normalFirestore = playerContext().firestore();
  await assertFails(
    setDoc(doc(normalFirestore, "publishedLibraryItems", "skill_conflict-resolution"), {
      itemType: "skill",
      name: "Conflict Resolution",
    }),
  );

  const firestore = adminContext().firestore();
  const batch = writeBatch(firestore);
  const itemAuditId = "item-audit";
  const suggestionAuditId = "suggestion-audit";
  const releaseAuditId = "release-audit";
  const itemId = "skill_conflict-resolution";
  const releaseId = "release-one";

  batch.set(doc(firestore, "auditEvents", itemAuditId), {
    actorId: "admin-one",
    action: "library.item.published",
    entityType: "publishedLibraryItem",
    entityId: itemId,
    summary: "Published shared skill: Conflict Resolution",
    details: {},
    createdAt: serverTimestamp(),
  });
  batch.set(doc(firestore, "auditEvents", suggestionAuditId), {
    actorId: "admin-one",
    action: "suggestion.published",
    entityType: "librarySuggestions",
    entityId: "skill-suggestion",
    summary: "Published approved suggestion: Conflict Resolution",
    details: {},
    createdAt: serverTimestamp(),
  });
  batch.set(doc(firestore, "auditEvents", releaseAuditId), {
    actorId: "admin-one",
    action: "library.release.published",
    entityType: "libraryRelease",
    entityId: releaseId,
    summary: "Published global library release 0.10.0",
    details: {},
    createdAt: serverTimestamp(),
  });
  batch.set(doc(firestore, "publishedLibraryItems", itemId), {
    itemType: "skill",
    name: "Conflict Resolution",
    normalizedName: "conflict resolution",
    definition: {
      name: "Conflict Resolution",
      area: "Communication",
      tags: ["Communication"],
    },
    status: "published",
    libraryVersion: "0.10.0",
    sourceSuggestionId: "skill-suggestion",
    sourceCollection: "librarySuggestions",
    releaseId,
    createdAt: serverTimestamp(),
    createdBy: "admin-one",
    updatedAt: serverTimestamp(),
    updatedBy: "admin-one",
    publishedAt: serverTimestamp(),
    archivedAt: null,
    lastAuditId: itemAuditId,
  });
  batch.update(doc(firestore, "librarySuggestions", "skill-suggestion"), {
    publicationStatus: "published",
    publishedAt: serverTimestamp(),
    publishedBy: "admin-one",
    publishedLibraryItemId: itemId,
    libraryVersion: "0.10.0",
    lastAuditId: suggestionAuditId,
  });
  batch.set(doc(firestore, "libraryReleases", releaseId), {
    version: "0.10.0",
    notes: "Adds a reviewed communication skill.",
    status: "published",
    itemIds: [itemId],
    itemCount: 1,
    createdAt: serverTimestamp(),
    createdBy: "admin-one",
    publishedAt: serverTimestamp(),
    lastAuditId: releaseAuditId,
  });

  await assertSucceeds(batch.commit());
});

test("ordinary players cannot read draft announcements", async () => {
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), "announcements", "draft-one"), {
      title: "Private draft",
      summary: "This message is not ready for players.",
      body: "Only administrators should be able to see this draft announcement.",
      type: "feature",
      icon: "✨",
      status: "draft",
      featured: false,
      version: "0.10.0",
      createdAt: Timestamp.now(),
      createdBy: "admin-one",
      updatedAt: Timestamp.now(),
      updatedBy: "admin-one",
      publishedAt: null,
      lastAuditId: "audit-draft",
    });
  });

  await assertFails(
    getDoc(doc(playerContext().firestore(), "announcements", "draft-one")),
  );
  await assertSucceeds(
    getDoc(doc(adminContext().firestore(), "announcements", "draft-one")),
  );
});

test("resolving an error report requires a Platform Administrator and an audit event", async () => {
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), "clientErrorReports", "report-resolve"), {
      name: "Error",
      message: "A report needs administrator review.",
      stack: "",
      source: "rules-test",
      route: "/dashboard",
      releaseVersion: "0.10.0",
      context: { summary: "{}" },
      userAgent: "Rules test",
      occurredAt: Timestamp.now(),
      fingerprint: "rules-test|Error|review",
      userId: "player-one",
      status: "open",
      reportedAt: Timestamp.now(),
      resolvedAt: null,
      resolvedBy: "",
      resolutionNote: "",
      lastAuditId: "",
    });
  });

  await assertFails(
    updateDoc(
      doc(playerContext().firestore(), "clientErrorReports", "report-resolve"),
      { status: "resolved" },
    ),
  );

  const firestore = adminContext().firestore();
  const batch = writeBatch(firestore);
  const auditId = "error-resolution-audit";

  batch.set(doc(firestore, "auditEvents", auditId), {
    actorId: "admin-one",
    action: "error.report.resolved",
    entityType: "clientErrorReport",
    entityId: "report-resolve",
    summary: "Resolved a client error report",
    details: {},
    createdAt: serverTimestamp(),
  });
  batch.update(doc(firestore, "clientErrorReports", "report-resolve"), {
    status: "resolved",
    resolvedAt: serverTimestamp(),
    resolvedBy: "admin-one",
    resolutionNote: "Verified and covered by a regression test.",
    lastAuditId: auditId,
  });

  await assertSucceeds(batch.commit());
});

test("trusted announcement writes remain audit-bound", async () => {
  const firestore = adminContext().firestore();
  const batch = writeBatch(firestore);
  const announcementId = "announcement-audited";
  const auditId = "announcement-create-audit";

  batch.set(doc(firestore, "auditEvents", auditId), {
    actorId: "admin-one",
    action: "announcement.created",
    entityType: "announcement",
    entityId: announcementId,
    summary: "Created an audited announcement",
    details: {},
    createdAt: serverTimestamp(),
  });
  batch.set(doc(firestore, "announcements", announcementId), {
    title: "Audited release",
    summary: "A trusted administrator created this announcement.",
    body: "This announcement remains bound to its immutable audit event.",
    type: "release",
    icon: "",
    status: "published",
    featured: false,
    version: "0.24.0",
    createdAt: serverTimestamp(),
    createdBy: "admin-one",
    updatedAt: serverTimestamp(),
    updatedBy: "admin-one",
    publishedAt: serverTimestamp(),
    lastAuditId: auditId,
  });
  await assertSucceeds(batch.commit());

  await assertFails(
    setDoc(doc(firestore, "announcements", "announcement-detached"), {
      title: "Detached announcement",
      summary: "This trusted write is missing its required audit record.",
      body: "Platform Administrator authority does not remove the audit requirement.",
      type: "release",
      icon: "",
      status: "published",
      featured: false,
      version: "0.24.0",
      createdAt: serverTimestamp(),
      createdBy: "admin-one",
      updatedAt: serverTimestamp(),
      updatedBy: "admin-one",
      publishedAt: serverTimestamp(),
      lastAuditId: "missing-announcement-audit",
    }),
  );
});

test("trusted library publication remains audit-bound", async () => {
  const firestore = adminContext().firestore();
  await assertFails(
    setDoc(doc(firestore, "libraryReleases", "release-detached"), {
      version: "0.24.1",
      notes: "A detached release must not be accepted.",
      status: "published",
      itemIds: ["skill_example"],
      itemCount: 1,
      createdAt: serverTimestamp(),
      createdBy: "admin-one",
      publishedAt: serverTimestamp(),
      lastAuditId: "missing-library-release-audit",
    }),
  );
});

test("trusted error resolution remains audit-bound", async () => {
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), "clientErrorReports", "report-detached-resolution"), {
      name: "Error",
      message: "This report is used to test detached resolution.",
      stack: "",
      source: "rules-test",
      route: "/dashboard",
      releaseVersion: "0.24.0",
      context: { summary: "{}" },
      userAgent: "Rules test",
      occurredAt: Timestamp.now(),
      fingerprint: "rules-test|Error|detached-resolution",
      userId: "player-one",
      status: "open",
      reportedAt: Timestamp.now(),
      resolvedAt: null,
      resolvedBy: "",
      resolutionNote: "",
      lastAuditId: "",
    });
  });

  await assertFails(
    updateDoc(doc(adminContext().firestore(), "clientErrorReports", "report-detached-resolution"), {
      status: "resolved",
      resolvedAt: serverTimestamp(),
      resolvedBy: "admin-one",
      resolutionNote: "This should fail without a matching audit record.",
      lastAuditId: "missing-error-resolution-audit",
    }),
  );
});

test("published library releases are immutable after creation", async () => {
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), "libraryReleases", "release_0.10.0"), {
      version: "0.10.0",
      notes: "Initial reviewed library release.",
      status: "published",
      itemIds: ["skill_conflict-resolution"],
      itemCount: 1,
      createdAt: Timestamp.now(),
      createdBy: "admin-one",
      publishedAt: Timestamp.now(),
      lastAuditId: "release-audit",
    });
  });

  await assertFails(
    updateDoc(
      doc(adminContext().firestore(), "libraryReleases", "release_0.10.0"),
      { notes: "Rewritten release history." },
    ),
  );
});


function currentSeasonRuleset() {
  return {
    version: "season-houses-v1",
    scoringEngineVersion: "points-v2",
    dailyActivityCap: 20,
    dailyParticipationBonus: 5,
    includedCategories: [
      "water", "fruit", "reading", "running", "upperBody",
      "lowerBody", "core", "cardio", "skill", "steps",
    ],
    modules: {
      houses: true,
      chaosAssignment: true,
      leadershipElections: true,
      rosterSwaps: true,
      pocketWeek: true,
      powerPlay: false,
      transferMarket: false,
      buddyBonus: false,
      fiveFires: false,
    },
  };
}

function currentEvidencePolicy() {
  return {
    version: "whatsapp-proof-v1",
    timezone: "Africa/Johannesburg",
    proofDeadlineHours: 24,
    fruitDailyServingCap: 5,
    running: {
      proofRequired: true,
      requiredFields: ["activityDate", "distance", "duration"],
      calculatePaceAutomatically: true,
    },
    steps: {
      proofRequired: true,
      requiredFields: ["activityDate", "totalSteps", "recognisableAppOrDevice"],
    },
    waterBonus: {
      enabled: true, thresholdMillilitres: 750, points: 3, maximumAwardsPerDay: 1,
    },
    fruitBonus: {
      enabled: true, thresholdServings: 3, points: 3, maximumAwardsPerDay: 1,
    },
    leaderboardPublication: {
      timezone: "Africa/Johannesburg",
      automaticTime: "10:00",
      manualPublicationAllowed: true,
      correctedReplacementAllowed: true,
      automaticFallbackMode: "administrator-session",
    },
  };
}

function currentSeasonRulesetV2() {
  return {
    ...currentSeasonRuleset(),
    version: "season-houses-v2",
    evidencePolicy: currentEvidencePolicy(),
  };
}

function currentPowerPlayPolicy() {
  const categories = [
    "water", "fruit", "reading", "running", "upperBody",
    "lowerBody", "core", "cardio", "skill", "steps",
  ];
  const powerPlays = categories.map((category, index) => ({
    id: `base-${category}`,
    sourceType: "base",
    baseCategory: category,
    name: `Mythic ${category} ${index + 1}`,
    normalizedName: `mythic ${category} ${index + 1}`,
    description: "A confirmed theme-specific Power Play for this season.",
    multiplier: 2,
    categories: [category],
    enabled: true,
    themeNameConfirmed: true,
    sortOrder: index + 1,
  }));
  return {
    version: "power-play-v1",
    selectionMode: "random-without-replacement",
    durationMode: "season-relative-week",
    activityPointsOnly: true,
    evidenceBonusExcluded: true,
    goalAndProgressionBonusesExcluded: true,
    multiplierOptions: [2, 3],
    noRepeatWithinSeason: true,
    baseCategoryCount: 10,
    powerPlays,
    powerPlayDefinitions: Object.fromEntries(powerPlays.map((item) => [item.id, {
      id: item.id,
      name: item.name,
      multiplier: item.multiplier,
      categories: item.categories,
      enabled: item.enabled,
      themeNameConfirmed: item.themeNameConfirmed,
    }])),
  };
}

function currentSeasonRulesetV3() {
  return {
    ...currentSeasonRulesetV2(),
    version: "season-houses-v3",
    modules: {
      ...currentSeasonRulesetV2().modules,
      powerPlay: true,
    },
    powerPlayPolicy: currentPowerPlayPolicy(),
  };
}

function currentSeasonRulesetV4() {
  return {
    ...currentSeasonRulesetV3(),
    version: "season-houses-v4",
  };
}

function initialPowerPlayState() {
  return {
    usedPowerPlayIds: [],
    selectionCount: 0,
    lastWeekKey: "",
    lastPowerPlayId: "",
    lastSelectionAt: null,
    lastSelectionBy: "",
  };
}

function seasonDates({ active = false } = {}) {
  const now = Date.now();
  const start = active
    ? new Date(now - 2 * 24 * 60 * 60 * 1000)
    : new Date(now + 10 * 24 * 60 * 60 * 1000);
  const end = new Date(start.getTime() + 28 * 24 * 60 * 60 * 1000);
  return {
    startDate: Timestamp.fromDate(start),
    endDate: Timestamp.fromDate(end),
    pocketStartDate: Timestamp.fromDate(new Date(start.getTime() - 7 * 24 * 60 * 60 * 1000)),
    pocketEndDate: Timestamp.fromDate(new Date(start.getTime() - 24 * 60 * 60 * 1000)),
  };
}

function seasonData({
  status = "draft",
  actorId = "admin-one",
  inviteCode = "SEASONAA",
  participantCount = 0,
  chaosStatus = "not-started",
  active = false,
} = {}) {
  const dates = seasonDates({ active });
  return {
    name: "Legacy House Season",
    normalizedName: "legacy house season",
    description: "A themed season used to verify House competition and Pocket integrity.",
    theme: "South African Animals",
    type: "Community",
    mode: "season",
    status,
    ...dates,
    pocketEnabled: true,
    houseCount: 2,
    chaosStatus,
    chaosActivatedAt: chaosStatus === "activated" ? Timestamp.now() : null,
    chaosActivatedBy: chaosStatus === "activated" ? actorId : "",
    rulesVersion: "season-houses-v1",
    ruleset: currentSeasonRuleset(),
    administratorIds: [actorId],
    participantCount,
    participantLimit: 160,
    inviteCode,
    createdAt: Timestamp.now(),
    createdBy: actorId,
    updatedAt: Timestamp.now(),
    updatedBy: actorId,
    activatedAt: status === "active" ? Timestamp.now() : null,
    completedAt: status === "completed" ? Timestamp.now() : null,
    archivedAt: status === "archived" ? Timestamp.now() : null,
    lastAuditId: "seed-audit",
  };
}

function membershipData({
  leagueId = "season-one",
  userId = "player-one",
  status = "registered",
  house = null,
  inviteCode = "SEASONAA",
} = {}) {
  const houseSnapshot = house?.data ?? house;

  return {
    leagueId,
    userId,
    displayName: userId.replace("-", " "),
    avatarId: "legacy-trophy",
    role: "participant",
    status,
    inviteCode,
    currentHouseId: house?.id ?? "",
    currentHouseName: houseSnapshot?.name ?? "Unassigned",
    currentHouseEmblemId: houseSnapshot?.emblemId ?? "",
    currentHouseAccentId: houseSnapshot?.accentId ?? "",
    houseAssignedAt: house ? Timestamp.now() : null,
    houseAssignmentMethod: house ? "chaos" : "",
    lastRosterSwapId: "",
    lastRosterWeekKey: "",
    joinedAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

function houseData({
  leagueId = "season-one",
  id = "house-springbok",
  name = "House Springbok",
  emblemId = "springbok",
  accentId = "emerald",
  captainId = "",
  viceCaptainIds = [],
  lastElectionId = "",
} = {}) {
  return {
    id,
    data: {
      leagueId,
      name,
      description: `${name} moves with courage, consistency and collective purpose.`,
      motto: "Rise together",
      emblemId,
      accentId,
      status: "active",
      captainId,
      viceCaptainIds,
      lastElectionId,
      createdAt: Timestamp.now(),
      createdBy: "admin-one",
      updatedAt: Timestamp.now(),
      updatedBy: "admin-one",
      lastAuditId: "seed-audit",
    },
  };
}

function auditData({ action, entityId = "season-one", summary = "Season operation", actorId = "admin-one" }) {
  return {
    actorId,
    action,
    entityType: "league",
    entityId,
    summary,
    details: {},
    createdAt: serverTimestamp(),
  };
}

function notificationData({ userId, type, leagueId = "season-one", houseId = "" }) {
  return {
    userId,
    type,
    title: "Season update",
    message: "Your season information has changed. Open the related page for details.",
    leagueId,
    houseId,
    actionPath: `/houses?league=${leagueId}`,
    createdAt: serverTimestamp(),
    readAt: null,
    readBy: "",
  };
}

test("retired permanent Team collections cannot be used", async () => {
  const firestore = playerContext().firestore();
  await assertFails(setDoc(doc(firestore, "teams", "legacy-team"), { name: "Legacy Team" }));
  await assertFails(setDoc(doc(firestore, "playerTeams", "player-one"), { teamId: "legacy-team" }));
});

test("Legacy Coach preferences remain private to their owner", async () => {
  const ownerFirestore = playerContext("player-one").firestore();
  const preferencePath = doc(ownerFirestore, "users", "player-one", "coach", "preferences");

  await assertSucceeds(setDoc(preferencePath, {
    enabled: true,
    tone: "balanced",
    focus: "consistency",
    updatedAt: serverTimestamp(),
  }));
  await assertFails(getDoc(doc(
    playerContext("player-two").firestore(),
    "users",
    "player-one",
    "coach",
    "preferences",
  )));
  await assertFails(setDoc(doc(
    ownerFirestore,
    "coachPreferences",
    "player-one",
    "settings",
    "preferences",
  ), {
    enabled: true,
    tone: "balanced",
    focus: "consistency",
    updatedAt: serverTimestamp(),
  }));
});

test("season drafts require an authorised operator, invite and matching audit event", async () => {
  async function commitDraft(firestore, actorId, leagueId) {
    const inviteCode = leagueId === "season-admin" ? "ADMINSEA" : "PLAYERSE";
    const dates = seasonDates();
    const batch = writeBatch(firestore);
    const auditId = `${leagueId}-audit`;
    batch.set(doc(firestore, "auditEvents", auditId), {
      actorId,
      action: "league.created",
      entityType: "league",
      entityId: leagueId,
      summary: "Created a themed House season",
      details: {},
      createdAt: serverTimestamp(),
    });
    batch.set(doc(firestore, "leagues", leagueId), {
      name: "Legacy House Season",
      normalizedName: "legacy house season",
      description: "A themed season used to verify House competition and Pocket integrity.",
      theme: "South African Animals",
      type: "Community",
      mode: "season",
      status: "draft",
      ...dates,
      pocketEnabled: true,
      houseCount: 2,
      chaosStatus: "not-started",
      chaosActivatedAt: null,
      chaosActivatedBy: "",
      rulesVersion: "season-houses-v3",
      ruleset: currentSeasonRulesetV3(),
      powerPlayState: initialPowerPlayState(),
      administratorIds: [actorId],
      participantCount: 0,
      participantLimit: 160,
      publishedLeaderboardSnapshotId: "",
      publishedLeaderboardAt: null,
      publishedLeaderboardBy: "",
      publishedLeaderboardRevision: 0,
      inviteCode,
      createdAt: serverTimestamp(),
      createdBy: actorId,
      updatedAt: serverTimestamp(),
      updatedBy: actorId,
      activatedAt: null,
      completedAt: null,
      archivedAt: null,
      lastAuditId: auditId,
    });
    batch.set(doc(firestore, "leagueInvites", inviteCode), {
      leagueId,
      leagueName: "Legacy House Season",
      status: "closed",
      createdAt: serverTimestamp(),
      createdBy: actorId,
      updatedAt: serverTimestamp(),
      updatedBy: actorId,
    });
    return batch.commit();
  }

  await assertFails(commitDraft(playerContext().firestore(), "player-one", "season-player"));
  await assertSucceeds(commitDraft(adminContext().firestore(), "admin-one", "season-admin"));
  await assertSucceeds(
    commitDraft(
      leagueAdminContext().firestore(),
      "league-admin",
      "season-league-admin",
    ),
  );
});

test("global League Administrator role does not reveal another administrator's private draft", async () => {
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    await setDoc(
      doc(context.firestore(), "leagues", "league-admin-scope-private"),
      seasonData({
        actorId: "admin-one",
        inviteCode: "SCOPEDLA",
      }),
    );
  });

  await assertFails(
    getDoc(doc(
      leagueAdminContext().firestore(),
      "leagues",
      "league-admin-scope-private",
    )),
  );

  await assertSucceeds(
    getDoc(doc(
      adminContext().firestore(),
      "leagues",
      "league-admin-scope-private",
    )),
  );
});

test("global League Administrator role cannot self-assign into another league", async () => {
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    await setDoc(
      doc(context.firestore(), "leagues", "league-admin-scope-assignment"),
      seasonData({
        actorId: "admin-one",
        inviteCode: "SCOPEASN",
      }),
    );
  });

  await assertFails(
    updateDoc(
      doc(
        leagueAdminContext().firestore(),
        "leagues",
        "league-admin-scope-assignment",
      ),
      {
        administratorIds: ["admin-one", "league-admin"],
        updatedAt: serverTimestamp(),
        updatedBy: "league-admin",
        lastAuditId: "self-assignment-not-allowed",
      },
    ),
  );
});

test("v4 draft creation stays below Rules evaluation when the version itself freezes House Movement", async () => {
  async function commitV4Draft({ leagueId, dailyActivityCap = 20 }) {
    const firestore = adminContext().firestore();
    const inviteCode = leagueId === "season-v4-valid" ? "V4VALIDA" : "V4INVALD";
    const dates = seasonDates();
    const batch = writeBatch(firestore);
    const auditId = `${leagueId}-audit`;
    const ruleset = {
      ...currentSeasonRulesetV4(),
      dailyActivityCap,
    };

    batch.set(doc(firestore, "auditEvents", auditId), {
      actorId: "admin-one",
      action: "league.created",
      entityType: "league",
      entityId: leagueId,
      summary: "Created a v4 House movement season",
      details: {},
      createdAt: serverTimestamp(),
    });
    batch.set(doc(firestore, "leagues", leagueId), {
      name: "Legacy House Season V4",
      normalizedName: "legacy house season v4",
      description: "A maximum-shape draft proving the lean v4 version contract stays evaluable.",
      theme: "Warrior Houses",
      type: "Community",
      mode: "season",
      status: "draft",
      ...dates,
      pocketEnabled: true,
      houseCount: 8,
      chaosStatus: "not-started",
      chaosActivatedAt: null,
      chaosActivatedBy: "",
      rulesVersion: "season-houses-v4",
      ruleset,
      powerPlayState: initialPowerPlayState(),
      administratorIds: ["admin-one"],
      participantCount: 0,
      participantLimit: 160,
      publishedLeaderboardSnapshotId: "",
      publishedLeaderboardAt: null,
      publishedLeaderboardBy: "",
      publishedLeaderboardRevision: 0,
      inviteCode,
      createdAt: serverTimestamp(),
      createdBy: "admin-one",
      updatedAt: serverTimestamp(),
      updatedBy: "admin-one",
      activatedAt: null,
      completedAt: null,
      archivedAt: null,
      lastAuditId: auditId,
    });
    batch.set(doc(firestore, "leagueInvites", inviteCode), {
      leagueId,
      leagueName: "Legacy House Season V4",
      status: "closed",
      createdAt: serverTimestamp(),
      createdBy: "admin-one",
      updatedAt: serverTimestamp(),
      updatedBy: "admin-one",
    });
    return batch.commit();
  }

  await assertSucceeds(commitV4Draft({ leagueId: "season-v4-valid" }));
  await assertFails(commitV4Draft({ leagueId: "season-v4-invalid", dailyActivityCap: 21 }));
});

test("Houses can be created only inside an administrator-managed draft season", async () => {
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), "leagues", "season-one"), seasonData());
  });

  const firestore = adminContext().firestore();
  const batch = writeBatch(firestore);
  const auditId = "house-create-audit";
  const house = houseData();
  batch.set(doc(firestore, "auditEvents", auditId), auditData({ action: "house.created" }));
  batch.set(doc(firestore, "leagueHouses", house.id), {
    ...house.data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastAuditId: auditId,
  });
  await assertSucceeds(batch.commit());
  await assertFails(setDoc(doc(playerContext().firestore(), "leagueHouses", "house-fake"), house.data));
});

test("registration joins are atomic, unassigned and capped", async () => {
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    await setDoc(doc(firestore, "leagues", "season-one"), seasonData({ status: "registration" }));
    await setDoc(doc(firestore, "leagueInvites", "SEASONAA"), {
      leagueId: "season-one",
      leagueName: "Legacy House Season",
      status: "active",
      createdAt: Timestamp.now(),
      createdBy: "admin-one",
      updatedAt: Timestamp.now(),
      updatedBy: "admin-one",
    });
  });

  const firestore = playerContext().firestore();
  const batch = writeBatch(firestore);
  batch.set(doc(firestore, "leagueMemberships", "season-one_player-one"), {
    ...membershipData(),
    joinedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  batch.update(doc(firestore, "leagues", "season-one"), {
    participantCount: 1,
    participantLimit: 160,
    updatedAt: serverTimestamp(),
    updatedBy: "player-one",
  });
  await assertSucceeds(batch.commit());

  const forged = playerContext("player-two").firestore();
  const forgedBatch = writeBatch(forged);
  forgedBatch.set(doc(forged, "leagueMemberships", "season-one_player-two"), {
    ...membershipData({ userId: "player-two" }),
    currentHouseId: "house-invented",
    currentHouseName: "Invented House",
    joinedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  forgedBatch.update(doc(forged, "leagues", "season-one"), {
    participantCount: 2,
    participantLimit: 160,
    updatedAt: serverTimestamp(),
    updatedBy: "player-two",
  });
  await assertFails(forgedBatch.commit());
});

test("v4 registration persists empty post-move rest state and rejects pre-seeded locks", async () => {
  const leagueId = "season-v4-rest-state";
  const inviteCode = "V4RESTAA";

  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    await setDoc(doc(firestore, "leagues", leagueId), seasonDataV4({ status: "registration" }));
    await setDoc(doc(firestore, "leagueInvites", inviteCode), {
      leagueId,
      leagueName: "Legacy House Season V4",
      status: "active",
      createdAt: Timestamp.now(),
      createdBy: "admin-one",
      updatedAt: Timestamp.now(),
      updatedBy: "admin-one",
    });
  });

  const firestore = playerContext().firestore();
  const batch = writeBatch(firestore);
  batch.set(doc(firestore, "leagueMemberships", `${leagueId}_player-one`), {
    ...membershipData({ leagueId, inviteCode }),
    rosterLockThroughWeekKey: "",
    rosterEligibleWeekKey: "",
    joinedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  batch.update(doc(firestore, "leagues", leagueId), {
    participantCount: 1,
    participantLimit: 160,
    updatedAt: serverTimestamp(),
    updatedBy: "player-one",
  });
  await assertSucceeds(batch.commit());

  const forged = playerContext("player-two").firestore();
  const forgedBatch = writeBatch(forged);
  forgedBatch.set(doc(forged, "leagueMemberships", `${leagueId}_player-two`), {
    ...membershipData({ leagueId, userId: "player-two", inviteCode }),
    rosterLockThroughWeekKey: "2026-08-10",
    rosterEligibleWeekKey: "2026-08-17",
    joinedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  forgedBatch.update(doc(forged, "leagues", leagueId), {
    participantCount: 2,
    participantLimit: 160,
    updatedAt: serverTimestamp(),
    updatedBy: "player-two",
  });
  await assertFails(forgedBatch.commit());
});

test("C.H.A.O.S. assigns registered players and creates private notifications atomically", async () => {
  const firstHouse = houseData();
  const secondHouse = houseData({ id: "house-lion", name: "House Lion", emblemId: "lion", accentId: "sunstone" });
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    await setDoc(doc(firestore, "leagues", "season-one"), seasonData({ status: "registration", participantCount: 4 }));
    await setDoc(doc(firestore, "leagueHouses", firstHouse.id), firstHouse.data);
    await setDoc(doc(firestore, "leagueHouses", secondHouse.id), secondHouse.data);
    await setDoc(doc(firestore, "leagueMemberships", "season-one_player-one"), membershipData());
    await setDoc(doc(firestore, "leagueMemberships", "season-one_player-two"), membershipData({ userId: "player-two" }));
    await setDoc(doc(firestore, "leagueMemberships", "season-one_player-three"), membershipData({ userId: "player-three" }));
    await setDoc(doc(firestore, "leagueMemberships", "season-one_player-four"), membershipData({ userId: "player-four" }));
  });

  const firestore = adminContext().firestore();
  const batch = writeBatch(firestore);
  const auditId = "chaos-audit";
  batch.set(doc(firestore, "auditEvents", auditId), auditData({ action: "league.chaos-activated", summary: "Activated C.H.A.O.S." }));
  batch.update(doc(firestore, "leagues", "season-one"), {
    chaosStatus: "activated",
    chaosActivatedAt: serverTimestamp(),
    chaosActivatedBy: "admin-one",
    updatedAt: serverTimestamp(),
    updatedBy: "admin-one",
    lastAuditId: auditId,
  });
  [
    ["player-one", firstHouse],
    ["player-two", secondHouse],
    ["player-three", firstHouse],
    ["player-four", secondHouse],
  ].forEach(([userId, house], index) => {
    batch.update(doc(firestore, "leagueMemberships", `season-one_${userId}`), {
      currentHouseId: house.id,
      currentHouseName: house.data.name,
      currentHouseEmblemId: house.data.emblemId,
      currentHouseAccentId: house.data.accentId,
      houseAssignedAt: serverTimestamp(),
      houseAssignmentMethod: "chaos",
      updatedAt: serverTimestamp(),
    });
    batch.set(doc(firestore, "playerNotifications", `chaos-${index}`), notificationData({
      userId,
      type: "chaos-assignment",
      houseId: house.id,
    }));
  });
  await assertSucceeds(batch.commit());
  await assertSucceeds(getDoc(doc(playerContext().firestore(), "playerNotifications", "chaos-0")));
  await assertFails(getDoc(doc(playerContext("player-two").firestore(), "playerNotifications", "chaos-0")));
});

test("v4 C.H.A.O.S. supports eight Houses and sixteen players in the real atomic batch", async () => {
  const leagueId = "chaos-v4-scale";
  const houses = Array.from({ length: 8 }, (_, index) => houseData({
    leagueId,
    id: `house-scale-${index + 1}`,
    name: `House Scale ${index + 1}`,
    emblemId: `emblem-${index + 1}`,
    accentId: `accent-${index + 1}`,
  }));
  const playerIds = Array.from(
    { length: 16 },
    (_, index) => `scale-player-${String(index + 1).padStart(2, "0")}`,
  );
  const league = seasonDataV4({ status: "registration", participantCount: playerIds.length });
  league.houseCount = houses.length;

  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    await setDoc(doc(firestore, "leagues", leagueId), league);
    for (const house of houses) {
      await setDoc(doc(firestore, "leagueHouses", house.id), house.data);
    }
    for (const userId of playerIds) {
      await setDoc(doc(firestore, "users", userId), createProfile(userId));
      await setDoc(
        doc(firestore, "leagueMemberships", `${leagueId}_${userId}`),
        membershipData({ leagueId, userId }),
      );
    }
  });

  const firestore = adminContext().firestore();
  const batch = writeBatch(firestore);
  const auditId = "chaos-v4-scale-audit";
  batch.set(
    doc(firestore, "auditEvents", auditId),
    auditData({
      action: "league.chaos-activated",
      entityId: leagueId,
      summary: "Activated v4 C.H.A.O.S. across eight Houses",
    }),
  );
  batch.update(doc(firestore, "leagues", leagueId), {
    chaosStatus: "activated",
    chaosActivatedAt: serverTimestamp(),
    chaosActivatedBy: "admin-one",
    updatedAt: serverTimestamp(),
    updatedBy: "admin-one",
    lastAuditId: auditId,
  });

  playerIds.forEach((userId, index) => {
    const house = houses[index % houses.length];
    batch.update(doc(firestore, "leagueMemberships", `${leagueId}_${userId}`), {
      currentHouseId: house.id,
      currentHouseName: house.data.name,
      currentHouseEmblemId: house.data.emblemId,
      currentHouseAccentId: house.data.accentId,
      houseAssignedAt: serverTimestamp(),
      houseAssignmentMethod: "chaos",
      updatedAt: serverTimestamp(),
    });
    const sourceId = `${leagueId}_chaos`;
    batch.set(doc(firestore, "leagueHouseAssignmentHistory", `${sourceId}_${userId}`), {
      leagueId,
      userId,
      displayName: userId.replace("-", " "),
      weekKey: "",
      fromHouseId: "",
      fromHouseName: "Unassigned",
      toHouseId: house.id,
      toHouseName: house.data.name,
      method: "chaos",
      sourceId,
      createdAt: serverTimestamp(),
      createdBy: "admin-one",
      lastAuditId: auditId,
    });
    batch.set(
      doc(firestore, "playerNotifications", `chaos-v4-scale-${index + 1}`),
      notificationData({
        userId,
        type: "chaos-assignment",
        leagueId,
        houseId: house.id,
      }),
    );
  });

  await assertSucceeds(batch.commit());

  const firstHistoryId = `${leagueId}_chaos_${playerIds[0]}`;
  await assertSucceeds(getDoc(doc(playerContext(playerIds[0]).firestore(), "leagueHouseAssignmentHistory", firstHistoryId)));
  await assertFails(getDoc(doc(playerContext("player-three").firestore(), "leagueHouseAssignmentHistory", firstHistoryId)));
  await assertFails(getDocs(query(
    collection(playerContext("player-three").firestore(), "leagueHouseAssignmentHistory"),
    where("leagueId", "==", leagueId),
  )));
  await assertFails(updateDoc(doc(firestore, "leagueHouseAssignmentHistory", firstHistoryId), {
    toHouseName: "Rewritten House",
  }));
  await assertFails(deleteDoc(doc(firestore, "leagueHouseAssignmentHistory", firstHistoryId)));
});

test("leadership ballots can open only during an active season", async () => {
  const activeHouse = houseData({ leagueId: "season-active", id: "house-active" });
  const registrationHouse = houseData({ leagueId: "season-registration", id: "house-registration" });

  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    await setDoc(
      doc(firestore, "leagues", "season-active"),
      seasonData({
        id: "season-active",
        status: "active",
        participantCount: 2,
        chaosStatus: "activated",
        active: true,
      }),
    );
    await setDoc(
      doc(firestore, "leagues", "season-registration"),
      seasonData({
        id: "season-registration",
        status: "registration",
        participantCount: 2,
        chaosStatus: "activated",
      }),
    );
    await setDoc(doc(firestore, "leagueHouses", activeHouse.id), activeHouse.data);
    await setDoc(doc(firestore, "leagueHouses", registrationHouse.id), registrationHouse.data);
  });

  const firestore = adminContext().firestore();
  const openedAt = Timestamp.now();
  const closesAt = Timestamp.fromMillis(openedAt.toMillis() + 24 * 60 * 60 * 1000);

  function electionData(leagueId, house) {
    return {
      leagueId,
      houseId: house.id,
      houseName: house.data.name,
      weekKey: "2026-08-03",
      status: "open",
      openedAt,
      closesAt,
      finalizedAt: null,
      finalizedBy: "",
      captainId: "",
      viceCaptainId: "",
      resultStatus: "pending",
      voteCount: 0,
      lastAuditId: `${leagueId}-ballot-audit`,
    };
  }

  const activeBatch = writeBatch(firestore);
  activeBatch.set(
    doc(firestore, "auditEvents", "season-active-ballot-audit"),
    auditData({
      action: "house.election-opened",
      entityId: "season-active",
      summary: "Opened active House leadership voting",
    }),
  );
  activeBatch.set(
    doc(firestore, "leadershipElections", "season-active_house-active_2026-08-03"),
    electionData("season-active", activeHouse),
  );
  await assertSucceeds(activeBatch.commit());

  const registrationBatch = writeBatch(firestore);
  registrationBatch.set(
    doc(firestore, "auditEvents", "season-registration-ballot-audit"),
    auditData({
      action: "house.election-opened",
      entityId: "season-registration",
      summary: "Attempted early House leadership voting",
    }),
  );
  registrationBatch.set(
    doc(
      firestore,
      "leadershipElections",
      "season-registration_house-registration_2026-08-03",
    ),
    electionData("season-registration", registrationHouse),
  );
  await assertFails(registrationBatch.commit());
});

test("House members can cast one private leadership vote during the 24-hour window", async () => {
  const house = houseData({ captainId: "player-three", viceCaptainIds: ["player-four"] });
  const openedAt = Timestamp.now();
  const closesAt = Timestamp.fromMillis(openedAt.toMillis() + 24 * 60 * 60 * 1000);
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    await setDoc(doc(firestore, "leagues", "season-one"), seasonData({ status: "active", participantCount: 4, chaosStatus: "activated", active: true }));
    await setDoc(doc(firestore, "leagueHouses", house.id), house.data);
    for (const userId of ["player-one", "player-two", "player-three", "player-four"]) {
      await setDoc(doc(firestore, "leagueMemberships", `season-one_${userId}`), membershipData({ userId, status: "active", house }));
    }
    await setDoc(doc(firestore, "leadershipElections", "season-one_house-springbok_2026-08-03"), {
      leagueId: "season-one",
      houseId: house.id,
      houseName: house.data.name,
      weekKey: "2026-08-03",
      status: "open",
      openedAt,
      closesAt,
      finalizedAt: null,
      finalizedBy: "",
      captainId: "",
      viceCaptainId: "",
      resultStatus: "pending",
      voteCount: 0,
      lastAuditId: "seed-audit",
    });
  });

  const firestore = playerContext().firestore();
  const voteId = "season-one_house-springbok_2026-08-03_player-one";
  await assertSucceeds(setDoc(doc(firestore, "leadershipVotes", voteId), {
    electionId: "season-one_house-springbok_2026-08-03",
    leagueId: "season-one",
    houseId: house.id,
    weekKey: "2026-08-03",
    voterId: "player-one",
    candidateId: "player-two",
    createdAt: serverTimestamp(),
  }));
  await assertFails(updateDoc(doc(firestore, "leadershipVotes", voteId), { candidateId: "player-three" }));
  await assertFails(getDocs(query(collection(firestore, "leadershipVotes"), where("electionId", "==", "season-one_house-springbok_2026-08-03"))));
});

test("administrator finalisation connects the election result to House leadership", async () => {
  const electionId = "closed-election";
  const house = houseData();
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    await setDoc(doc(firestore, "leagues", "season-one"), seasonData({ status: "active", participantCount: 2, chaosStatus: "activated", active: true }));
    await setDoc(doc(firestore, "leagueHouses", house.id), house.data);
    await setDoc(doc(firestore, "leagueMemberships", "season-one_player-one"), membershipData({ status: "active", house }));
    await setDoc(doc(firestore, "leagueMemberships", "season-one_player-two"), membershipData({ userId: "player-two", status: "active", house }));
    await setDoc(doc(firestore, "leadershipElections", electionId), {
      leagueId: "season-one",
      houseId: house.id,
      houseName: house.data.name,
      weekKey: "2026-07-27",
      status: "open",
      openedAt: Timestamp.fromMillis(Date.now() - 26 * 60 * 60 * 1000),
      closesAt: Timestamp.fromMillis(Date.now() - 2 * 60 * 60 * 1000),
      finalizedAt: null,
      finalizedBy: "",
      captainId: "",
      viceCaptainId: "",
      resultStatus: "pending",
      voteCount: 0,
      lastAuditId: "seed-audit",
    });
  });

  const firestore = adminContext().firestore();
  const batch = writeBatch(firestore);
  const auditId = "leadership-audit";
  batch.set(doc(firestore, "auditEvents", auditId), auditData({ action: "house.election-finalized" }));
  batch.update(doc(firestore, "leadershipElections", electionId), {
    status: "finalized",
    finalizedAt: serverTimestamp(),
    finalizedBy: "admin-one",
    captainId: "player-one",
    viceCaptainId: "player-two",
    resultStatus: "no-votes",
    voteCount: 0,
    lastAuditId: auditId,
  });
  batch.update(doc(firestore, "leagueHouses", house.id), {
    captainId: "player-one",
    viceCaptainIds: ["player-two"],
    lastElectionId: electionId,
    updatedAt: serverTimestamp(),
    updatedBy: "admin-one",
    lastAuditId: auditId,
  });
  await assertSucceeds(batch.commit());
});

test("a captain may appoint one additional current House vice-captain", async () => {
  const house = houseData({ captainId: "player-one", viceCaptainIds: ["player-two"], lastElectionId: "election-one" });
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    await setDoc(doc(firestore, "leagues", "season-one"), seasonData({ status: "active", participantCount: 3, chaosStatus: "activated", active: true }));
    await setDoc(doc(firestore, "leagueHouses", house.id), house.data);
    for (const userId of ["player-one", "player-two", "player-three"]) {
      await setDoc(doc(firestore, "leagueMemberships", `season-one_${userId}`), membershipData({ userId, status: "active", house }));
    }
  });

  await assertSucceeds(updateDoc(doc(playerContext().firestore(), "leagueHouses", house.id), {
    viceCaptainIds: ["player-two", "player-three"],
    updatedAt: serverTimestamp(),
    updatedBy: "player-one",
  }));
  await assertFails(updateDoc(doc(playerContext("player-two").firestore(), "leagueHouses", house.id), {
    viceCaptainIds: ["player-two", "player-three"],
    updatedAt: serverTimestamp(),
    updatedBy: "player-two",
  }));
  await assertFails(updateDoc(doc(playerContext().firestore(), "leagueHouses", house.id), {
    viceCaptainIds: ["player-two", "player-four"],
    updatedAt: serverTimestamp(),
    updatedBy: "player-one",
  }));
});

test("weekly roster swaps move future membership but cannot rewrite contribution history", async () => {
  const firstHouse = houseData({ captainId: "admin-one", viceCaptainIds: [] });
  const secondHouse = houseData({ id: "house-lion", name: "House Lion", emblemId: "lion", accentId: "sunstone", captainId: "player-three", viceCaptainIds: ["player-four"] });
  const weekKey = "2026-08-03";
  const swapId = `season-one_house-lion_house-springbok_${weekKey}`;
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    await setDoc(doc(firestore, "leagues", "season-one"), seasonData({ status: "active", participantCount: 4, chaosStatus: "activated", active: true }));
    await setDoc(doc(firestore, "leagueHouses", firstHouse.id), firstHouse.data);
    await setDoc(doc(firestore, "leagueHouses", secondHouse.id), secondHouse.data);
    await setDoc(doc(firestore, "leagueMemberships", "season-one_player-one"), membershipData({ status: "active", house: firstHouse }));
    await setDoc(doc(firestore, "leagueMemberships", "season-one_player-two"), membershipData({ userId: "player-two", status: "active", house: secondHouse }));
    await setDoc(doc(firestore, "leagueMemberships", "season-one_player-three"), membershipData({ userId: "player-three", status: "active", house: secondHouse }));
    await setDoc(doc(firestore, "leagueMemberships", "season-one_player-four"), membershipData({ userId: "player-four", status: "active", house: secondHouse }));
    await setDoc(doc(firestore, "leagueContributions", "historic-contribution"), {
      leagueId: "season-one",
      entryId: "historic-entry",
      userId: "player-one",
      displayName: "player one",
      avatarId: "legacy-trophy",
      houseId: firstHouse.id,
      houseName: firstHouse.data.name,
      houseEmblemId: firstHouse.data.emblemId,
      teamId: firstHouse.id,
      teamName: firstHouse.data.name,
      category: "water",
      challengeDate: Timestamp.now(),
      activityPoints: 4,
      rulesVersion: "season-houses-v1",
      source: "activity",
      sourceRedemptionId: "",
      createdAt: Timestamp.now(),
    });
  });

  const firestore = adminContext().firestore();
  const batch = writeBatch(firestore);
  const auditId = "swap-audit";
  batch.set(doc(firestore, "auditEvents", auditId), auditData({ action: "house.roster-swapped" }));
  batch.set(doc(firestore, "leagueRosterLocks", `season-one_${firstHouse.id}_${weekKey}`), {
    leagueId: "season-one", houseId: firstHouse.id, weekKey, swapId, createdAt: serverTimestamp(), createdBy: "admin-one",
  });
  batch.set(doc(firestore, "leagueRosterLocks", `season-one_${secondHouse.id}_${weekKey}`), {
    leagueId: "season-one", houseId: secondHouse.id, weekKey, swapId, createdAt: serverTimestamp(), createdBy: "admin-one",
  });
  batch.set(doc(firestore, "leagueRosterSwaps", swapId), {
    leagueId: "season-one", weekKey,
    firstHouseId: firstHouse.id, firstHouseName: firstHouse.data.name,
    secondHouseId: secondHouse.id, secondHouseName: secondHouse.data.name,
    firstPlayerId: "player-one", secondPlayerId: "player-two",
    actorId: "admin-one", createdAt: serverTimestamp(), lastAuditId: auditId,
  });
  batch.update(doc(firestore, "leagueMemberships", "season-one_player-one"), {
    currentHouseId: secondHouse.id, currentHouseName: secondHouse.data.name,
    currentHouseEmblemId: secondHouse.data.emblemId, currentHouseAccentId: secondHouse.data.accentId,
    houseAssignedAt: serverTimestamp(), houseAssignmentMethod: "weekly-swap",
    lastRosterSwapId: swapId, lastRosterWeekKey: weekKey, updatedAt: serverTimestamp(),
  });
  batch.update(doc(firestore, "leagueMemberships", "season-one_player-two"), {
    currentHouseId: firstHouse.id, currentHouseName: firstHouse.data.name,
    currentHouseEmblemId: firstHouse.data.emblemId, currentHouseAccentId: firstHouse.data.accentId,
    houseAssignedAt: serverTimestamp(), houseAssignmentMethod: "weekly-swap",
    lastRosterSwapId: swapId, lastRosterWeekKey: weekKey, updatedAt: serverTimestamp(),
  });
  batch.set(doc(firestore, "playerNotifications", "swap-one"), notificationData({ userId: "player-one", type: "roster-swap", houseId: secondHouse.id }));
  batch.set(doc(firestore, "playerNotifications", "swap-two"), notificationData({ userId: "player-two", type: "roster-swap", houseId: firstHouse.id }));
  await assertSucceeds(batch.commit());
  await assertFails(updateDoc(doc(firestore, "leagueContributions", "historic-contribution"), { houseId: secondHouse.id }));
});


async function seedV4RestLockSwapSeason(leagueId, {
  firstLockThroughWeekKey = "",
  firstEligibleWeekKey = "",
  secondLockThroughWeekKey = "",
  secondEligibleWeekKey = "",
  firstLastRosterWeekKey = "",
  secondLastRosterWeekKey = "",
} = {}) {
  const firstHouse = houseData({
    leagueId,
    id: `${leagueId}-house-a`,
    name: "House A",
    captainId: "player-three",
  });
  const secondHouse = houseData({
    leagueId,
    id: `${leagueId}-house-b`,
    name: "House B",
    emblemId: "eagle",
    accentId: "sapphire",
    captainId: "player-four",
  });

  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    await setDoc(doc(firestore, "leagues", leagueId), seasonDataV4({
      status: "active",
      participantCount: 4,
      chaosStatus: "activated",
      active: true,
    }));
    await setDoc(doc(firestore, "leagueHouses", firstHouse.id), firstHouse.data);
    await setDoc(doc(firestore, "leagueHouses", secondHouse.id), secondHouse.data);
    await setDoc(doc(firestore, "leagueMemberships", `${leagueId}_player-one`), {
      ...membershipData({ leagueId, status: "active", house: firstHouse }),
      rosterLockThroughWeekKey: firstLockThroughWeekKey,
      rosterEligibleWeekKey: firstEligibleWeekKey,
      lastRosterWeekKey: firstLastRosterWeekKey,
    });
    await setDoc(doc(firestore, "leagueMemberships", `${leagueId}_player-two`), {
      ...membershipData({ leagueId, userId: "player-two", status: "active", house: secondHouse }),
      rosterLockThroughWeekKey: secondLockThroughWeekKey,
      rosterEligibleWeekKey: secondEligibleWeekKey,
      lastRosterWeekKey: secondLastRosterWeekKey,
    });
    await setDoc(doc(firestore, "leagueMemberships", `${leagueId}_player-three`), {
      ...membershipData({ leagueId, userId: "player-three", status: "active", house: firstHouse }),
      rosterLockThroughWeekKey: "",
      rosterEligibleWeekKey: "",
    });
    await setDoc(doc(firestore, "leagueMemberships", `${leagueId}_player-four`), {
      ...membershipData({ leagueId, userId: "player-four", status: "active", house: secondHouse }),
      rosterLockThroughWeekKey: "",
      rosterEligibleWeekKey: "",
    });
  });

  return { firstHouse, secondHouse };
}

function v4RestLockSwapBatch({
  firestore,
  leagueId,
  firstHouse,
  secondHouse,
  weekKey = "2026-08-03",
  lockThroughWeekKey = "2026-08-10",
  eligibleWeekKey = "2026-08-17",
  firstMembershipEligibleWeekKey = null,
  includeHistory = true,
  actorId = "admin-one",
  overrideApplied = false,
  overrideReason = "",
  overriddenPlayerIds = [],
}) {
  const firstEligibleWeekKey = firstMembershipEligibleWeekKey ?? eligibleWeekKey;
  const swapId = `${leagueId}_${firstHouse.id}_${secondHouse.id}_${weekKey}`;
  const auditId = `${swapId}-audit`;
  const batch = writeBatch(firestore);

  batch.set(doc(firestore, "auditEvents", auditId), auditData({
    action: overrideApplied ? "house.roster-rest-overridden" : "house.roster-swapped",
    entityId: leagueId,
    summary: overrideApplied ? "Corrected a v4 House movement rest restriction" : "Completed a v4 House roster swap with a post-move rest window",
    actorId,
  }));
  for (const house of [firstHouse, secondHouse]) {
    batch.set(doc(firestore, "leagueRosterLocks", `${leagueId}_${house.id}_${weekKey}`), {
      leagueId,
      houseId: house.id,
      weekKey,
      swapId,
      createdAt: serverTimestamp(),
      createdBy: actorId,
    });
  }
  batch.set(doc(firestore, "leagueRosterSwaps", swapId), {
    leagueId,
    weekKey,
    firstHouseId: firstHouse.id,
    firstHouseName: firstHouse.data.name,
    secondHouseId: secondHouse.id,
    secondHouseName: secondHouse.data.name,
    firstPlayerId: "player-one",
    secondPlayerId: "player-two",
    actorId,
    createdAt: serverTimestamp(),
    lastAuditId: auditId,
    rulesVersion: "season-houses-v4",
    lockThroughWeekKey,
    eligibleWeekKey,
    overrideApplied,
    overrideReason,
    overriddenPlayerIds,
  });
  batch.update(doc(firestore, "leagueMemberships", `${leagueId}_player-one`), {
    currentHouseId: secondHouse.id,
    currentHouseName: secondHouse.data.name,
    currentHouseEmblemId: secondHouse.data.emblemId,
    currentHouseAccentId: secondHouse.data.accentId,
    houseAssignedAt: serverTimestamp(),
    houseAssignmentMethod: "weekly-swap",
    lastRosterSwapId: swapId,
    lastRosterWeekKey: weekKey,
    rosterLockThroughWeekKey: lockThroughWeekKey,
    rosterEligibleWeekKey: firstEligibleWeekKey,
    updatedAt: serverTimestamp(),
  });
  batch.update(doc(firestore, "leagueMemberships", `${leagueId}_player-two`), {
    currentHouseId: firstHouse.id,
    currentHouseName: firstHouse.data.name,
    currentHouseEmblemId: firstHouse.data.emblemId,
    currentHouseAccentId: firstHouse.data.accentId,
    houseAssignedAt: serverTimestamp(),
    houseAssignmentMethod: "weekly-swap",
    lastRosterSwapId: swapId,
    lastRosterWeekKey: weekKey,
    rosterLockThroughWeekKey: lockThroughWeekKey,
    rosterEligibleWeekKey: eligibleWeekKey,
    updatedAt: serverTimestamp(),
  });
  if (includeHistory) {
    batch.set(doc(firestore, "leagueHouseAssignmentHistory", `${swapId}_player-one`), {
      leagueId,
      userId: "player-one",
      displayName: "player one",
      weekKey,
      fromHouseId: firstHouse.id,
      fromHouseName: firstHouse.data.name,
      toHouseId: secondHouse.id,
      toHouseName: secondHouse.data.name,
      method: "weekly-swap",
      sourceId: swapId,
      overrideApplied: overriddenPlayerIds.includes("player-one"),
      overrideReason: overriddenPlayerIds.includes("player-one") ? overrideReason : "",
      createdAt: serverTimestamp(),
      createdBy: actorId,
      lastAuditId: auditId,
    });
    batch.set(doc(firestore, "leagueHouseAssignmentHistory", `${swapId}_player-two`), {
      leagueId,
      userId: "player-two",
      displayName: "player two",
      weekKey,
      fromHouseId: secondHouse.id,
      fromHouseName: secondHouse.data.name,
      toHouseId: firstHouse.id,
      toHouseName: firstHouse.data.name,
      method: "weekly-swap",
      sourceId: swapId,
      overrideApplied: overriddenPlayerIds.includes("player-two"),
      overrideReason: overriddenPlayerIds.includes("player-two") ? overrideReason : "",
      createdAt: serverTimestamp(),
      createdBy: actorId,
      lastAuditId: auditId,
    });
  }
  batch.set(doc(firestore, "playerNotifications", `${leagueId}-swap-one`), notificationData({
    userId: "player-one",
    type: "roster-swap",
    leagueId,
    houseId: secondHouse.id,
  }));
  batch.set(doc(firestore, "playerNotifications", `${leagueId}-swap-two`), notificationData({
    userId: "player-two",
    type: "roster-swap",
    leagueId,
    houseId: firstHouse.id,
  }));

  return batch;
}

test("v4 roster swaps persist the one-week rest window and reject membership values that disagree with the swap", async () => {
  const goodLeagueId = "season-v4-rest-good";
  const good = await seedV4RestLockSwapSeason(goodLeagueId);
  const firestore = adminContext().firestore();
  await assertSucceeds(v4RestLockSwapBatch({
    firestore,
    leagueId: goodLeagueId,
    ...good,
  }).commit());

  const firstAfter = await getDoc(doc(firestore, "leagueMemberships", `${goodLeagueId}_player-one`));
  assert.equal(firstAfter.data().rosterLockThroughWeekKey, "2026-08-10");
  assert.equal(firstAfter.data().rosterEligibleWeekKey, "2026-08-17");

  const badLeagueId = "season-v4-rest-bad";
  const bad = await seedV4RestLockSwapSeason(badLeagueId);
  await assertFails(v4RestLockSwapBatch({
    firestore,
    leagueId: badLeagueId,
    ...bad,
    firstMembershipEligibleWeekKey: "2026-08-24",
  }).commit());
});

test("v4 roster swaps require readable immutable assignment history for both players", async () => {
  const leagueId = "season-v4-history";
  const seeded = await seedV4RestLockSwapSeason(leagueId);
  const firestore = adminContext().firestore();
  const weekKey = "2026-08-03";
  const swapId = `${leagueId}_${seeded.firstHouse.id}_${seeded.secondHouse.id}_${weekKey}`;
  const firstHistoryId = `${swapId}_player-one`;
  const secondHistoryId = `${swapId}_player-two`;

  await assertSucceeds(v4RestLockSwapBatch({
    firestore,
    leagueId,
    ...seeded,
    weekKey,
  }).commit());

  const firstHistory = await getDoc(doc(playerContext("player-one").firestore(), "leagueHouseAssignmentHistory", firstHistoryId));
  const secondHistory = await getDoc(doc(playerContext("player-two").firestore(), "leagueHouseAssignmentHistory", secondHistoryId));
  const memberHistoryQuery = await assertSucceeds(getDocs(query(
    collection(playerContext("player-one").firestore(), "leagueHouseAssignmentHistory"),
    where("leagueId", "==", leagueId),
  )));
  assert.equal(memberHistoryQuery.size, 2);
  assert.equal(firstHistory.data().fromHouseId, seeded.firstHouse.id);
  assert.equal(firstHistory.data().toHouseId, seeded.secondHouse.id);
  assert.equal(secondHistory.data().fromHouseId, seeded.secondHouse.id);
  assert.equal(secondHistory.data().toHouseId, seeded.firstHouse.id);
  await assertFails(updateDoc(doc(firestore, "leagueHouseAssignmentHistory", firstHistoryId), {
    toHouseName: "Rewritten House",
  }));
  await assertFails(deleteDoc(doc(firestore, "leagueHouseAssignmentHistory", secondHistoryId)));

  const missingLeagueId = "season-v4-history-required";
  const missingSeed = await seedV4RestLockSwapSeason(missingLeagueId);
  await assertFails(v4RestLockSwapBatch({
    firestore,
    leagueId: missingLeagueId,
    ...missingSeed,
    includeHistory: false,
  }).commit());
});

test("v4 roster swaps enforce the persisted rest week and reopen eligibility afterward", async () => {
  const firestore = adminContext().firestore();

  const firstBlockedLeagueId = "season-v4-rest-first-blocked";
  const firstBlocked = await seedV4RestLockSwapSeason(firstBlockedLeagueId, {
    firstLockThroughWeekKey: "2026-08-10",
    firstEligibleWeekKey: "2026-08-17",
  });
  await assertFails(v4RestLockSwapBatch({
    firestore,
    leagueId: firstBlockedLeagueId,
    ...firstBlocked,
    weekKey: "2026-08-10",
    lockThroughWeekKey: "2026-08-17",
    eligibleWeekKey: "2026-08-24",
  }).commit());

  const secondBlockedLeagueId = "season-v4-rest-second-blocked";
  const secondBlocked = await seedV4RestLockSwapSeason(secondBlockedLeagueId, {
    secondLockThroughWeekKey: "2026-08-10",
    secondEligibleWeekKey: "2026-08-17",
  });
  await assertFails(v4RestLockSwapBatch({
    firestore,
    leagueId: secondBlockedLeagueId,
    ...secondBlocked,
    weekKey: "2026-08-10",
    lockThroughWeekKey: "2026-08-17",
    eligibleWeekKey: "2026-08-24",
  }).commit());

  const eligibleLeagueId = "season-v4-rest-reopened";
  const eligible = await seedV4RestLockSwapSeason(eligibleLeagueId, {
    firstLockThroughWeekKey: "2026-08-10",
    firstEligibleWeekKey: "2026-08-17",
    secondLockThroughWeekKey: "2026-08-10",
    secondEligibleWeekKey: "2026-08-17",
  });
  await assertSucceeds(v4RestLockSwapBatch({
    firestore,
    leagueId: eligibleLeagueId,
    ...eligible,
    weekKey: "2026-08-17",
    lockThroughWeekKey: "2026-08-24",
    eligibleWeekKey: "2026-08-31",
  }).commit());

  const firstAfter = await getDoc(doc(firestore, "leagueMemberships", `${eligibleLeagueId}_player-one`));
  const secondAfter = await getDoc(doc(firestore, "leagueMemberships", `${eligibleLeagueId}_player-two`));
  assert.equal(firstAfter.data().rosterLockThroughWeekKey, "2026-08-24");
  assert.equal(firstAfter.data().rosterEligibleWeekKey, "2026-08-31");
  assert.equal(secondAfter.data().rosterLockThroughWeekKey, "2026-08-24");
  assert.equal(secondAfter.data().rosterEligibleWeekKey, "2026-08-31");
});

test("only a Platform Administrator can override an active post-move rest with a factual reason", async () => {
  const firestore = adminContext().firestore();
  const reason = "Correcting a documented administrator assignment error.";

  const allowedLeagueId = "season-v4-rest-override";
  const allowed = await seedV4RestLockSwapSeason(allowedLeagueId, {
    firstLockThroughWeekKey: "2026-08-10",
    firstEligibleWeekKey: "2026-08-17",
  });
  await assertSucceeds(v4RestLockSwapBatch({
    firestore,
    leagueId: allowedLeagueId,
    ...allowed,
    weekKey: "2026-08-10",
    lockThroughWeekKey: "2026-08-17",
    eligibleWeekKey: "2026-08-24",
    overrideApplied: true,
    overrideReason: reason,
    overriddenPlayerIds: ["player-one"],
  }).commit());

  const swapId = `${allowedLeagueId}_${allowed.firstHouse.id}_${allowed.secondHouse.id}_2026-08-10`;
  const swap = await getDoc(doc(firestore, "leagueRosterSwaps", swapId));
  const firstHistory = await getDoc(doc(firestore, "leagueHouseAssignmentHistory", `${swapId}_player-one`));
  const secondHistory = await getDoc(doc(firestore, "leagueHouseAssignmentHistory", `${swapId}_player-two`));
  assert.equal(swap.data().overrideApplied, true);
  assert.deepEqual(swap.data().overriddenPlayerIds, ["player-one"]);
  assert.equal(firstHistory.data().overrideApplied, true);
  assert.equal(firstHistory.data().overrideReason, reason);
  assert.equal(secondHistory.data().overrideApplied, false);
  assert.equal(secondHistory.data().overrideReason, "");

  const shortReasonLeagueId = "season-v4-rest-override-short";
  const shortReason = await seedV4RestLockSwapSeason(shortReasonLeagueId, {
    firstLockThroughWeekKey: "2026-08-10",
    firstEligibleWeekKey: "2026-08-17",
  });
  await assertFails(v4RestLockSwapBatch({
    firestore,
    leagueId: shortReasonLeagueId,
    ...shortReason,
    weekKey: "2026-08-10",
    lockThroughWeekKey: "2026-08-17",
    eligibleWeekKey: "2026-08-24",
    overrideApplied: true,
    overrideReason: "Too short",
    overriddenPlayerIds: ["player-one"],
  }).commit());

  const houseLeaderLeagueId = "season-v4-rest-override-house-leader";
  const houseLeaderSeed = await seedV4RestLockSwapSeason(houseLeaderLeagueId, {
    firstLockThroughWeekKey: "2026-08-10",
    firstEligibleWeekKey: "2026-08-17",
  });
  await assertFails(v4RestLockSwapBatch({
    firestore: playerContext("player-three").firestore(),
    leagueId: houseLeaderLeagueId,
    ...houseLeaderSeed,
    weekKey: "2026-08-10",
    lockThroughWeekKey: "2026-08-17",
    eligibleWeekKey: "2026-08-24",
    actorId: "player-three",
    overrideApplied: true,
    overrideReason: reason,
    overriddenPlayerIds: ["player-one"],
  }).commit());

  const seasonAdminLeagueId = "season-v4-rest-override-season-admin";
  const seasonAdminSeed = await seedV4RestLockSwapSeason(seasonAdminLeagueId, {
    firstLockThroughWeekKey: "2026-08-10",
    firstEligibleWeekKey: "2026-08-17",
  });
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const raw = context.firestore();
    const leagueRef = doc(raw, "leagues", seasonAdminLeagueId);
    const current = (await getDoc(leagueRef)).data();
    await setDoc(leagueRef, { ...current, administratorIds: ["player-three"] });
  });
  await assertFails(v4RestLockSwapBatch({
    firestore: playerContext("player-three").firestore(),
    leagueId: seasonAdminLeagueId,
    ...seasonAdminSeed,
    weekKey: "2026-08-10",
    lockThroughWeekKey: "2026-08-17",
    eligibleWeekKey: "2026-08-24",
    actorId: "player-three",
    overrideApplied: true,
    overrideReason: reason,
    overriddenPlayerIds: ["player-one"],
  }).commit());
});

test("Platform Administrator rest override cannot bypass same-week movement, House locks or leadership protection", async () => {
  const firestore = adminContext().firestore();
  const reason = "Correcting a documented administrator assignment error.";

  const sameWeekLeagueId = "season-v4-override-same-week";
  const sameWeek = await seedV4RestLockSwapSeason(sameWeekLeagueId, {
    firstLockThroughWeekKey: "2026-08-17",
    firstEligibleWeekKey: "2026-08-24",
    firstLastRosterWeekKey: "2026-08-10",
  });
  await assertFails(v4RestLockSwapBatch({
    firestore,
    leagueId: sameWeekLeagueId,
    ...sameWeek,
    weekKey: "2026-08-10",
    lockThroughWeekKey: "2026-08-17",
    eligibleWeekKey: "2026-08-24",
    overrideApplied: true,
    overrideReason: reason,
    overriddenPlayerIds: ["player-one"],
  }).commit());

  const lockedLeagueId = "season-v4-override-house-locked";
  const locked = await seedV4RestLockSwapSeason(lockedLeagueId, {
    firstLockThroughWeekKey: "2026-08-10",
    firstEligibleWeekKey: "2026-08-17",
  });
  const weekKey = "2026-08-10";
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), "leagueRosterLocks", `${lockedLeagueId}_${locked.firstHouse.id}_${weekKey}`), {
      leagueId: lockedLeagueId,
      houseId: locked.firstHouse.id,
      weekKey,
      swapId: "previous-swap",
      createdAt: Timestamp.now(),
      createdBy: "admin-one",
    });
  });
  await assertFails(v4RestLockSwapBatch({
    firestore,
    leagueId: lockedLeagueId,
    ...locked,
    weekKey,
    lockThroughWeekKey: "2026-08-17",
    eligibleWeekKey: "2026-08-24",
    overrideApplied: true,
    overrideReason: reason,
    overriddenPlayerIds: ["player-one"],
  }).commit());

  const leaderLeagueId = "season-v4-override-leader";
  const leader = await seedV4RestLockSwapSeason(leaderLeagueId, {
    firstLockThroughWeekKey: "2026-08-10",
    firstEligibleWeekKey: "2026-08-17",
  });
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const raw = context.firestore();
    const houseRef = doc(raw, "leagueHouses", leader.firstHouse.id);
    const current = (await getDoc(houseRef)).data();
    await setDoc(houseRef, { ...current, captainId: "player-one" });
  });
  await assertFails(v4RestLockSwapBatch({
    firestore,
    leagueId: leaderLeagueId,
    ...leader,
    weekKey: "2026-08-10",
    lockThroughWeekKey: "2026-08-17",
    eligibleWeekKey: "2026-08-24",
    overrideApplied: true,
    overrideReason: reason,
    overriddenPlayerIds: ["player-one"],
  }).commit());
});

test("season composition responses stay private to the owner and authorised administrators", async () => {
  const leagueId = "season-v4-composition-private";
  await seedV4RestLockSwapSeason(leagueId);
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const raw = context.firestore();
    const leagueRef = doc(raw, "leagues", leagueId);
    const current = (await getDoc(leagueRef)).data();
    await setDoc(leagueRef, { ...current, administratorIds: ["player-three"] });
  });

  const profileId = `${leagueId}_player-one`;
  const owner = playerContext("player-one").firestore();
  await assertSucceeds(setDoc(doc(owner, "leagueCompositionProfiles", profileId), {
    leagueId,
    userId: "player-one",
    value: "woman",
    profileVersion: "season-composition-v1",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }));

  await assertSucceeds(getDoc(doc(owner, "leagueCompositionProfiles", profileId)));
  await assertFails(getDoc(doc(playerContext("player-two").firestore(), "leagueCompositionProfiles", profileId)));
  await assertFails(getDoc(doc(playerContext("player-four").firestore(), "leagueCompositionProfiles", profileId)));
  await assertSucceeds(getDoc(doc(adminContext().firestore(), "leagueCompositionProfiles", profileId)));
  await assertSucceeds(getDoc(doc(playerContext("player-three").firestore(), "leagueCompositionProfiles", profileId)));
  const scopedAdminQuery = await assertSucceeds(getDocs(query(
    collection(playerContext("player-three").firestore(), "leagueCompositionProfiles"),
    where("leagueId", "==", leagueId),
  )));
  assert.equal(scopedAdminQuery.size, 1);
  await assertFails(getDocs(query(
    collection(playerContext("player-two").firestore(), "leagueCompositionProfiles"),
    where("leagueId", "==", leagueId),
  )));

  await assertSucceeds(updateDoc(doc(owner, "leagueCompositionProfiles", profileId), {
    value: "prefer-not-to-say",
    updatedAt: serverTimestamp(),
  }));
  await assertFails(updateDoc(doc(adminContext().firestore(), "leagueCompositionProfiles", profileId), {
    value: "man",
    updatedAt: serverTimestamp(),
  }));
  await assertSucceeds(deleteDoc(doc(owner, "leagueCompositionProfiles", profileId)));
});

test("composition responses cannot be forged outside the v4 season membership contract", async () => {
  const leagueId = "season-v4-composition-guard";
  await seedV4RestLockSwapSeason(leagueId);
  const owner = playerContext("player-one").firestore();

  await assertFails(setDoc(doc(owner, "leagueCompositionProfiles", `${leagueId}_player-two`), {
    leagueId,
    userId: "player-two",
    value: "man",
    profileVersion: "season-composition-v1",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }));
  await assertFails(setDoc(doc(owner, "leagueCompositionProfiles", `${leagueId}_player-one`), {
    leagueId,
    userId: "player-one",
    value: "unsupported",
    profileVersion: "season-composition-v1",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }));

  const unregistered = playerContext("player-four").firestore();
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    await deleteDoc(doc(context.firestore(), "leagueMemberships", `${leagueId}_player-four`));
  });
  await assertFails(setDoc(doc(unregistered, "leagueCompositionProfiles", `${leagueId}_player-four`), {
    leagueId,
    userId: "player-four",
    value: "non-binary-or-another",
    profileVersion: "season-composition-v1",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }));

  const v3LeagueId = "season-v3-composition-blocked";
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const raw = context.firestore();
    await setDoc(doc(raw, "leagues", v3LeagueId), seasonDataV3({ status: "active", participantCount: 1, chaosStatus: "activated", active: true }));
    await setDoc(doc(raw, "leagueMemberships", `${v3LeagueId}_player-one`), membershipData({ leagueId: v3LeagueId, status: "active" }));
  });
  await assertFails(setDoc(doc(owner, "leagueCompositionProfiles", `${v3LeagueId}_player-one`), {
    leagueId: v3LeagueId,
    userId: "player-one",
    value: "woman",
    profileVersion: "season-composition-v1",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }));
});


test("weekly House balance publishes suppressed member summaries while exact counts stay administrator-only", async () => {
  const leagueId = "season-v4-balance-private";
  const { firstHouse, secondHouse } = await seedV4RestLockSwapSeason(leagueId);
  const firestore = adminContext().firestore();
  const resultId = `${leagueId}_2026-08-03`;
  const auditId = `${resultId}-audit`;
  const batch = writeBatch(firestore);

  batch.set(doc(firestore, "auditEvents", auditId), auditData({
    action: "house.balance-calculated",
    entityId: leagueId,
    summary: "Calculated privacy-safe weekly House balance",
  }));
  batch.set(doc(firestore, "leagueHouseBalancePrivateWeeks", resultId), {
    leagueId,
    weekKey: "2026-08-03",
    rulesVersion: "season-houses-v4",
    calculationVersion: "house-balance-v1",
    profileVersion: "season-composition-v1",
    scoringEnabled: false,
    minimumDisclosureCount: 3,
    houseCount: 2,
    activeMemberCount: 4,
    responseCount: 4,
    disclosedCount: 4,
    undisclosedCount: 0,
    preferNotToSayCount: 0,
    rosterSizeDifference: 0,
    averageDeviationPercentagePoints: null,
    maximumDeviationPercentagePoints: null,
    balanceStatus: "insufficient-data",
    seasonCompositionCounts: { woman: 2, man: 2, "non-binary-or-another": 0 },
    seasonCompositionDistribution: { woman: 50, man: 50, "non-binary-or-another": 0 },
    publicResultId: resultId,
    createdAt: serverTimestamp(),
    createdBy: "admin-one",
    lastAuditId: auditId,
  });
  batch.set(doc(firestore, "leagueHouseBalanceWeeks", resultId), {
    leagueId,
    weekKey: "2026-08-03",
    rulesVersion: "season-houses-v4",
    calculationVersion: "house-balance-v1",
    scoringEnabled: false,
    minimumDisclosureCount: 3,
    houseCount: 2,
    rosterSizeDifference: 0,
    averageDeviationPercentagePoints: null,
    maximumDeviationPercentagePoints: null,
    balanceStatus: "insufficient-data",
    seasonDistributionVisible: true,
    seasonCompositionDistribution: { woman: 50, man: 50, "non-binary-or-another": 0 },
    privateResultId: resultId,
    createdAt: serverTimestamp(),
  });

  [firstHouse, secondHouse].forEach((house, index) => {
    const rowId = `${resultId}_${house.id}`;
    const counts = index === 0
      ? { woman: 2, man: 0, "non-binary-or-another": 0 }
      : { woman: 0, man: 2, "non-binary-or-another": 0 };
    const distribution = index === 0
      ? { woman: 100, man: 0, "non-binary-or-another": 0 }
      : { woman: 0, man: 100, "non-binary-or-another": 0 };
    batch.set(doc(firestore, "leagueHouseBalancePrivateHouseWeeks", rowId), {
      leagueId,
      weekKey: "2026-08-03",
      resultId,
      houseId: house.id,
      houseName: house.data.name,
      houseEmblemId: house.data.emblemId,
      rosterSize: 2,
      responseCount: 2,
      disclosedCount: 2,
      undisclosedCount: 0,
      preferNotToSayCount: 0,
      compositionCounts: counts,
      compositionDistribution: distribution,
      deviationPercentagePoints: 50,
      createdAt: serverTimestamp(),
      createdBy: "admin-one",
      lastAuditId: auditId,
    });
    batch.set(doc(firestore, "leagueHouseBalanceHouseWeeks", rowId), {
      leagueId,
      weekKey: "2026-08-03",
      resultId,
      houseId: house.id,
      houseName: house.data.name,
      houseEmblemId: house.data.emblemId,
      rosterSize: 2,
      compositionVisible: false,
      compositionDistribution: {},
      deviationPercentagePoints: null,
      createdAt: serverTimestamp(),
    });
  });

  await assertSucceeds(batch.commit());
  const member = playerContext("player-one").firestore();
  await assertSucceeds(getDoc(doc(member, "leagueHouseBalanceWeeks", resultId)));
  await assertSucceeds(getDoc(doc(member, "leagueHouseBalanceHouseWeeks", `${resultId}_${firstHouse.id}`)));
  await assertFails(getDoc(doc(member, "leagueHouseBalancePrivateWeeks", resultId)));
  await assertFails(getDoc(doc(member, "leagueHouseBalancePrivateHouseWeeks", `${resultId}_${firstHouse.id}`)));
  await assertSucceeds(getDoc(doc(firestore, "leagueHouseBalancePrivateWeeks", resultId)));
  await assertFails(updateDoc(doc(firestore, "leagueHouseBalanceWeeks", resultId), { balanceStatus: "balanced" }));

  const leakResultId = `${leagueId}_2026-08-10`;
  const leakAuditId = `${leakResultId}-audit`;
  const leakRowId = `${leakResultId}_${firstHouse.id}`;
  const leakBatch = writeBatch(firestore);
  leakBatch.set(doc(firestore, "auditEvents", leakAuditId), auditData({
    action: "house.balance-calculated",
    entityId: leagueId,
    summary: "Attempted unsafe weekly House balance disclosure",
  }));
  leakBatch.set(doc(firestore, "leagueHouseBalancePrivateWeeks", leakResultId), {
    leagueId,
    weekKey: "2026-08-10",
    rulesVersion: "season-houses-v4",
    calculationVersion: "house-balance-v1",
    profileVersion: "season-composition-v1",
    scoringEnabled: false,
    minimumDisclosureCount: 3,
    houseCount: 2,
    activeMemberCount: 4,
    responseCount: 4,
    disclosedCount: 4,
    undisclosedCount: 0,
    preferNotToSayCount: 0,
    rosterSizeDifference: 0,
    averageDeviationPercentagePoints: null,
    maximumDeviationPercentagePoints: null,
    balanceStatus: "insufficient-data",
    seasonCompositionCounts: { woman: 2, man: 2, "non-binary-or-another": 0 },
    seasonCompositionDistribution: { woman: 50, man: 50, "non-binary-or-another": 0 },
    publicResultId: leakResultId,
    createdAt: serverTimestamp(),
    createdBy: "admin-one",
    lastAuditId: leakAuditId,
  });
  leakBatch.set(doc(firestore, "leagueHouseBalancePrivateHouseWeeks", leakRowId), {
    leagueId,
    weekKey: "2026-08-10",
    resultId: leakResultId,
    houseId: firstHouse.id,
    houseName: firstHouse.data.name,
    houseEmblemId: firstHouse.data.emblemId,
    rosterSize: 2,
    responseCount: 2,
    disclosedCount: 2,
    undisclosedCount: 0,
    preferNotToSayCount: 0,
    compositionCounts: { woman: 2, man: 0, "non-binary-or-another": 0 },
    compositionDistribution: { woman: 100, man: 0, "non-binary-or-another": 0 },
    deviationPercentagePoints: 50,
    createdAt: serverTimestamp(),
    createdBy: "admin-one",
    lastAuditId: leakAuditId,
  });
  leakBatch.set(doc(firestore, "leagueHouseBalanceHouseWeeks", leakRowId), {
    leagueId,
    weekKey: "2026-08-10",
    resultId: leakResultId,
    houseId: firstHouse.id,
    houseName: firstHouse.data.name,
    houseEmblemId: firstHouse.data.emblemId,
    rosterSize: 2,
    compositionVisible: true,
    compositionDistribution: { woman: 100, man: 0, "non-binary-or-another": 0 },
    deviationPercentagePoints: 50,
    createdAt: serverTimestamp(),
  });
  await assertFails(leakBatch.commit());
});

test("v4 weekly House balance supports eight Houses in the real immutable snapshot batch", async () => {
  const leagueId = "season-v4-balance-scale";
  const houses = Array.from({ length: 8 }, (_, index) => houseData({
    leagueId,
    id: `balance-house-${index + 1}`,
    name: `Balance House ${index + 1}`,
    emblemId: `balance-emblem-${index + 1}`,
    accentId: `balance-accent-${index + 1}`,
  }));
  const league = seasonDataV4({ status: "active", participantCount: 24, active: true });
  league.houseCount = 8;

  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    await setDoc(doc(firestore, "leagues", leagueId), league);
    await setDoc(doc(firestore, "leagueMemberships", `${leagueId}_player-one`), {
      ...membershipData({ leagueId, status: "active", house: houses[0] }),
      rosterLockThroughWeekKey: "",
      rosterEligibleWeekKey: "",
    });
    for (const house of houses) await setDoc(doc(firestore, "leagueHouses", house.id), house.data);
  });

  const firestore = adminContext().firestore();
  const resultId = `${leagueId}_2026-08-03`;
  const auditId = `${resultId}-audit`;
  const batch = writeBatch(firestore);
  batch.set(doc(firestore, "auditEvents", auditId), auditData({
    action: "house.balance-calculated",
    entityId: leagueId,
    summary: "Calculated eight-House weekly balance snapshot",
  }));
  batch.set(doc(firestore, "leagueHouseBalancePrivateWeeks", resultId), {
    leagueId,
    weekKey: "2026-08-03",
    rulesVersion: "season-houses-v4",
    calculationVersion: "house-balance-v1",
    profileVersion: "season-composition-v1",
    scoringEnabled: false,
    minimumDisclosureCount: 3,
    houseCount: 8,
    activeMemberCount: 24,
    responseCount: 24,
    disclosedCount: 24,
    undisclosedCount: 0,
    preferNotToSayCount: 0,
    rosterSizeDifference: 0,
    averageDeviationPercentagePoints: 0,
    maximumDeviationPercentagePoints: 0,
    balanceStatus: "balanced",
    seasonCompositionCounts: { woman: 16, man: 8, "non-binary-or-another": 0 },
    seasonCompositionDistribution: { woman: 66.7, man: 33.3, "non-binary-or-another": 0 },
    publicResultId: resultId,
    createdAt: serverTimestamp(),
    createdBy: "admin-one",
    lastAuditId: auditId,
  });
  batch.set(doc(firestore, "leagueHouseBalanceWeeks", resultId), {
    leagueId,
    weekKey: "2026-08-03",
    rulesVersion: "season-houses-v4",
    calculationVersion: "house-balance-v1",
    scoringEnabled: false,
    minimumDisclosureCount: 3,
    houseCount: 8,
    rosterSizeDifference: 0,
    averageDeviationPercentagePoints: 0,
    maximumDeviationPercentagePoints: 0,
    balanceStatus: "balanced",
    seasonDistributionVisible: true,
    seasonCompositionDistribution: { woman: 66.7, man: 33.3, "non-binary-or-another": 0 },
    privateResultId: resultId,
    createdAt: serverTimestamp(),
  });

  houses.forEach((house) => {
    const rowId = `${resultId}_${house.id}`;
    batch.set(doc(firestore, "leagueHouseBalancePrivateHouseWeeks", rowId), {
      leagueId,
      weekKey: "2026-08-03",
      resultId,
      houseId: house.id,
      houseName: house.data.name,
      houseEmblemId: house.data.emblemId,
      rosterSize: 3,
      responseCount: 3,
      disclosedCount: 3,
      undisclosedCount: 0,
      preferNotToSayCount: 0,
      compositionCounts: { woman: 2, man: 1, "non-binary-or-another": 0 },
      compositionDistribution: { woman: 66.7, man: 33.3, "non-binary-or-another": 0 },
      deviationPercentagePoints: 0,
      createdAt: serverTimestamp(),
      createdBy: "admin-one",
      lastAuditId: auditId,
    });
    batch.set(doc(firestore, "leagueHouseBalanceHouseWeeks", rowId), {
      leagueId,
      weekKey: "2026-08-03",
      resultId,
      houseId: house.id,
      houseName: house.data.name,
      houseEmblemId: house.data.emblemId,
      rosterSize: 3,
      compositionVisible: true,
      compositionDistribution: { woman: 66.7, man: 33.3, "non-binary-or-another": 0 },
      deviationPercentagePoints: 0,
      createdAt: serverTimestamp(),
    });
  });

  await assertSucceeds(batch.commit());
  await assertSucceeds(getDoc(doc(playerContext("player-one").firestore(), "leagueHouseBalanceWeeks", resultId)));
  await assertSucceeds(getDoc(doc(playerContext("player-one").firestore(), "leagueHouseBalanceHouseWeeks", `${resultId}_${houses[7].id}`)));
  await assertFails(getDoc(doc(playerContext("player-one").firestore(), "leagueHouseBalancePrivateWeeks", resultId)));
});

test("Pocket activities are private, zero-point reserves during the official window", async () => {
  const dates = seasonDates();
  const now = Timestamp.now();
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    const league = seasonData({ status: "registration", participantCount: 1 });
    league.pocketStartDate = Timestamp.fromMillis(Date.now() - 24 * 60 * 60 * 1000);
    league.pocketEndDate = Timestamp.fromMillis(Date.now() + 5 * 24 * 60 * 60 * 1000);
    league.startDate = Timestamp.fromMillis(Date.now() + 6 * 24 * 60 * 60 * 1000);
    league.endDate = Timestamp.fromMillis(Date.now() + 34 * 24 * 60 * 60 * 1000);
    await setDoc(doc(firestore, "leagues", "season-one"), league);
    await setDoc(doc(firestore, "leagueMemberships", "season-one_player-one"), membershipData());
  });

  const firestore = playerContext().firestore();
  await assertSucceeds(setDoc(doc(firestore, "pocketActivities", "pocket-water"), {
    leagueId: "season-one",
    userId: "player-one",
    category: "water",
    data: { amount: 1000 },
    mode: "partial",
    unit: "millilitres",
    originalQuantity: 1000,
    remainingQuantity: 1000,
    activityDate: now,
    status: "available",
    lastRedemptionId: "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }));
  await assertFails(getDoc(doc(playerContext("player-two").firestore(), "pocketActivities", "pocket-water")));
  assert.ok(dates.startDate);
});

test("Pocket redemption atomically creates the scored entry, House contribution and receipt", async () => {
  const house = houseData();
  const challengeDate = Timestamp.fromDate(new Date(new Date().setHours(0, 0, 0, 0)));
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    await setDoc(doc(firestore, "leagues", "season-one"), seasonData({ status: "active", participantCount: 1, chaosStatus: "activated", active: true }));
    await setDoc(doc(firestore, "leagueHouses", house.id), house.data);
    await setDoc(doc(firestore, "leagueMemberships", "season-one_player-one"), membershipData({ status: "active", house }));
    await setDoc(doc(firestore, "pocketActivities", "pocket-water"), {
      leagueId: "season-one", userId: "player-one", category: "water", data: { amount: 1000 },
      mode: "partial", unit: "millilitres", originalQuantity: 1000, remainingQuantity: 1000,
      activityDate: Timestamp.fromMillis(Date.now() - 10 * 24 * 60 * 60 * 1000), status: "available",
      lastRedemptionId: "", createdAt: Timestamp.now(), updatedAt: Timestamp.now(),
    });
  });

  const firestore = playerContext().firestore();
  const batch = writeBatch(firestore);
  const entryId = "pocket-entry";
  const redemptionId = "pocket-redemption";
  batch.set(doc(firestore, "challengeEntries", entryId), {
    userId: "player-one", category: "water", data: { amount: 500 }, source: "pocket",
    sourceLeagueId: "season-one", sourcePocketId: "pocket-water", sourceRedemptionId: redemptionId,
    createdAt: serverTimestamp(), challengeDate,
  });
  batch.set(doc(firestore, "leagueContributions", `season-one_${entryId}`), {
    leagueId: "season-one", entryId, userId: "player-one", displayName: "player one", avatarId: "legacy-trophy",
    houseId: house.id, houseName: house.data.name, houseEmblemId: house.data.emblemId,
    teamId: house.id, teamName: house.data.name, category: "water", challengeDate,
    activityPoints: 1, rulesVersion: "season-houses-v1", source: "pocket", sourceRedemptionId: redemptionId,
    createdAt: serverTimestamp(),
  });
  batch.update(doc(firestore, "pocketActivities", "pocket-water"), {
    remainingQuantity: 500, status: "available", lastRedemptionId: redemptionId, updatedAt: serverTimestamp(),
  });
  batch.set(doc(firestore, "pocketRedemptions", redemptionId), {
    leagueId: "season-one", userId: "player-one", pocketActivityId: "pocket-water",
    challengeEntryId: entryId, category: "water", quantity: 500, unit: "millilitres",
    targetDate: challengeDate, houseId: house.id, createdAt: serverTimestamp(),
  });
  batch.set(doc(firestore, "playerNotifications", "pocket-note"), notificationData({ userId: "player-one", type: "pocket-redeemed", houseId: house.id }));
  await assertSucceeds(batch.commit());
  await assertFails(deleteDoc(doc(firestore, "challengeEntries", entryId)));
});

test("Pocket redemption cannot change the stored scoring facts", async () => {
  const challengeDate = Timestamp.fromDate(new Date(new Date().setHours(0, 0, 0, 0)));
  const runData = {
    distance: 3,
    hours: 0,
    minutes: 20,
    seconds: 0,
    totalSeconds: 1200,
    totalMinutes: 20,
    averagePaceSecondsPerKm: 400,
  };

  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    const house = houseData();
    await setDoc(doc(firestore, "leagues", "season-one"), seasonData({
      status: "active",
      participantCount: 1,
      chaosStatus: "activated",
      active: true,
    }));
    await setDoc(doc(firestore, "leagueHouses", house.id), house.data);
    await setDoc(
      doc(firestore, "leagueMemberships", "season-one_player-one"),
      membershipData({ status: "active", house }),
    );
    await setDoc(doc(firestore, "pocketActivities", "pocket-water-tamper"), {
      leagueId: "season-one",
      userId: "player-one",
      category: "water",
      data: { amount: 1000 },
      mode: "partial",
      unit: "millilitres",
      originalQuantity: 1000,
      remainingQuantity: 1000,
      activityDate: Timestamp.fromMillis(Date.now() - 10 * 24 * 60 * 60 * 1000),
      status: "available",
      lastRedemptionId: "",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    await setDoc(doc(firestore, "pocketActivities", "pocket-run-tamper"), {
      leagueId: "season-one",
      userId: "player-one",
      category: "running",
      data: runData,
      mode: "whole",
      unit: "stored runs",
      originalQuantity: 1,
      remainingQuantity: 1,
      activityDate: Timestamp.fromMillis(Date.now() - 10 * 24 * 60 * 60 * 1000),
      status: "available",
      lastRedemptionId: "",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  });

  const firestore = playerContext().firestore();
  const waterBatch = writeBatch(firestore);
  waterBatch.set(doc(firestore, "challengeEntries", "tampered-water-entry"), {
    userId: "player-one",
    category: "water",
    data: { amount: 750 },
    source: "pocket",
    sourceLeagueId: "season-one",
    sourcePocketId: "pocket-water-tamper",
    sourceRedemptionId: "tampered-water-redemption",
    createdAt: serverTimestamp(),
    challengeDate,
  });
  waterBatch.update(doc(firestore, "pocketActivities", "pocket-water-tamper"), {
    remainingQuantity: 500,
    status: "available",
    lastRedemptionId: "tampered-water-redemption",
    updatedAt: serverTimestamp(),
  });
  waterBatch.set(doc(firestore, "pocketRedemptions", "tampered-water-redemption"), {
    leagueId: "season-one",
    userId: "player-one",
    pocketActivityId: "pocket-water-tamper",
    challengeEntryId: "tampered-water-entry",
    category: "water",
    quantity: 500,
    unit: "millilitres",
    targetDate: challengeDate,
    houseId: "house-springbok",
    createdAt: serverTimestamp(),
  });
  await assertFails(waterBatch.commit());

  const runningBatch = writeBatch(firestore);
  runningBatch.set(doc(firestore, "challengeEntries", "tampered-run-entry"), {
    userId: "player-one",
    category: "running",
    data: { ...runData, distance: 21 },
    source: "pocket",
    sourceLeagueId: "season-one",
    sourcePocketId: "pocket-run-tamper",
    sourceRedemptionId: "tampered-run-redemption",
    createdAt: serverTimestamp(),
    challengeDate,
  });
  runningBatch.update(doc(firestore, "pocketActivities", "pocket-run-tamper"), {
    remainingQuantity: 0,
    status: "empty",
    lastRedemptionId: "tampered-run-redemption",
    updatedAt: serverTimestamp(),
  });
  runningBatch.set(doc(firestore, "pocketRedemptions", "tampered-run-redemption"), {
    leagueId: "season-one",
    userId: "player-one",
    pocketActivityId: "pocket-run-tamper",
    challengeEntryId: "tampered-run-entry",
    category: "running",
    quantity: 1,
    unit: "stored runs",
    targetDate: challengeDate,
    houseId: "house-springbok",
    createdAt: serverTimestamp(),
  });
  await assertFails(runningBatch.commit());
});

test("season invitation codes resolve directly but cannot be enumerated", async () => {
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), "leagueInvites", "SEASONAA"), {
      leagueId: "season-one", leagueName: "Legacy House Season", status: "active",
      createdAt: Timestamp.now(), createdBy: "admin-one", updatedAt: Timestamp.now(), updatedBy: "admin-one",
    });
  });
  const firestore = playerContext().firestore();
  await assertSucceeds(getDoc(doc(firestore, "leagueInvites", "SEASONAA")));
  await assertFails(getDocs(collection(firestore, "leagueInvites")));
});

test("standard challenge entries require recent dates and category-shaped data", async () => {
  const firestore = playerContext().firestore();
  await assertSucceeds(setDoc(doc(firestore, "challengeEntries", "water-entry"), {
    userId: "player-one", category: "water", data: { amount: 500 }, source: "activity",
    sourceLeagueId: "", sourcePocketId: "", sourceRedemptionId: "",
    createdAt: serverTimestamp(), challengeDate: Timestamp.now(),
  }));
  await assertFails(setDoc(doc(firestore, "challengeEntries", "invalid-water"), {
    userId: "player-one", category: "water", data: { amount: -5 }, source: "activity",
    sourceLeagueId: "", sourcePocketId: "", sourceRedemptionId: "",
    createdAt: serverTimestamp(), challengeDate: Timestamp.now(),
  }));
});

test("completed House contributions remain after a recent personal entry is deleted", async () => {
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    await setDoc(doc(firestore, "leagues", "season-one"), seasonData({ status: "completed", participantCount: 1, chaosStatus: "activated", active: true }));
    await setDoc(doc(firestore, "challengeEntries", "recent-entry"), {
      userId: "player-one", category: "water", data: { amount: 500 }, source: "activity",
      sourceLeagueId: "", sourcePocketId: "", sourceRedemptionId: "",
      createdAt: Timestamp.now(), challengeDate: Timestamp.now(),
    });
    await setDoc(doc(firestore, "leagueContributions", "season-one_recent-entry"), {
      leagueId: "season-one", entryId: "recent-entry", userId: "player-one", displayName: "player one",
      avatarId: "legacy-trophy", houseId: "house-springbok", houseName: "House Springbok",
      houseEmblemId: "springbok", teamId: "house-springbok", teamName: "House Springbok",
      category: "water", challengeDate: Timestamp.now(), activityPoints: 1, rulesVersion: "season-houses-v1",
      source: "activity", sourceRedemptionId: "", createdAt: Timestamp.now(),
    });
  });

  const firestore = playerContext().firestore();
  await assertSucceeds(deleteDoc(doc(firestore, "challengeEntries", "recent-entry")));
  await assertSucceeds(getDoc(doc(firestore, "leagueContributions", "season-one_recent-entry")));
  await assertFails(deleteDoc(doc(firestore, "leagueContributions", "season-one_recent-entry")));
});

test("House leaders can announce their ballot but cannot impersonate another House", async () => {
  const firstHouse = houseData({
    captainId: "player-three",
    viceCaptainIds: ["player-one"],
  });
  const secondHouse = houseData({
    id: "house-lion",
    name: "House Lion",
    emblemId: "lion",
    accentId: "sunstone",
    captainId: "player-four",
    viceCaptainIds: ["player-two"],
  });

  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    await setDoc(
      doc(firestore, "leagues", "season-one"),
      seasonData({
        status: "active",
        participantCount: 4,
        chaosStatus: "activated",
        active: true,
      }),
    );
    await setDoc(doc(firestore, "leagueHouses", firstHouse.id), firstHouse.data);
    await setDoc(doc(firestore, "leagueHouses", secondHouse.id), secondHouse.data);
    await setDoc(
      doc(firestore, "leagueMemberships", "season-one_player-one"),
      membershipData({ userId: "player-one", status: "active", house: firstHouse }),
    );
    await setDoc(
      doc(firestore, "leagueMemberships", "season-one_player-two"),
      membershipData({ userId: "player-two", status: "active", house: secondHouse }),
    );
    await setDoc(
      doc(firestore, "leagueMemberships", "season-one_player-three"),
      membershipData({ userId: "player-three", status: "active", house: firstHouse }),
    );
    await setDoc(
      doc(firestore, "leagueMemberships", "season-one_player-four"),
      membershipData({ userId: "player-four", status: "active", house: secondHouse }),
    );
  });

  const leaderFirestore = playerContext("player-three").firestore();
  await assertSucceeds(
    setDoc(
      doc(leaderFirestore, "playerNotifications", "first-house-ballot"),
      notificationData({
        userId: "player-one",
        type: "leadership-vote-open",
        houseId: firstHouse.id,
      }),
    ),
  );
  await assertFails(
    setDoc(
      doc(leaderFirestore, "playerNotifications", "forged-second-house-ballot"),
      notificationData({
        userId: "player-two",
        type: "leadership-vote-open",
        houseId: secondHouse.id,
      }),
    ),
  );
});

test("new player profiles begin with explicit onboarding state", async () => {
  const firestore = playerContext("new-player").firestore();

  await assertSucceeds(
    setDoc(doc(firestore, "users", "new-player"), {
      uid: "new-player",
      firstName: "New",
      lastName: "Champion",
      fullName: "New Champion",
      displayName: "New Champion",
      email: "new-player@example.com",
      role: "user",
      team: "",
      avatarId: "legacy-trophy",
      joinedAt: serverTimestamp(),
      onboardingVersion: 0,
      onboardingCompletedAt: null,
      onboardingUpdatedAt: serverTimestamp(),
      profileUpdatedAt: serverTimestamp(),
    }),
  );
});

test("players can complete and replay onboarding without changing trusted fields", async () => {
  const firestore = playerContext().firestore();

  await assertSucceeds(
    updateDoc(doc(firestore, "users", "player-one"), {
      onboardingVersion: 1,
      onboardingCompletedAt: serverTimestamp(),
      onboardingUpdatedAt: serverTimestamp(),
      profileUpdatedAt: serverTimestamp(),
    }),
  );

  await assertSucceeds(
    updateDoc(doc(firestore, "users", "player-one"), {
      onboardingVersion: 0,
      onboardingCompletedAt: null,
      onboardingUpdatedAt: serverTimestamp(),
      profileUpdatedAt: serverTimestamp(),
    }),
  );

  await assertFails(
    updateDoc(doc(firestore, "users", "player-one"), {
      onboardingVersion: 1,
      onboardingCompletedAt: serverTimestamp(),
      onboardingUpdatedAt: serverTimestamp(),
      profileUpdatedAt: serverTimestamp(),
      role: "admin",
    }),
  );
});

test("players can request, cancel and reopen their own account deletion workflow", async () => {
  const firestore = playerContext().firestore();
  const requestReference = doc(
    firestore,
    "accountDeletionRequests",
    "player-one",
  );

  await assertSucceeds(
    setDoc(requestReference, {
      userId: "player-one",
      email: "player-one@example.com",
      displayName: "Test Player",
      status: "requested",
      reasonCode: "privacy",
      acknowledgementVersion: 2,
      requestedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      cancelledAt: null,
      acknowledgedAt: null,
      acknowledgedBy: "",
      lastAuditId: "",
      deletionPolicyVersion: "trusted-deletion-v1",
      waitingPeriodDays: 7,
      processingAt: null,
      processingBy: "",
      completedAt: null,
      completedBy: "",
      executionId: "",
      anonymizedPlayerId: "",
      anonymizedDisplayName: "",
      failureAt: null,
      failureMessage: "",
    }),
  );

  await assertSucceeds(getDoc(requestReference));
  await assertFails(
    getDoc(
      doc(
        playerContext("player-two").firestore(),
        "accountDeletionRequests",
        "player-one",
      ),
    ),
  );

  await assertSucceeds(
    updateDoc(requestReference, {
      status: "cancelled",
      cancelledAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }),
  );

  await assertSucceeds(
    updateDoc(requestReference, {
      email: "player-one@example.com",
      displayName: "Test Player",
      status: "requested",
      reasonCode: "not-using",
      acknowledgementVersion: 2,
      requestedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      cancelledAt: null,
      acknowledgedAt: null,
      acknowledgedBy: "",
      lastAuditId: "",
      deletionPolicyVersion: "trusted-deletion-v1",
      waitingPeriodDays: 7,
      processingAt: null,
      processingBy: "",
      completedAt: null,
      completedBy: "",
      executionId: "",
      anonymizedPlayerId: "",
      anonymizedDisplayName: "",
      failureAt: null,
      failureMessage: "",
    }),
  );
});

test("Platform Administrators acknowledge deletion requests with an audit record", async () => {
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    await setDoc(
      doc(context.firestore(), "accountDeletionRequests", "player-one"),
      {
        userId: "player-one",
        email: "player-one@example.com",
        displayName: "Test Player",
        status: "requested",
        reasonCode: "prefer-not-to-say",
        acknowledgementVersion: 2,
        requestedAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        cancelledAt: null,
        acknowledgedAt: null,
        acknowledgedBy: "",
        lastAuditId: "",
        deletionPolicyVersion: "trusted-deletion-v1",
        waitingPeriodDays: 7,
        processingAt: null,
        processingBy: "",
        completedAt: null,
        completedBy: "",
        executionId: "",
        anonymizedPlayerId: "",
        anonymizedDisplayName: "",
        failureAt: null,
        failureMessage: "",
      },
    );
  });

  await assertFails(
    updateDoc(
      doc(
        playerContext("player-two").firestore(),
        "accountDeletionRequests",
        "player-one",
      ),
      { status: "acknowledged" },
    ),
  );

  const firestore = adminContext().firestore();
  const batch = writeBatch(firestore);
  const auditId = "account-request-audit";
  batch.set(doc(firestore, "auditEvents", auditId), {
    actorId: "admin-one",
    action: "account.deletion.acknowledged",
    entityType: "accountDeletionRequest",
    entityId: "player-one",
    summary: "Acknowledged an account deletion request",
    details: { userId: "player-one" },
    createdAt: serverTimestamp(),
  });
  batch.update(doc(firestore, "accountDeletionRequests", "player-one"), {
    status: "acknowledged",
    acknowledgedAt: serverTimestamp(),
    acknowledgedBy: "admin-one",
    updatedAt: serverTimestamp(),
    lastAuditId: auditId,
  });

  await assertSucceeds(batch.commit());

  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    await updateDoc(
      doc(context.firestore(), "accountDeletionRequests", "player-one"),
      { status: "processing", executionId: "execution-one" },
    );
  });
  await assertFails(
    updateDoc(
      doc(playerContext().firestore(), "accountDeletionRequests", "player-one"),
      { status: "cancelled", cancelledAt: serverTimestamp(), updatedAt: serverTimestamp() },
    ),
  );
});

test("trusted deletion acknowledgement remains audit-bound", async () => {
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), "accountDeletionRequests", "player-two"), {
      userId: "player-two",
      email: "player-two@example.com",
      displayName: "Second Player",
      status: "requested",
      reasonCode: "privacy",
      acknowledgementVersion: 2,
      requestedAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      cancelledAt: null,
      acknowledgedAt: null,
      acknowledgedBy: "",
      lastAuditId: "",
      deletionPolicyVersion: "trusted-deletion-v1",
      waitingPeriodDays: 7,
      processingAt: null,
      processingBy: "",
      completedAt: null,
      completedBy: "",
      executionId: "",
      anonymizedPlayerId: "",
      anonymizedDisplayName: "",
      failureAt: null,
      failureMessage: "",
    });
  });

  await assertFails(
    updateDoc(doc(adminContext().firestore(), "accountDeletionRequests", "player-two"), {
      status: "acknowledged",
      acknowledgedAt: serverTimestamp(),
      acknowledgedBy: "admin-one",
      updatedAt: serverTimestamp(),
      lastAuditId: "missing-account-deletion-audit",
    }),
  );
});

test("trusted deletion execution records are Platform Administrator-only and client-immutable", async () => {
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    await setDoc(doc(firestore, "accountDeletionExecutions", "execution-one"), {
      status: "processing",
      requestId: "player-one",
    });
    await setDoc(doc(firestore, "accountDeletionReceipts", "execution-one"), {
      status: "completed",
      anonymizedPlayerId: "former-player",
    });
  });

  await assertSucceeds(getDoc(doc(adminContext().firestore(), "accountDeletionExecutions", "execution-one")));
  await assertSucceeds(getDoc(doc(adminContext().firestore(), "accountDeletionReceipts", "execution-one")));
  await assertFails(getDoc(doc(playerContext().firestore(), "accountDeletionExecutions", "execution-one")));
  await assertFails(getDoc(doc(playerContext().firestore(), "accountDeletionReceipts", "execution-one")));
  await assertFails(setDoc(doc(adminContext().firestore(), "accountDeletionExecutions", "client-write"), { status: "processing" }));
});

test("players can export their own private votes and sanitised error reports", async () => {
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    await setDoc(doc(firestore, "leadershipVotes", "vote-one"), {
      leagueId: "league-one",
      voterId: "player-one",
      candidateId: "player-two",
    });
    await setDoc(doc(firestore, "leadershipVotes", "vote-two"), {
      leagueId: "league-one",
      voterId: "player-two",
      candidateId: "player-one",
    });
    await setDoc(doc(firestore, "clientErrorReports", "player-one-report"), {
      userId: "player-one",
      status: "open",
    });
  });

  const firestore = playerContext().firestore();
  await assertSucceeds(
    getDocs(
      query(
        collection(firestore, "leadershipVotes"),
        where("voterId", "==", "player-one"),
      ),
    ),
  );
  await assertFails(getDocs(collection(firestore, "leadershipVotes")));
  await assertSucceeds(
    getDoc(doc(firestore, "clientErrorReports", "player-one-report")),
  );
  await assertFails(
    getDoc(
      doc(
        playerContext("player-two").firestore(),
        "clientErrorReports",
        "player-one-report",
      ),
    ),
  );
});

function seasonDataV2(options = {}) {
  return {
    ...seasonData(options),
    rulesVersion: "season-houses-v2",
    ruleset: currentSeasonRulesetV2(),
    publishedLeaderboardSnapshotId: "",
    publishedLeaderboardAt: null,
    publishedLeaderboardBy: "",
    publishedLeaderboardRevision: 0,
  };
}

function seasonDataV3(options = {}) {
  return {
    ...seasonDataV2(options),
    rulesVersion: "season-houses-v3",
    ruleset: currentSeasonRulesetV3(),
    powerPlayState: initialPowerPlayState(),
  };
}

function seasonDataV4(options = {}) {
  return {
    ...seasonDataV3(options),
    rulesVersion: "season-houses-v4",
    ruleset: currentSeasonRulesetV4(),
  };
}

function runningEntryData() {
  return {
    distance: 5,
    hours: 0,
    minutes: 30,
    seconds: 0,
    totalSeconds: 1800,
    totalMinutes: 30,
    averagePaceSecondsPerKm: 360,
  };
}

function evidenceClaimData({
  leagueId = "season-v2",
  entryId = "run-entry",
  userId = "player-one",
  category = "running",
  claimType = "required-proof",
  challengeDate = Timestamp.now(),
  house = houseData({ leagueId: "season-v2" }),
  deadlineAt = Timestamp.fromMillis(Date.now() + 24 * 60 * 60 * 1000),
  pendingPoints = 18,
  bonusPointsAvailable = 0,
} = {}) {
  const date = challengeDate.toDate();
  const dateKey = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
  const daily = claimType === "daily-bonus";
  const prefix = { running: "RUN", steps: "STEP", water: "WATER", fruit: "FRUIT" }[category];
  return {
    leagueId,
    leagueName: "Legacy House Season",
    userId,
    displayName: userId.replace("-", " "),
    avatarId: "legacy-trophy",
    houseId: house.id,
    houseName: house.data.name,
    houseEmblemId: house.data.emblemId,
    category,
    claimType,
    verificationCode: `${prefix}-ABC234`,
    dateKey,
    challengeDate,
    status: "pending",
    pendingPoints,
    bonusPointsAvailable,
    rulesVersion: "season-houses-v2",
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
    correctionId: "",
    replacesClaimId: "",
    correctionIds: [],
    entryId: daily ? "" : entryId,
    entryIds: [entryId],
    deadlineAt,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

async function seedActiveEvidenceSeason({
  claim,
  includeSecondMember = true,
} = {}) {
  const leagueId = claim?.leagueId ?? "season-v2";
  const house = houseData({ leagueId });
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    await setDoc(doc(firestore, "leagues", leagueId), seasonDataV2({
      status: "active",
      participantCount: includeSecondMember ? 2 : 1,
      chaosStatus: "activated",
      active: true,
    }));
    await setDoc(doc(firestore, "leagueHouses", house.id), house.data);
    await setDoc(
      doc(firestore, "leagueMemberships", `${leagueId}_player-one`),
      membershipData({ leagueId, status: "active", house }),
    );
    if (includeSecondMember) {
      await setDoc(
        doc(firestore, "leagueMemberships", `${leagueId}_player-two`),
        membershipData({ leagueId, userId: "player-two", status: "active", house }),
      );
    }
    if (claim) {
      await setDoc(doc(firestore, "seasonEvidenceClaims", claim.id), claim.data);
    }
  });
  return house;
}

function commitEvidenceVerification({
  firestore,
  actorId,
  claim,
  decisionId,
  contributionId,
  submittedAt = Timestamp.now(),
  late = false,
  reason = "",
}) {
  const batch = writeBatch(firestore);
  batch.set(doc(firestore, "seasonEvidenceDecisions", decisionId), {
    claimId: claim.id,
    leagueId: claim.data.leagueId,
    userId: claim.data.userId,
    entryId: claim.data.entryId,
    category: claim.data.category,
    verificationCode: claim.data.verificationCode,
    decisionType: late ? "late-verify" : "verify",
    previousStatus: "pending",
    nextStatus: "verified",
    pointsDelta: claim.data.pendingPoints || claim.data.bonusPointsAvailable,
    verifiedQuantity: claim.data.category === "water" ? 750 : claim.data.category === "fruit" ? 3 : 0,
    whatsappSubmittedAt: submittedAt,
    reason,
    lateException: late,
    actorId,
    contributionId,
    createdAt: serverTimestamp(),
  });
  batch.update(doc(firestore, "seasonEvidenceClaims", claim.id), {
    status: "verified",
    reviewedAt: serverTimestamp(),
    reviewedBy: actorId,
    reviewReason: reason,
    whatsappSubmittedAt: submittedAt,
    verifiedQuantity: claim.data.category === "water" ? 750 : claim.data.category === "fruit" ? 3 : 0,
    decisionId,
    releasedContributionId: contributionId,
    releasedPoints: claim.data.pendingPoints || claim.data.bonusPointsAvailable,
    releasedPointGroup: claim.data.claimType === "daily-bonus" ? "evidenceBonus" : "activity",
    reversedByDecisionId: "",
    updatedAt: serverTimestamp(),
  });
  batch.set(doc(firestore, "leagueContributions", contributionId), {
    leagueId: claim.data.leagueId,
    entryId: claim.data.entryId || claim.data.entryIds[0],
    userId: claim.data.userId,
    displayName: claim.data.displayName,
    avatarId: claim.data.avatarId,
    houseId: claim.data.houseId,
    houseName: claim.data.houseName,
    houseEmblemId: claim.data.houseEmblemId,
    teamId: claim.data.houseId,
    teamName: claim.data.houseName,
    category: claim.data.category,
    scoreCategory: claim.data.category,
    pointGroup: claim.data.claimType === "daily-bonus" ? "evidenceBonus" : "activity",
    challengeDate: claim.data.challengeDate,
    activityPoints: claim.data.pendingPoints || claim.data.bonusPointsAvailable,
    rulesVersion: claim.data.rulesVersion,
    source: claim.data.claimType === "daily-bonus" ? "evidence-bonus" : "evidence-release",
    sourceRedemptionId: "",
    evidenceClaimId: claim.id,
    evidenceDecisionId: decisionId,
    createdAt: serverTimestamp(),
  });
  batch.set(doc(firestore, "playerNotifications", `evidence-note_${decisionId}`), {
    userId: claim.data.userId,
    type: claim.data.claimType === "daily-bonus" ? "evidence-bonus-awarded" : "evidence-accepted",
    title: "Proof accepted",
    message: "The relevant season points were released after WhatsApp proof review.",
    leagueId: claim.data.leagueId,
    houseId: claim.data.houseId,
    evidenceClaimId: claim.id,
    actionPath: "/activity?tab=journal",
    createdAt: serverTimestamp(),
    readAt: null,
    readBy: "",
  });
  return batch.commit();
}

test("v2 qualifying Running creates only Cardio points immediately and a pending proof claim", async () => {
  const leagueId = "season-v2";
  const house = await seedActiveEvidenceSeason({ includeSecondMember: false });
  const firestore = playerContext().firestore();
  const challengeDate = Timestamp.fromDate(new Date(new Date().setHours(0, 0, 0, 0)));
  const entryId = "run-entry";
  const claimId = `${leagueId}_${entryId}`;
  const claim = evidenceClaimData({ leagueId, entryId, challengeDate, house });
  const batch = writeBatch(firestore);

  batch.set(doc(firestore, "challengeEntries", entryId), {
    userId: "player-one",
    category: "running",
    data: runningEntryData(),
    source: "activity",
    sourceLeagueId: "",
    sourcePocketId: "",
    sourceRedemptionId: "",
    evidenceClaimIds: [claimId],
    createdAt: serverTimestamp(),
    challengeDate,
  });
  batch.set(doc(firestore, "leagueContributions", `${leagueId}_${entryId}`), {
    leagueId,
    entryId,
    userId: "player-one",
    displayName: "player one",
    avatarId: "legacy-trophy",
    houseId: house.id,
    houseName: house.data.name,
    houseEmblemId: house.data.emblemId,
    teamId: house.id,
    teamName: house.data.name,
    category: "running",
    scoreCategory: "cardio",
    pointGroup: "activity",
    challengeDate,
    activityPoints: 7,
    rulesVersion: "season-houses-v2",
    source: "activity",
    sourceRedemptionId: "",
    evidenceClaimId: "",
    evidenceDecisionId: "",
    createdAt: serverTimestamp(),
  });
  batch.set(doc(firestore, "seasonEvidenceClaims", claimId), {
    ...claim,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await assertSucceeds(batch.commit());
  const saved = await getDoc(doc(firestore, "seasonEvidenceClaims", claimId));
  assert.equal(saved.data().pendingPoints, 18);
  assert.equal(saved.data().verificationCode, "RUN-ABC234");
});

test("v2 Steps cannot enter competitive standings before proof is verified", async () => {
  const leagueId = "season-v2";
  const house = await seedActiveEvidenceSeason({ includeSecondMember: false });
  const firestore = playerContext().firestore();
  const challengeDate = Timestamp.now();
  const batch = writeBatch(firestore);
  batch.set(doc(firestore, "challengeEntries", "steps-entry"), {
    userId: "player-one",
    category: "steps",
    data: { steps: 12000 },
    source: "activity",
    sourceLeagueId: "",
    sourcePocketId: "",
    sourceRedemptionId: "",
    createdAt: serverTimestamp(),
    challengeDate,
  });
  batch.set(doc(firestore, "leagueContributions", `${leagueId}_steps-entry`), {
    leagueId,
    entryId: "steps-entry",
    userId: "player-one",
    displayName: "player one",
    avatarId: "legacy-trophy",
    houseId: house.id,
    houseName: house.data.name,
    houseEmblemId: house.data.emblemId,
    teamId: house.id,
    teamName: house.data.name,
    category: "steps",
    scoreCategory: "steps",
    pointGroup: "activity",
    challengeDate,
    activityPoints: 12,
    rulesVersion: "season-houses-v2",
    source: "activity",
    sourceRedemptionId: "",
    evidenceClaimId: "",
    evidenceDecisionId: "",
    createdAt: serverTimestamp(),
  });
  await assertFails(batch.commit());
});

test("retired evidence reviewer assignments cannot be changed by clients", async () => {
  const leagueId = "season-v2";
  await seedActiveEvidenceSeason();
  const assignmentId = `${leagueId}_player-two`;
  const assignment = {
    leagueId,
    userId: "player-two",
    displayName: "player two",
    avatarId: "legacy-trophy",
    categories: ["running"],
    status: "active",
    createdAt: serverTimestamp(),
    createdBy: "admin-one",
    updatedAt: serverTimestamp(),
    updatedBy: "admin-one",
    lastAuditId: "legacy-reviewer-audit",
  };

  await assertFails(setDoc(
    doc(adminContext().firestore(), "leagueEvidenceReviewers", assignmentId),
    assignment,
  ));
  await assertFails(setDoc(
    doc(playerContext("player-two").firestore(), "leagueEvidenceReviewers", assignmentId),
    assignment,
  ));
});

test("evidence deadline notifications remain bound to the claim owner", async () => {
  const leagueId = "season-v2";
  const house = houseData({ leagueId });
  const claim = {
    id: `${leagueId}_deadline-owner`,
    data: evidenceClaimData({
      leagueId,
      entryId: "deadline-owner",
      challengeDate: Timestamp.now(),
      deadlineAt: Timestamp.fromMillis(Date.now() - 60 * 60 * 1000),
      house,
    }),
  };
  await seedActiveEvidenceSeason({ claim });

  await assertFails(setDoc(doc(
    playerContext("player-two").firestore(),
    "playerNotifications",
    `evidence-deadline_${claim.id}`,
  ), {
    userId: "player-one",
    type: "evidence-deadline-missed",
    title: "Proof deadline missed",
    message: "Your proof deadline has passed.",
    leagueId,
    houseId: house.id,
    evidenceClaimId: claim.id,
    actionPath: "/activity?tab=journal",
    createdAt: serverTimestamp(),
    readAt: null,
    readBy: "",
  }));
});


test("only Platform Administrators release proof-dependent points atomically", async () => {
  const leagueId = "season-v2";
  const house = houseData({ leagueId });
  const claim = {
    id: `${leagueId}_run-entry`,
    data: evidenceClaimData({ leagueId, house }),
  };
  await seedActiveEvidenceSeason({ claim });

  await assertFails(commitEvidenceVerification({
    firestore: playerContext("player-two").firestore(),
    actorId: "player-two",
    claim,
    decisionId: "decision-player-forbidden",
    contributionId: `${leagueId}_${claim.id}_decision-player-forbidden`,
  }));
  await assertSucceeds(commitEvidenceVerification({
    firestore: adminContext().firestore(),
    actorId: "admin-one",
    claim,
    decisionId: "decision-platform-admin",
    contributionId: `${leagueId}_${claim.id}_decision-platform-admin`,
  }));
});

test("trusted Platform Administrator evidence writes remain bound to the stored claim identity", async () => {
  const leagueId = "season-v2";
  const house = houseData({ leagueId });
  const claim = {
    id: `${leagueId}_run-entry`,
    data: evidenceClaimData({ leagueId, house }),
  };
  await seedActiveEvidenceSeason({ claim });
  const forgedClaim = {
    ...claim,
    data: { ...claim.data, userId: "player-two" },
  };

  await assertFails(commitEvidenceVerification({
    firestore: adminContext().firestore(),
    actorId: "admin-one",
    claim: forgedClaim,
    decisionId: "decision-forged-claim-identity",
    contributionId: `${leagueId}_${claim.id}_decision-forged-claim-identity`,
  }));
});

test("League Administrators cannot make evidence decisions", async () => {
  const leagueId = "season-v2";
  const house = houseData({ leagueId });
  const claim = {
    id: `${leagueId}_run-entry`,
    data: evidenceClaimData({ leagueId, house }),
  };
  await seedActiveEvidenceSeason({ claim });
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    await updateDoc(doc(context.firestore(), "leagues", leagueId), {
      administratorIds: ["admin-one", "player-three"],
    });
  });

  await assertFails(commitEvidenceVerification({
    firestore: playerContext("player-three").firestore(),
    actorId: "player-three",
    claim,
    decisionId: "decision-league-admin-forbidden",
    contributionId: `${leagueId}_${claim.id}_decision-league-admin-forbidden`,
  }));
});

test("League Administrators retain read-only evidence operations access", async () => {
  const leagueId = "season-v2";
  const house = houseData({ leagueId });
  const claim = {
    id: `${leagueId}_run-entry`,
    data: evidenceClaimData({ leagueId, house }),
  };
  await seedActiveEvidenceSeason({ claim });
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    await updateDoc(doc(context.firestore(), "leagues", leagueId), {
      administratorIds: ["admin-one", "player-three"],
    });
  });

  await assertSucceeds(getDoc(doc(
    playerContext("player-three").firestore(),
    "seasonEvidenceClaims",
    claim.id,
  )));
  await assertFails(getDoc(doc(
    playerContext("player-two").firestore(),
    "seasonEvidenceClaims",
    claim.id,
  )));
});

test("League Administrators cannot use the late-proof exception", async () => {
  const leagueId = "season-v2";
  const house = houseData({ leagueId });
  const deadlineAt = Timestamp.fromMillis(Date.now() - 60 * 60 * 1000);
  const claim = {
    id: `${leagueId}_run-entry`,
    data: evidenceClaimData({ leagueId, house, deadlineAt }),
  };
  await seedActiveEvidenceSeason({ claim });
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    await updateDoc(doc(context.firestore(), "leagues", leagueId), {
      administratorIds: ["admin-one", "player-three"],
    });
  });

  await assertFails(commitEvidenceVerification({
    firestore: playerContext("player-three").firestore(),
    actorId: "player-three",
    claim,
    decisionId: "late-league-admin-forbidden",
    contributionId: `${leagueId}_${claim.id}_late-league-admin-forbidden`,
    submittedAt: Timestamp.now(),
    late: true,
    reason: "Delayed WhatsApp delivery",
  }));
});

test("late proof requires a Platform Administrator and an audit reason", async () => {
  const leagueId = "season-v2";
  const house = houseData({ leagueId });
  const deadlineAt = Timestamp.fromMillis(Date.now() - 60 * 60 * 1000);
  const claim = {
    id: `${leagueId}_run-entry`,
    data: evidenceClaimData({ leagueId, house, deadlineAt }),
  };
  await seedActiveEvidenceSeason({ claim });
  const lateSubmission = Timestamp.now();

  await assertFails(commitEvidenceVerification({
    firestore: playerContext("player-two").firestore(),
    actorId: "player-two",
    claim,
    decisionId: "late-non-admin",
    contributionId: `${leagueId}_${claim.id}_late-non-admin`,
    submittedAt: lateSubmission,
    late: true,
    reason: "Delayed WhatsApp delivery",
  }));
  await assertSucceeds(commitEvidenceVerification({
    firestore: adminContext().firestore(),
    actorId: "admin-one",
    claim,
    decisionId: "late-admin",
    contributionId: `${leagueId}_${claim.id}_late-admin`,
    submittedAt: lateSubmission,
    late: true,
    reason: "Delayed WhatsApp delivery",
  }));
});

test("v2 players read published snapshots but not another player's live contributions", async () => {
  const leagueId = "season-v2";
  const house = await seedActiveEvidenceSeason();
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    await setDoc(doc(firestore, "leagueContributions", "live-player-two"), {
      leagueId,
      entryId: "other-entry",
      userId: "player-two",
      displayName: "player two",
      avatarId: "legacy-trophy",
      houseId: house.id,
      houseName: house.data.name,
      houseEmblemId: house.data.emblemId,
      teamId: house.id,
      teamName: house.data.name,
      category: "water",
      scoreCategory: "water",
      pointGroup: "activity",
      challengeDate: Timestamp.now(),
      activityPoints: 3,
      rulesVersion: "season-houses-v2",
      source: "activity",
      sourceRedemptionId: "",
      evidenceClaimId: "",
      evidenceDecisionId: "",
      createdAt: Timestamp.now(),
    });
  });

  await assertFails(getDoc(doc(
    playerContext().firestore(),
    "leagueContributions",
    "live-player-two",
  )));
  await assertSucceeds(getDoc(doc(
    adminContext().firestore(),
    "leagueContributions",
    "live-player-two",
  )));

  const firestore = adminContext().firestore();
  const snapshotId = "snapshot-one";
  const auditId = "snapshot-audit";
  const batch = writeBatch(firestore);
  batch.set(doc(firestore, "auditEvents", auditId), auditData({
    action: "leaderboard.snapshot.published",
    entityId: leagueId,
    summary: "Published player leaderboard snapshot",
  }));
  batch.set(doc(firestore, "leagueLeaderboardSnapshots", snapshotId), {
    leagueId,
    rulesVersion: "season-houses-v2",
    publicationType: "manual",
    replacesSnapshotId: "",
    publicationDateKey: "2026-08-04",
    players: [{ userId: "player-one", displayName: "player one", totalPoints: 10, rank: 1 }],
    houses: [{ houseId: house.id, houseName: house.data.name, totalPoints: 10, rank: 1 }],
    honours: { individual: [], houseChampions: [], houseOfChampions: null },
    publishedAt: serverTimestamp(),
    publishedBy: "admin-one",
    lastAuditId: auditId,
  });
  batch.update(doc(firestore, "leagues", leagueId), {
    publishedLeaderboardSnapshotId: snapshotId,
    publishedLeaderboardAt: serverTimestamp(),
    publishedLeaderboardBy: "admin-one",
    publishedLeaderboardRevision: 1,
    updatedAt: serverTimestamp(),
    updatedBy: "admin-one",
    lastAuditId: auditId,
  });
  await assertSucceeds(batch.commit());
  await assertSucceeds(getDoc(doc(
    playerContext().firestore(),
    "leagueLeaderboardSnapshots",
    snapshotId,
  )));
  await assertFails(updateDoc(doc(
    adminContext().firestore(),
    "leagueLeaderboardSnapshots",
    snapshotId,
  ), { publicationType: "automatic-fallback" }));
});

test("leaderboard snapshots still require the atomic league publication pointer", async () => {
  const leagueId = "season-v2";
  const house = await seedActiveEvidenceSeason();
  const firestore = adminContext().firestore();
  const snapshotId = "detached-snapshot";
  const auditId = "detached-snapshot-audit";
  const batch = writeBatch(firestore);
  batch.set(doc(firestore, "auditEvents", auditId), auditData({
    action: "leaderboard.snapshot.published",
    entityId: leagueId,
    summary: "Attempted detached leaderboard snapshot",
  }));
  batch.set(doc(firestore, "leagueLeaderboardSnapshots", snapshotId), {
    leagueId,
    rulesVersion: "season-houses-v2",
    publicationType: "manual",
    replacesSnapshotId: "",
    publicationDateKey: "2026-08-04",
    players: [{ userId: "player-one", displayName: "player one", totalPoints: 10, rank: 1 }],
    houses: [{ houseId: house.id, houseName: house.data.name, totalPoints: 10, rank: 1 }],
    honours: { individual: [], houseChampions: [], houseOfChampions: null },
    publishedAt: serverTimestamp(),
    publishedBy: "admin-one",
    lastAuditId: auditId,
  });

  await assertFails(batch.commit());
});



function ordinaryEntryData({
  userId = "player-one",
  category = "water",
  data = { amount: 500 },
  challengeDate = Timestamp.now(),
} = {}) {
  return {
    userId,
    category,
    data,
    source: "activity",
    sourceLeagueId: "",
    sourcePocketId: "",
    sourceRedemptionId: "",
    sourceCorrectionId: "",
    replacesEntryId: "",
    correctionRootEntryId: "",
    correctionSequence: 0,
    evidenceClaimIds: [],
    createdAt: Timestamp.now(),
    challengeDate,
  };
}

async function seedOrdinaryCorrectionSource(entryId = "correction-source") {
  const challengeDate = Timestamp.fromDate(new Date(new Date().setHours(0, 0, 0, 0)));
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    await setDoc(
      doc(context.firestore(), "challengeEntries", entryId),
      ordinaryEntryData({ challengeDate }),
    );
  });
  return challengeDate;
}

function commitOrdinaryCorrection({
  firestore,
  actorId = "admin-one",
  sourceEntryId = "correction-source",
  replacementEntryId = "correction-replacement",
  correctionId = "correction-one",
  auditId = "correction-audit",
  auditEntityId = correctionId,
  challengeDate,
} = {}) {
  const batch = writeBatch(firestore);
  const reason = "The recorded bottle amount was entered incorrectly.";

  batch.set(doc(firestore, "auditEvents", auditId), {
    actorId,
    action: "entry.correction.completed",
    entityType: "entryCorrection",
    entityId: auditEntityId,
    summary: "Created an audited factual entry replacement",
    details: { sourceEntryId, replacementEntryId },
    createdAt: serverTimestamp(),
  });
  batch.set(doc(firestore, "challengeEntries", replacementEntryId), {
    userId: "player-one",
    category: "water",
    data: { amount: 750 },
    source: "correction",
    sourceLeagueId: "",
    sourcePocketId: "",
    sourceRedemptionId: "",
    sourceCorrectionId: correctionId,
    replacesEntryId: sourceEntryId,
    correctionRootEntryId: sourceEntryId,
    correctionSequence: 1,
    evidenceClaimIds: [],
    createdAt: serverTimestamp(),
    challengeDate,
  });
  batch.set(doc(firestore, "entryCorrections", correctionId), {
    rootEntryId: sourceEntryId,
    sourceEntryId,
    replacementEntryId,
    userId: "player-one",
    category: "water",
    challengeDate,
    sequence: 1,
    reason,
    actorId,
    sourcePoints: 2,
    replacementPoints: 3,
    pointDelta: 1,
    affectedLeagueIds: [],
    sourceContributionIds: [],
    reversalContributionIds: [],
    replacementContributionIds: [],
    sourceClaimIds: [],
    replacementClaimIds: [],
    dailyClaimIds: [],
    status: "completed",
    lastAuditId: auditId,
    createdAt: serverTimestamp(),
  });
  batch.set(doc(firestore, "entryCorrectionHeads", sourceEntryId), {
    rootEntryId: sourceEntryId,
    currentEntryId: replacementEntryId,
    userId: "player-one",
    category: "water",
    sequence: 1,
    status: "active",
    lastCorrectionId: correctionId,
    lastAuditId: auditId,
    createdAt: serverTimestamp(),
    createdBy: actorId,
    updatedAt: serverTimestamp(),
    updatedBy: actorId,
  });
  return batch.commit();
}

test("Platform Administrators create an immutable audited factual replacement", async () => {
  const challengeDate = await seedOrdinaryCorrectionSource();
  const firestore = adminContext().firestore();

  await assertSucceeds(commitOrdinaryCorrection({ firestore, challengeDate }));
  const replacement = await getDoc(doc(firestore, "challengeEntries", "correction-replacement"));
  const head = await getDoc(doc(firestore, "entryCorrectionHeads", "correction-source"));
  assert.equal(replacement.data().source, "correction");
  assert.equal(head.data().currentEntryId, "correction-replacement");
});

test("trusted Platform Administrator corrections still require a matching immutable audit", async () => {
  const challengeDate = await seedOrdinaryCorrectionSource();
  await assertFails(commitOrdinaryCorrection({
    firestore: adminContext().firestore(),
    challengeDate,
    auditEntityId: "different-correction",
  }));
});

test("trusted correction contributions remain bound to the correction identity", async () => {
  const challengeDate = Timestamp.now();
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), "entryCorrections", "bound-correction"), {
      rootEntryId: "bound-source",
      sourceEntryId: "bound-source",
      replacementEntryId: "bound-replacement",
      userId: "player-one",
      category: "water",
      challengeDate,
      sequence: 1,
      reason: "Corrected an inaccurate water quantity.",
      actorId: "admin-one",
      sourcePoints: 2,
      replacementPoints: 3,
      pointDelta: 1,
      affectedLeagueIds: ["season-v2"],
      sourceContributionIds: ["source-contribution"],
      reversalContributionIds: ["bound-reversal"],
      replacementContributionIds: [],
      sourceClaimIds: [],
      replacementClaimIds: [],
      dailyClaimIds: [],
      status: "completed",
      lastAuditId: "seed-audit",
      createdAt: Timestamp.now(),
    });
  });

  await assertFails(setDoc(doc(
    adminContext().firestore(),
    "leagueContributions",
    "bound-reversal",
  ), {
    leagueId: "season-v2",
    entryId: "bound-source",
    userId: "player-two",
    displayName: "player two",
    avatarId: "legacy-trophy",
    houseId: "house-springbok",
    houseName: "House Springbok",
    houseEmblemId: "springbok",
    teamId: "house-springbok",
    teamName: "House Springbok",
    category: "water",
    scoreCategory: "water",
    pointGroup: "activity",
    challengeDate,
    activityPoints: -2,
    rulesVersion: "season-houses-v2",
    source: "correction-reversal",
    sourceRedemptionId: "",
    evidenceClaimId: "",
    evidenceDecisionId: "",
    correctionId: "bound-correction",
    correctionRole: "reversal",
    replacesContributionIds: ["source-contribution"],
    createdAt: serverTimestamp(),
  }));
});

test("daily evidence claims append corrected entries through the trusted correction link", async () => {
  const leagueId = "season-v2";
  const claimId = `${leagueId}_player-one_2026-08-04_water`;
  const challengeDate = Timestamp.fromDate(new Date("2026-08-04T10:00:00Z"));
  const house = houseData({ leagueId });
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    await setDoc(doc(firestore, "seasonEvidenceClaims", claimId), evidenceClaimData({
      leagueId,
      entryId: "daily-source",
      category: "water",
      claimType: "daily-bonus",
      challengeDate,
      house,
      pendingPoints: 0,
      bonusPointsAvailable: 2,
    }));
    await setDoc(doc(firestore, "entryCorrections", "daily-correction"), {
      rootEntryId: "daily-source",
      sourceEntryId: "daily-source",
      replacementEntryId: "daily-replacement",
      userId: "player-one",
      category: "water",
      challengeDate,
      sequence: 1,
      reason: "Corrected the recorded daily water quantity.",
      actorId: "admin-one",
      sourcePoints: 2,
      replacementPoints: 3,
      pointDelta: 1,
      affectedLeagueIds: [leagueId],
      sourceContributionIds: [],
      reversalContributionIds: [],
      replacementContributionIds: [],
      sourceClaimIds: [],
      replacementClaimIds: [],
      dailyClaimIds: [claimId],
      status: "completed",
      lastAuditId: "seed-audit",
      createdAt: Timestamp.now(),
    });
  });

  await assertSucceeds(updateDoc(doc(
    adminContext().firestore(),
    "seasonEvidenceClaims",
    claimId,
  ), {
    entryIds: ["daily-source", "daily-replacement"],
    correctionIds: ["daily-correction"],
    updatedAt: serverTimestamp(),
  }));
});



test("ordinary players cannot create correction records or replacement entries", async () => {
  const challengeDate = await seedOrdinaryCorrectionSource();
  await assertFails(commitOrdinaryCorrection({
    firestore: playerContext().firestore(),
    actorId: "player-one",
    challengeDate,
  }));
});

test("entry owners can read correction history but cannot rewrite it", async () => {
  const challengeDate = await seedOrdinaryCorrectionSource();
  await commitOrdinaryCorrection({
    firestore: adminContext().firestore(),
    challengeDate,
  });
  const firestore = playerContext().firestore();

  await assertSucceeds(getDoc(doc(firestore, "entryCorrectionHeads", "correction-source")));
  await assertSucceeds(getDoc(doc(firestore, "entryCorrections", "correction-one")));
  await assertFails(updateDoc(doc(firestore, "entryCorrectionHeads", "correction-source"), {
    currentEntryId: "correction-source",
  }));
});

test("an original entry cannot be deleted after a correction head exists", async () => {
  const challengeDate = await seedOrdinaryCorrectionSource();
  await commitOrdinaryCorrection({
    firestore: adminContext().firestore(),
    challengeDate,
  });

  await assertFails(deleteDoc(doc(
    playerContext().firestore(),
    "challengeEntries",
    "correction-source",
  )));
});

test("a qualifying Running correction atomically reverses points and supersedes proof", async () => {
  const leagueId = "season-v2";
  const house = await seedActiveEvidenceSeason({ includeSecondMember: false });
  const challengeDate = Timestamp.fromDate(new Date(new Date().setHours(0, 0, 0, 0)));
  const sourceEntryId = "run-source";
  const replacementEntryId = "run-replacement";
  const sourceContributionId = `${leagueId}_${sourceEntryId}`;
  const reversalContributionId = "run-correction_reversal_1";
  const replacementContributionId = `${leagueId}_${replacementEntryId}`;
  const oldClaimId = `${leagueId}_${sourceEntryId}`;
  const newClaimId = `${leagueId}_${replacementEntryId}`;
  const correctionId = "run-correction";
  const auditId = "run-correction-audit";
  const reason = "The original Running distance was entered incorrectly.";
  const oldClaim = evidenceClaimData({
    leagueId,
    entryId: sourceEntryId,
    challengeDate,
    house,
    pendingPoints: 18,
  });

  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    await setDoc(doc(firestore, "challengeEntries", sourceEntryId), {
      ...ordinaryEntryData({
        category: "running",
        data: runningEntryData(),
        challengeDate,
      }),
      evidenceClaimIds: [oldClaimId],
    });
    await setDoc(doc(firestore, "leagueContributions", sourceContributionId), {
      leagueId,
      entryId: sourceEntryId,
      userId: "player-one",
      displayName: "player one",
      avatarId: "legacy-trophy",
      houseId: house.id,
      houseName: house.data.name,
      houseEmblemId: house.data.emblemId,
      teamId: house.id,
      teamName: house.data.name,
      category: "running",
      scoreCategory: "cardio",
      pointGroup: "activity",
      challengeDate,
      activityPoints: 7,
      rulesVersion: "season-houses-v2",
      source: "activity",
      sourceRedemptionId: "",
      evidenceClaimId: "",
      evidenceDecisionId: "",
      createdAt: Timestamp.now(),
    });
    await setDoc(doc(firestore, "seasonEvidenceClaims", oldClaimId), oldClaim);
  });

  const firestore = adminContext().firestore();
  const batch = writeBatch(firestore);
  batch.set(doc(firestore, "auditEvents", auditId), {
    actorId: "admin-one",
    action: "entry.correction.completed",
    entityType: "entryCorrection",
    entityId: correctionId,
    summary: "Corrected a qualifying Running activity",
    details: { sourceEntryId, replacementEntryId },
    createdAt: serverTimestamp(),
  });
  batch.set(doc(firestore, "challengeEntries", replacementEntryId), {
    userId: "player-one",
    category: "running",
    data: { ...runningEntryData(), distance: 6, averagePaceSecondsPerKm: 300 },
    source: "correction",
    sourceLeagueId: "",
    sourcePocketId: "",
    sourceRedemptionId: "",
    sourceCorrectionId: correctionId,
    replacesEntryId: sourceEntryId,
    correctionRootEntryId: sourceEntryId,
    correctionSequence: 1,
    evidenceClaimIds: [newClaimId],
    createdAt: serverTimestamp(),
    challengeDate,
  });
  batch.set(doc(firestore, "leagueContributions", reversalContributionId), {
    leagueId,
    entryId: sourceEntryId,
    userId: "player-one",
    displayName: "player one",
    avatarId: "legacy-trophy",
    houseId: house.id,
    houseName: house.data.name,
    houseEmblemId: house.data.emblemId,
    teamId: house.id,
    teamName: house.data.name,
    category: "running",
    scoreCategory: "cardio",
    pointGroup: "activity",
    challengeDate,
    activityPoints: -7,
    rulesVersion: "season-houses-v2",
    source: "correction-reversal",
    sourceRedemptionId: "",
    evidenceClaimId: "",
    evidenceDecisionId: "",
    correctionId,
    correctionRole: "reversal",
    replacesContributionIds: [sourceContributionId],
    createdAt: serverTimestamp(),
  });
  batch.set(doc(firestore, "leagueContributions", replacementContributionId), {
    leagueId,
    entryId: replacementEntryId,
    userId: "player-one",
    displayName: "player one",
    avatarId: "legacy-trophy",
    houseId: house.id,
    houseName: house.data.name,
    houseEmblemId: house.data.emblemId,
    teamId: house.id,
    teamName: house.data.name,
    category: "running",
    scoreCategory: "cardio",
    pointGroup: "activity",
    challengeDate,
    activityPoints: 7,
    rulesVersion: "season-houses-v2",
    source: "correction-replacement",
    sourceRedemptionId: "",
    evidenceClaimId: "",
    evidenceDecisionId: "",
    correctionId,
    correctionRole: "replacement",
    replacesContributionIds: [],
    createdAt: serverTimestamp(),
  });
  batch.set(doc(firestore, "seasonEvidenceClaims", newClaimId), {
    ...evidenceClaimData({
      leagueId,
      entryId: replacementEntryId,
      challengeDate,
      house,
      pendingPoints: 23,
    }),
    correctionId,
    replacesClaimId: oldClaimId,
    correctionIds: [correctionId],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  batch.update(doc(firestore, "seasonEvidenceClaims", oldClaimId), {
    status: "superseded",
    reviewedAt: serverTimestamp(),
    reviewedBy: "admin-one",
    reviewReason: reason,
    supersededByClaimId: newClaimId,
    correctionId,
    correctionIds: [correctionId],
    updatedAt: serverTimestamp(),
  });
  batch.set(doc(firestore, "entryCorrections", correctionId), {
    rootEntryId: sourceEntryId,
    sourceEntryId,
    replacementEntryId,
    userId: "player-one",
    category: "running",
    challengeDate,
    sequence: 1,
    reason,
    actorId: "admin-one",
    sourcePoints: 25,
    replacementPoints: 30,
    pointDelta: 5,
    affectedLeagueIds: [leagueId],
    sourceContributionIds: [sourceContributionId],
    reversalContributionIds: [reversalContributionId],
    replacementContributionIds: [replacementContributionId],
    sourceClaimIds: [oldClaimId],
    replacementClaimIds: [newClaimId],
    dailyClaimIds: [],
    status: "completed",
    lastAuditId: auditId,
    createdAt: serverTimestamp(),
  });
  batch.set(doc(firestore, "entryCorrectionHeads", sourceEntryId), {
    rootEntryId: sourceEntryId,
    currentEntryId: replacementEntryId,
    userId: "player-one",
    category: "running",
    sequence: 1,
    status: "active",
    lastCorrectionId: correctionId,
    lastAuditId: auditId,
    createdAt: serverTimestamp(),
    createdBy: "admin-one",
    updatedAt: serverTimestamp(),
    updatedBy: "admin-one",
  });

  await assertSucceeds(batch.commit());
  const oldClaimAfter = await getDoc(doc(firestore, "seasonEvidenceClaims", oldClaimId));
  assert.equal(oldClaimAfter.data().status, "superseded");
  assert.equal(oldClaimAfter.data().supersededByClaimId, newClaimId);
});

test("trusted season run status is visible only to Platform and season administrators", async () => {
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    await setDoc(doc(firestore, "leagues", "trusted-season"), seasonDataV2({
      status: "active",
      actorId: "player-one",
      participantCount: 2,
      chaosStatus: "activated",
      active: true,
    }));
    await setDoc(doc(firestore, "seasonTrustedRuns", "trusted-run-one"), {
      leagueId: "trusted-season",
      leagueName: "Trusted Season",
      modelVersion: "trusted-season-v1",
      mode: "publish",
      status: "published",
      fingerprint: "abc12345",
      snapshotId: "snapshot-one",
      actorId: "admin-one",
      sourceCounts: { memberships: 2, contributions: 4 },
      issueCounts: { blocking: 0, warning: 0, information: 0 },
      snapshotComparison: { status: "matching", playerDifferenceCount: 0, houseDifferenceCount: 0 },
      issueSample: [],
      startedAt: Timestamp.now(),
      completedAt: Timestamp.now(),
      createdAt: Timestamp.now(),
      lastAuditId: "trusted-audit",
    });
  });

  await assertSucceeds(
    getDoc(doc(adminContext().firestore(), "seasonTrustedRuns", "trusted-run-one")),
  );
  await assertSucceeds(
    getDoc(doc(playerContext("player-one").firestore(), "seasonTrustedRuns", "trusted-run-one")),
  );
  await assertFails(
    getDoc(doc(playerContext("player-two").firestore(), "seasonTrustedRuns", "trusted-run-one")),
  );
});

test("trusted season run records cannot be written by any client role", async () => {
  const payload = {
    leagueId: "trusted-season",
    leagueName: "Trusted Season",
    modelVersion: "trusted-season-v1",
    mode: "dry-run",
    status: "healthy",
    fingerprint: "abc12345",
    snapshotId: "",
    actorId: "admin-one",
    sourceCounts: {},
    issueCounts: { blocking: 0, warning: 0, information: 0 },
    snapshotComparison: { status: "missing", playerDifferenceCount: 0, houseDifferenceCount: 0 },
    issueSample: [],
    startedAt: Timestamp.now(),
    completedAt: Timestamp.now(),
    createdAt: Timestamp.now(),
    lastAuditId: "",
  };

  await assertFails(
    setDoc(doc(adminContext().firestore(), "seasonTrustedRuns", "client-created"), payload),
  );
});

function powerPlayAssignmentData({
  leagueId = "power-season",
  weekKey = "week-01",
  weekIndex = 1,
  startDate,
  endDate,
  powerPlayId = "base-water",
  powerPlayName = "Mythic water 1",
  categories = ["water"],
  multiplier = 2,
  selectionSequence = 1,
  previousPowerPlayIds = [],
  redrawCount = 0,
  lastSelectionReason = "",
  correctedAt = null,
  correctedBy = "",
  correctionReason = "",
  correctionCount = 0,
  actorId = "admin-one",
  auditId = "power-play-audit",
} = {}) {
  return {
    leagueId,
    leagueName: "Legacy House Season",
    weekKey,
    weekIndex,
    startDate,
    endDate,
    powerPlayId,
    powerPlayName,
    multiplier,
    categories,
    selectionSequence,
    previousPowerPlayIds,
    redrawCount,
    lastSelectionReason,
    selectedAt: serverTimestamp(),
    selectedBy: actorId,
    correctedAt,
    correctedBy,
    correctionReason,
    correctionCount,
    lastAuditId: auditId,
  };
}

test("season administrators can save a controlled themed Power Play pool in draft", async () => {
  const league = seasonDataV3();
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), "leagues", "power-season"), league);
  });

  const firestore = adminContext().firestore();
  const batch = writeBatch(firestore);
  const auditId = "power-pool-audit";
  const ruleset = currentSeasonRulesetV3();
  ruleset.powerPlayPolicy.powerPlays[0] = {
    ...ruleset.powerPlayPolicy.powerPlays[0],
    name: "Release the Kraken",
    normalizedName: "release the kraken",
  };
  ruleset.powerPlayPolicy.powerPlayDefinitions["base-water"] = {
    ...ruleset.powerPlayPolicy.powerPlayDefinitions["base-water"],
    name: "Release the Kraken",
  };
  batch.set(doc(firestore, "auditEvents", auditId), {
    actorId: "admin-one",
    action: "power-play.pool-updated",
    entityType: "league",
    entityId: "power-season",
    summary: "Updated the themed Power Play pool",
    details: {},
    createdAt: serverTimestamp(),
  });
  batch.update(doc(firestore, "leagues", "power-season"), {
    ruleset,
    updatedAt: serverTimestamp(),
    updatedBy: "admin-one",
    lastAuditId: auditId,
  });
  await assertSucceeds(batch.commit());

  await assertFails(
    updateDoc(doc(playerContext().firestore(), "leagues", "power-season"), {
      ruleset,
      updatedAt: serverTimestamp(),
      updatedBy: "player-one",
      lastAuditId: auditId,
    }),
  );
});

test("v4 draft Power Play pool maintenance stays below Rules evaluation", async () => {
  const league = seasonDataV4();
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), "leagues", "power-season-v4"), league);
  });

  const firestore = adminContext().firestore();
  const batch = writeBatch(firestore);
  const auditId = "power-pool-v4-audit";
  const ruleset = currentSeasonRulesetV4();
  ruleset.powerPlayPolicy.powerPlays[0] = {
    ...ruleset.powerPlayPolicy.powerPlays[0],
    name: "Forge the Flood",
    normalizedName: "forge the flood",
  };
  ruleset.powerPlayPolicy.powerPlayDefinitions["base-water"] = {
    ...ruleset.powerPlayPolicy.powerPlayDefinitions["base-water"],
    name: "Forge the Flood",
  };
  batch.set(doc(firestore, "auditEvents", auditId), {
    actorId: "admin-one",
    action: "power-play.pool-updated",
    entityType: "league",
    entityId: "power-season-v4",
    summary: "Updated the v4 themed Power Play pool",
    details: {},
    createdAt: serverTimestamp(),
  });
  batch.update(doc(firestore, "leagues", "power-season-v4"), {
    ruleset,
    updatedAt: serverTimestamp(),
    updatedBy: "admin-one",
    lastAuditId: auditId,
  });
  await assertSucceeds(batch.commit());

  await assertFails(
    updateDoc(doc(adminContext().firestore(), "leagues", "power-season-v4"), {
      ruleset: { ...ruleset, version: "season-houses-v3" },
      updatedAt: serverTimestamp(),
      updatedBy: "admin-one",
      lastAuditId: auditId,
    }),
  );
});


test("existing v3 draft-to-registration remains valid under the shared readiness check", async () => {
  const league = seasonDataV3({ inviteCode: "REGV3AAA" });
  league.houseCount = 8;

  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    await setDoc(doc(firestore, "leagues", "registration-season-v3"), league);
    await setDoc(doc(firestore, "leagueInvites", "REGV3AAA"), {
      leagueId: "registration-season-v3",
      leagueName: league.name,
      status: "closed",
      createdAt: Timestamp.now(),
      createdBy: "admin-one",
      updatedAt: Timestamp.now(),
      updatedBy: "admin-one",
    });
  });

  const firestore = adminContext().firestore();
  const auditId = "registration-v3-audit";
  const batch = writeBatch(firestore);
  batch.set(doc(firestore, "auditEvents", auditId), {
    actorId: "admin-one",
    action: "league.registration",
    entityType: "league",
    entityId: "registration-season-v3",
    summary: "Changed the v3 season from draft to registration",
    details: { previousStatus: "draft", nextStatus: "registration" },
    createdAt: serverTimestamp(),
  });
  batch.update(doc(firestore, "leagues", "registration-season-v3"), {
    status: "registration",
    updatedAt: serverTimestamp(),
    updatedBy: "admin-one",
    activatedAt: null,
    completedAt: null,
    archivedAt: null,
    lastAuditId: auditId,
  });
  batch.update(doc(firestore, "leagueInvites", "REGV3AAA"), {
    status: "active",
    updatedAt: serverTimestamp(),
    updatedBy: "admin-one",
  });

  await assertSucceeds(batch.commit());
});

test("v4 draft-to-registration stays below Rules evaluation", async () => {
  const league = seasonDataV4({ inviteCode: "REGV4AAA" });
  league.houseCount = 8;

  const invalidLeague = seasonDataV4({ inviteCode: "BADV4AAA" });
  invalidLeague.houseCount = 8;
  invalidLeague.ruleset = currentSeasonRulesetV4();
  invalidLeague.ruleset.powerPlayPolicy.noRepeatWithinSeason = false;

  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    await setDoc(doc(firestore, "leagues", "registration-season-v4"), league);
    await setDoc(doc(firestore, "leagueInvites", "REGV4AAA"), {
      leagueId: "registration-season-v4",
      leagueName: league.name,
      status: "closed",
      createdAt: Timestamp.now(),
      createdBy: "admin-one",
      updatedAt: Timestamp.now(),
      updatedBy: "admin-one",
    });
    await setDoc(doc(firestore, "leagues", "registration-season-v4-invalid"), invalidLeague);
    await setDoc(doc(firestore, "leagueInvites", "BADV4AAA"), {
      leagueId: "registration-season-v4-invalid",
      leagueName: invalidLeague.name,
      status: "closed",
      createdAt: Timestamp.now(),
      createdBy: "admin-one",
      updatedAt: Timestamp.now(),
      updatedBy: "admin-one",
    });
  });

  const firestore = adminContext().firestore();
  const auditId = "registration-v4-audit";
  const batch = writeBatch(firestore);
  batch.set(doc(firestore, "auditEvents", auditId), {
    actorId: "admin-one",
    action: "league.registration",
    entityType: "league",
    entityId: "registration-season-v4",
    summary: "Changed the v4 season from draft to registration",
    details: { previousStatus: "draft", nextStatus: "registration" },
    createdAt: serverTimestamp(),
  });
  batch.update(doc(firestore, "leagues", "registration-season-v4"), {
    status: "registration",
    updatedAt: serverTimestamp(),
    updatedBy: "admin-one",
    activatedAt: null,
    completedAt: null,
    archivedAt: null,
    lastAuditId: auditId,
  });
  batch.update(doc(firestore, "leagueInvites", "REGV4AAA"), {
    status: "active",
    updatedAt: serverTimestamp(),
    updatedBy: "admin-one",
  });
  await assertSucceeds(batch.commit());

  const invalidAuditId = "registration-v4-invalid-audit";
  const invalidBatch = writeBatch(firestore);
  invalidBatch.set(doc(firestore, "auditEvents", invalidAuditId), {
    actorId: "admin-one",
    action: "league.registration",
    entityType: "league",
    entityId: "registration-season-v4-invalid",
    summary: "Attempted registration with an invalid v4 Power Play policy",
    details: { previousStatus: "draft", nextStatus: "registration" },
    createdAt: serverTimestamp(),
  });
  invalidBatch.update(doc(firestore, "leagues", "registration-season-v4-invalid"), {
    status: "registration",
    updatedAt: serverTimestamp(),
    updatedBy: "admin-one",
    activatedAt: null,
    completedAt: null,
    archivedAt: null,
    lastAuditId: invalidAuditId,
  });
  invalidBatch.update(doc(firestore, "leagueInvites", "BADV4AAA"), {
    status: "active",
    updatedAt: serverTimestamp(),
    updatedBy: "admin-one",
  });
  await assertFails(invalidBatch.commit());
});

test("weekly Power Play selection is atomic and cannot reuse a selected play", async () => {
  const league = seasonDataV3({ status: "active", participantCount: 2, chaosStatus: "activated", active: true });
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    await setDoc(doc(firestore, "leagues", "power-season"), league);
    const house = houseData({ leagueId: "power-season" });
    await setDoc(doc(firestore, "leagueMemberships", "power-season_player-one"), membershipData({
      leagueId: "power-season",
      status: "active",
      house,
    }));
  });

  const firestore = adminContext().firestore();
  const auditId = "power-select-audit";
  const batch = writeBatch(firestore);
  batch.set(doc(firestore, "auditEvents", auditId), {
    actorId: "admin-one",
    action: "power-play.week-selected",
    entityType: "league",
    entityId: "power-season",
    summary: "Selected Release the Kraken",
    details: {},
    createdAt: serverTimestamp(),
  });
  batch.set(
    doc(firestore, "leaguePowerPlayWeeks", "power-season_week-01"),
    powerPlayAssignmentData({
      startDate: league.startDate,
      endDate: Timestamp.fromMillis(league.startDate.toMillis() + 6 * 24 * 60 * 60 * 1000),
      powerPlayName: "Mythic water 1",
      auditId,
    }),
  );
  batch.update(doc(firestore, "leagues", "power-season"), {
    powerPlayState: {
      usedPowerPlayIds: ["base-water"],
      selectionCount: 1,
      lastWeekKey: "week-01",
      lastPowerPlayId: "base-water",
      lastSelectionAt: serverTimestamp(),
      lastSelectionBy: "admin-one",
    },
    updatedAt: serverTimestamp(),
    updatedBy: "admin-one",
    lastAuditId: auditId,
  });
  await assertSucceeds(batch.commit());

  const duplicateAuditId = "power-duplicate-audit";
  const duplicate = writeBatch(firestore);
  duplicate.set(doc(firestore, "auditEvents", duplicateAuditId), {
    actorId: "admin-one",
    action: "power-play.week-selected",
    entityType: "league",
    entityId: "power-season",
    summary: "Tried to repeat a Power Play",
    details: {},
    createdAt: serverTimestamp(),
  });
  duplicate.set(
    doc(firestore, "leaguePowerPlayWeeks", "power-season_week-02"),
    powerPlayAssignmentData({
      weekKey: "week-02",
      weekIndex: 2,
      startDate: Timestamp.fromMillis(league.startDate.toMillis() + 7 * 24 * 60 * 60 * 1000),
      endDate: Timestamp.fromMillis(league.startDate.toMillis() + 13 * 24 * 60 * 60 * 1000),
      powerPlayId: "base-water",
      powerPlayName: "Mythic water 1",
      selectionSequence: 2,
      auditId: duplicateAuditId,
    }),
  );
  duplicate.update(doc(firestore, "leagues", "power-season"), {
    powerPlayState: {
      usedPowerPlayIds: ["base-water", "base-water"],
      selectionCount: 2,
      lastWeekKey: "week-02",
      lastPowerPlayId: "base-water",
      lastSelectionAt: serverTimestamp(),
      lastSelectionBy: "admin-one",
    },
    updatedAt: serverTimestamp(),
    updatedBy: "admin-one",
    lastAuditId: duplicateAuditId,
  });
  await assertFails(duplicate.commit());

  const tamperedAuditId = "power-tampered-audit";
  const tampered = writeBatch(firestore);
  tampered.set(doc(firestore, "auditEvents", tamperedAuditId), {
    actorId: "admin-one",
    action: "power-play.week-selected",
    entityType: "league",
    entityId: "power-season",
    summary: "Tried to change a frozen Power Play multiplier",
    details: {},
    createdAt: serverTimestamp(),
  });
  tampered.set(
    doc(firestore, "leaguePowerPlayWeeks", "power-season_week-02"),
    powerPlayAssignmentData({
      weekKey: "week-02",
      weekIndex: 2,
      startDate: Timestamp.fromMillis(league.startDate.toMillis() + 7 * 24 * 60 * 60 * 1000),
      endDate: Timestamp.fromMillis(league.startDate.toMillis() + 13 * 24 * 60 * 60 * 1000),
      powerPlayId: "base-fruit",
      powerPlayName: "Mythic fruit 2",
      multiplier: 3,
      categories: ["fruit"],
      selectionSequence: 2,
      auditId: tamperedAuditId,
    }),
  );
  tampered.update(doc(firestore, "leagues", "power-season"), {
    powerPlayState: {
      usedPowerPlayIds: ["base-water", "base-fruit"],
      selectionCount: 2,
      lastWeekKey: "week-02",
      lastPowerPlayId: "base-fruit",
      lastSelectionAt: serverTimestamp(),
      lastSelectionBy: "admin-one",
    },
    updatedAt: serverTimestamp(),
    updatedBy: "admin-one",
    lastAuditId: tamperedAuditId,
  });
  await assertFails(tampered.commit());
});

test("v4 first weekly Power Play selection stays below Rules evaluation", async () => {
  const league = seasonDataV4({ status: "active", participantCount: 2, chaosStatus: "activated", active: true });
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    await setDoc(doc(firestore, "leagues", "power-season-v4"), league);
  });

  const firestore = adminContext().firestore();
  const auditId = "power-v4-select-audit";
  const batch = writeBatch(firestore);
  batch.set(doc(firestore, "auditEvents", auditId), {
    actorId: "admin-one",
    action: "power-play.week-selected",
    entityType: "league",
    entityId: "power-season-v4",
    summary: "Selected the first v4 weekly Power Play",
    details: {},
    createdAt: serverTimestamp(),
  });
  batch.set(
    doc(firestore, "leaguePowerPlayWeeks", "power-season-v4_week-01"),
    powerPlayAssignmentData({
      leagueId: "power-season-v4",
      startDate: league.startDate,
      endDate: Timestamp.fromMillis(league.startDate.toMillis() + 6 * 24 * 60 * 60 * 1000),
      powerPlayName: "Mythic water 1",
      auditId,
    }),
  );
  batch.update(doc(firestore, "leagues", "power-season-v4"), {
    powerPlayState: {
      usedPowerPlayIds: ["base-water"],
      selectionCount: 1,
      lastWeekKey: "week-01",
      lastPowerPlayId: "base-water",
      lastSelectionAt: serverTimestamp(),
      lastSelectionBy: "admin-one",
    },
    updatedAt: serverTimestamp(),
    updatedBy: "admin-one",
    lastAuditId: auditId,
  });
  await assertSucceeds(batch.commit());
});

test("v4 pre-week Power Play redraw stays below Rules evaluation", async () => {
  const league = seasonDataV4({ status: "registration", participantCount: 2 });
  league.powerPlayState = {
    usedPowerPlayIds: ["base-water"],
    selectionCount: 1,
    lastWeekKey: "week-01",
    lastPowerPlayId: "base-water",
    lastSelectionAt: Timestamp.now(),
    lastSelectionBy: "admin-one",
  };
  const assignment = {
    ...powerPlayAssignmentData({
      leagueId: "power-redraw-v4",
      startDate: league.startDate,
      endDate: Timestamp.fromMillis(league.startDate.toMillis() + 6 * 24 * 60 * 60 * 1000),
      powerPlayName: "Mythic water 1",
      auditId: "power-v4-select-audit",
    }),
    selectedAt: Timestamp.now(),
  };

  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    await setDoc(doc(firestore, "leagues", "power-redraw-v4"), league);
    await setDoc(doc(firestore, "leaguePowerPlayWeeks", "power-redraw-v4_week-01"), assignment);
  });

  const firestore = adminContext().firestore();
  const auditId = "power-v4-redraw-audit";
  const batch = writeBatch(firestore);
  batch.set(doc(firestore, "auditEvents", auditId), {
    actorId: "admin-one",
    action: "power-play.week-redrawn",
    entityType: "league",
    entityId: "power-redraw-v4",
    summary: "Redrew the v4 Power Play before its week started",
    details: {},
    createdAt: serverTimestamp(),
  });
  batch.update(doc(firestore, "leaguePowerPlayWeeks", "power-redraw-v4_week-01"), {
    powerPlayId: "base-fruit",
    powerPlayName: "Mythic fruit 2",
    multiplier: 2,
    categories: ["fruit"],
    selectionSequence: 2,
    previousPowerPlayIds: ["base-water"],
    redrawCount: 1,
    lastSelectionReason: "Administrator redraw before the official week began.",
    selectedAt: serverTimestamp(),
    selectedBy: "admin-one",
    lastAuditId: auditId,
  });
  batch.update(doc(firestore, "leagues", "power-redraw-v4"), {
    powerPlayState: {
      usedPowerPlayIds: ["base-water", "base-fruit"],
      selectionCount: 2,
      lastWeekKey: "week-01",
      lastPowerPlayId: "base-fruit",
      lastSelectionAt: serverTimestamp(),
      lastSelectionBy: "admin-one",
    },
    updatedAt: serverTimestamp(),
    updatedBy: "admin-one",
    lastAuditId: auditId,
  });
  await assertSucceeds(batch.commit());
});

test("players see only Power Plays whose official week has started", async () => {
  const league = seasonDataV3({ status: "active", participantCount: 1, chaosStatus: "activated", active: true });
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    await setDoc(doc(firestore, "leagues", "power-season"), league);
    const house = houseData({ leagueId: "power-season" });
    await setDoc(doc(firestore, "leagueMemberships", "power-season_player-one"), membershipData({
      leagueId: "power-season",
      status: "active",
      house,
    }));
    await setDoc(doc(firestore, "leaguePowerPlayWeeks", "power-season_week-01"), {
      ...powerPlayAssignmentData({
        startDate: league.startDate,
        endDate: Timestamp.fromMillis(league.startDate.toMillis() + 6 * 24 * 60 * 60 * 1000),
      }),
      selectedAt: Timestamp.now(),
    });
    await setDoc(doc(firestore, "leaguePowerPlayWeeks", "power-season_week-02"), {
      ...powerPlayAssignmentData({
        weekKey: "week-02",
        weekIndex: 2,
        startDate: Timestamp.fromMillis(Date.now() + 3 * 24 * 60 * 60 * 1000),
        endDate: Timestamp.fromMillis(Date.now() + 9 * 24 * 60 * 60 * 1000),
        powerPlayId: "base-fruit",
        powerPlayName: "Mythic fruit 2",
        categories: ["fruit"],
        selectionSequence: 2,
      }),
      selectedAt: Timestamp.now(),
    });
  });

  await assertSucceeds(
    getDoc(doc(playerContext().firestore(), "leaguePowerPlayWeeks", "power-season_week-01")),
  );
  await assertFails(
    getDoc(doc(playerContext().firestore(), "leaguePowerPlayWeeks", "power-season_week-02")),
  );
  await assertSucceeds(
    getDoc(doc(adminContext().firestore(), "leaguePowerPlayWeeks", "power-season_week-02")),
  );
});

test("only a Platform Administrator can correct a locked Power Play assignment", async () => {
  const league = seasonDataV3({ status: "active", participantCount: 1, chaosStatus: "activated", active: true });
  league.powerPlayState = {
    usedPowerPlayIds: ["base-water"],
    selectionCount: 1,
    lastWeekKey: "week-01",
    lastPowerPlayId: "base-water",
    lastSelectionAt: Timestamp.now(),
    lastSelectionBy: "admin-one",
  };
  const assignment = {
    ...powerPlayAssignmentData({
      startDate: league.startDate,
      endDate: Timestamp.fromMillis(league.startDate.toMillis() + 6 * 24 * 60 * 60 * 1000),
    }),
    selectedAt: Timestamp.now(),
  };
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    await setDoc(doc(firestore, "leagues", "power-season"), league);
    await setDoc(doc(firestore, "leaguePowerPlayWeeks", "power-season_week-01"), assignment);
  });

  const firestore = adminContext().firestore();
  const auditId = "power-correction-audit";
  const batch = writeBatch(firestore);
  batch.set(doc(firestore, "auditEvents", auditId), {
    actorId: "admin-one",
    action: "power-play.assignment-corrected",
    entityType: "league",
    entityId: "power-season",
    summary: "Corrected a locked Power Play",
    details: {},
    createdAt: serverTimestamp(),
  });
  batch.update(doc(firestore, "leaguePowerPlayWeeks", "power-season_week-01"), {
    powerPlayId: "base-fruit",
    powerPlayName: "Mythic fruit 2",
    multiplier: 2,
    categories: ["fruit"],
    selectionSequence: 2,
    previousPowerPlayIds: ["base-water"],
    correctedAt: serverTimestamp(),
    correctedBy: "admin-one",
    correctionReason: "The original category was recorded incorrectly.",
    correctionCount: 1,
    lastAuditId: auditId,
  });
  batch.update(doc(firestore, "leagues", "power-season"), {
    powerPlayState: {
      usedPowerPlayIds: ["base-water", "base-fruit"],
      selectionCount: 2,
      lastWeekKey: "week-01",
      lastPowerPlayId: "base-fruit",
      lastSelectionAt: serverTimestamp(),
      lastSelectionBy: "admin-one",
    },
    updatedAt: serverTimestamp(),
    updatedBy: "admin-one",
    lastAuditId: auditId,
  });
  await assertSucceeds(batch.commit());

  await assertFails(
    updateDoc(
      doc(playerContext().firestore(), "leaguePowerPlayWeeks", "power-season_week-01"),
      { powerPlayName: "Player rewrite" },
    ),
  );
});

test("v4 locked Platform Administrator Power Play correction stays below Rules evaluation", async () => {
  const leagueId = "power-correction-v4";
  const league = seasonDataV4({ status: "active", participantCount: 1, chaosStatus: "activated", active: true });
  league.powerPlayState = {
    usedPowerPlayIds: ["base-water"],
    selectionCount: 1,
    lastWeekKey: "week-01",
    lastPowerPlayId: "base-water",
    lastSelectionAt: Timestamp.now(),
    lastSelectionBy: "admin-one",
  };
  const assignment = {
    ...powerPlayAssignmentData({
      leagueId,
      startDate: league.startDate,
      endDate: Timestamp.fromMillis(league.startDate.toMillis() + 6 * 24 * 60 * 60 * 1000),
      auditId: "power-v4-select-audit",
    }),
    selectedAt: Timestamp.now(),
  };

  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    await setDoc(doc(firestore, "leagues", leagueId), league);
    await setDoc(doc(firestore, "leaguePowerPlayWeeks", `${leagueId}_week-01`), assignment);
  });

  const firestore = adminContext().firestore();
  const auditId = "power-v4-correction-audit";
  const batch = writeBatch(firestore);
  batch.set(doc(firestore, "auditEvents", auditId), {
    actorId: "admin-one",
    action: "power-play.assignment-corrected",
    entityType: "league",
    entityId: leagueId,
    summary: "Corrected a locked v4 Power Play",
    details: {},
    createdAt: serverTimestamp(),
  });
  batch.update(doc(firestore, "leaguePowerPlayWeeks", `${leagueId}_week-01`), {
    powerPlayId: "base-fruit",
    powerPlayName: "Mythic fruit 2",
    multiplier: 2,
    categories: ["fruit"],
    selectionSequence: 2,
    previousPowerPlayIds: ["base-water"],
    correctedAt: serverTimestamp(),
    correctedBy: "admin-one",
    correctionReason: "The original category was recorded incorrectly.",
    correctionCount: 1,
    lastAuditId: auditId,
  });
  batch.update(doc(firestore, "leagues", leagueId), {
    powerPlayState: {
      usedPowerPlayIds: ["base-water", "base-fruit"],
      selectionCount: 2,
      lastWeekKey: "week-01",
      lastPowerPlayId: "base-fruit",
      lastSelectionAt: serverTimestamp(),
      lastSelectionBy: "admin-one",
    },
    updatedAt: serverTimestamp(),
    updatedBy: "admin-one",
    lastAuditId: auditId,
  });
  await assertSucceeds(batch.commit());
});
test("Platform Administrators may hard-delete an unused draft House only with its immutable audit", async () => {
  const leagueId = "draft-house-delete-season";
  const house = houseData({ leagueId, id: "draft-house-delete-one" });
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    await setDoc(doc(firestore, "leagues", leagueId), seasonData({ inviteCode: "DRAFTD01" }));
    await setDoc(doc(firestore, "leagueHouses", house.id), house.data);
  });

  const noAudit = adminContext().firestore();
  await assertFails(deleteDoc(doc(noAudit, "leagueHouses", house.id)));

  const firestore = adminContext().firestore();
  const batch = writeBatch(firestore);
  batch.set(doc(firestore, "auditEvents", `draft-house-delete_${house.id}`), {
    actorId: "admin-one",
    action: "house.draft-deleted",
    entityType: "league",
    entityId: leagueId,
    summary: "Permanently deleted unused draft House",
    details: { houseId: house.id, houseName: house.data.name },
    createdAt: serverTimestamp(),
  });
  batch.delete(doc(firestore, "leagueHouses", house.id));
  await assertSucceeds(batch.commit());
});

test("League Administrators cannot hard-delete draft Houses", async () => {
  const leagueId = "league-admin-delete-denied";
  const house = houseData({ leagueId, id: "league-admin-delete-house" });
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    await setDoc(doc(firestore, "leagues", leagueId), seasonData({
      actorId: "player-two",
      inviteCode: "DRAFTD02",
    }));
    await setDoc(doc(firestore, "leagueHouses", house.id), {
      ...house.data,
      createdBy: "player-two",
      updatedBy: "player-two",
    });
  });

  const firestore = playerContext("player-two").firestore();
  const batch = writeBatch(firestore);
  batch.set(doc(firestore, "auditEvents", `draft-house-delete_${house.id}`), {
    actorId: "player-two",
    action: "house.draft-deleted",
    entityType: "league",
    entityId: leagueId,
    summary: "Attempted draft House deletion",
    details: { houseId: house.id },
    createdAt: serverTimestamp(),
  });
  batch.delete(doc(firestore, "leagueHouses", house.id));
  await assertFails(batch.commit());
});

test("Platform Administrators may atomically delete an unused draft season, Houses and invite", async () => {
  const leagueId = "draft-season-delete-one";
  const inviteCode = "DRAFTD03";
  const firstHouse = houseData({ leagueId, id: "draft-season-house-a" });
  const secondHouse = houseData({ leagueId, id: "draft-season-house-b", name: "House Lion" });
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    await setDoc(doc(firestore, "leagues", leagueId), seasonData({ inviteCode }));
    await setDoc(doc(firestore, "leagueInvites", inviteCode), {
      leagueId,
      leagueName: "Legacy House Season",
      status: "closed",
      createdAt: Timestamp.now(),
      createdBy: "admin-one",
      updatedAt: Timestamp.now(),
      updatedBy: "admin-one",
    });
    await setDoc(doc(firestore, "leagueHouses", firstHouse.id), firstHouse.data);
    await setDoc(doc(firestore, "leagueHouses", secondHouse.id), secondHouse.data);
  });

  const firestore = adminContext().firestore();
  const batch = writeBatch(firestore);
  batch.set(doc(firestore, "auditEvents", `draft-season-delete_${leagueId}`), {
    actorId: "admin-one",
    action: "league.draft-deleted",
    entityType: "league",
    entityId: leagueId,
    summary: "Permanently deleted unused draft season",
    details: { inviteCode, houseCount: 2 },
    createdAt: serverTimestamp(),
  });
  batch.delete(doc(firestore, "leagueHouses", firstHouse.id));
  batch.delete(doc(firestore, "leagueHouses", secondHouse.id));
  batch.delete(doc(firestore, "leagueInvites", inviteCode));
  batch.delete(doc(firestore, "leagues", leagueId));
  await assertSucceeds(batch.commit());
});

test("draft season deletion requires invitation cleanup in the same atomic batch", async () => {
  const leagueId = "draft-season-delete-incomplete";
  const inviteCode = "DRAFTD04";
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    await setDoc(doc(firestore, "leagues", leagueId), seasonData({ inviteCode }));
    await setDoc(doc(firestore, "leagueInvites", inviteCode), {
      leagueId,
      leagueName: "Legacy House Season",
      status: "closed",
      createdAt: Timestamp.now(),
      createdBy: "admin-one",
      updatedAt: Timestamp.now(),
      updatedBy: "admin-one",
    });
  });

  const firestore = adminContext().firestore();
  const batch = writeBatch(firestore);
  batch.set(doc(firestore, "auditEvents", `draft-season-delete_${leagueId}`), {
    actorId: "admin-one",
    action: "league.draft-deleted",
    entityType: "league",
    entityId: leagueId,
    summary: "Incomplete draft deletion",
    details: { inviteCode, houseCount: 0 },
    createdAt: serverTimestamp(),
  });
  batch.delete(doc(firestore, "leagues", leagueId));
  await assertFails(batch.commit());
});

test("maximum eight-House draft season deletion remains below Rules access-call limits", async () => {
  const leagueId = "draft-season-delete-eight";
  const inviteCode = "DRAFTD08";
  const houses = Array.from({ length: 8 }, (_, index) => houseData({
    leagueId,
    id: `draft-eight-house-${index + 1}`,
    name: `House ${index + 1}`,
  }));
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    await setDoc(doc(firestore, "leagues", leagueId), {
      ...seasonData({ inviteCode }),
      houseCount: 8,
    });
    await setDoc(doc(firestore, "leagueInvites", inviteCode), {
      leagueId,
      leagueName: "Eight House Draft",
      status: "closed",
      createdAt: Timestamp.now(),
      createdBy: "admin-one",
      updatedAt: Timestamp.now(),
      updatedBy: "admin-one",
    });
    for (const house of houses) {
      await setDoc(doc(firestore, "leagueHouses", house.id), house.data);
    }
  });

  const firestore = adminContext().firestore();
  const batch = writeBatch(firestore);
  batch.set(doc(firestore, "auditEvents", `draft-season-delete_${leagueId}`), {
    actorId: "admin-one",
    action: "league.draft-deleted",
    entityType: "league",
    entityId: leagueId,
    summary: "Permanently deleted maximum-size unused draft season",
    details: { inviteCode, houseCount: 8 },
    createdAt: serverTimestamp(),
  });
  houses.forEach((house) => batch.delete(doc(firestore, "leagueHouses", house.id)));
  batch.delete(doc(firestore, "leagueInvites", inviteCode));
  batch.delete(doc(firestore, "leagues", leagueId));
  await assertSucceeds(batch.commit());
});

test("registration and historical seasons cannot be hard-deleted", async () => {
  const leagueId = "registration-delete-denied";
  const inviteCode = "DRAFTD05";
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    await setDoc(doc(firestore, "leagues", leagueId), seasonData({
      status: "registration",
      inviteCode,
      participantCount: 0,
    }));
    await setDoc(doc(firestore, "leagueInvites", inviteCode), {
      leagueId,
      leagueName: "Legacy House Season",
      status: "closed",
      createdAt: Timestamp.now(),
      createdBy: "admin-one",
      updatedAt: Timestamp.now(),
      updatedBy: "admin-one",
    });
  });

  const firestore = adminContext().firestore();
  const batch = writeBatch(firestore);
  batch.set(doc(firestore, "auditEvents", `draft-season-delete_${leagueId}`), {
    actorId: "admin-one",
    action: "league.draft-deleted",
    entityType: "league",
    entityId: leagueId,
    summary: "Attempted historical deletion",
    details: { inviteCode, houseCount: 0 },
    createdAt: serverTimestamp(),
  });
  batch.delete(doc(firestore, "leagueInvites", inviteCode));
  batch.delete(doc(firestore, "leagues", leagueId));
  await assertFails(batch.commit());
});

async function seedSeasonBonusRulesFixture({ houseId = "bonus-house-a", houseName = "Bonus House A" } = {}) {
  const now = Date.now();
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    await setDoc(doc(firestore, "users", "league-admin"), createProfile("league-admin", "leagueAdmin"));
    await setDoc(doc(firestore, "leagues", "bonus-league"), {
      name: "Bonus Test Season",
      mode: "season",
      status: "active",
      startDate: Timestamp.fromDate(new Date(now - 24 * 60 * 60 * 1000)),
      endDate: Timestamp.fromDate(new Date(now + 24 * 60 * 60 * 1000)),
      rulesVersion: "season-houses-v4",
      administratorIds: ["league-admin"],
    });
    await setDoc(doc(firestore, "leagueMemberships", "bonus-league_player-one"), {
      leagueId: "bonus-league",
      userId: "player-one",
      displayName: "Test Player",
      avatarId: "legacy-trophy",
      status: "active",
      currentHouseId: houseId,
      currentHouseName: houseName,
      currentHouseEmblemId: "springbok",
    });
  });
}

function bonusAuditData({ actorId, action, referenceId, points = 50 }) {
  return {
    actorId,
    action,
    entityType: "league",
    entityId: "bonus-league",
    summary: `${action} for season bonus test`,
    details: { referenceId, userId: "player-one", points },
    createdAt: serverTimestamp(),
  };
}

function bonusRequestData({ requestId = "bonus-request-one", auditId = "bonus-request-audit", points = 50 } = {}) {
  return {
    leagueId: "bonus-league",
    userId: "player-one",
    displayName: "Test Player",
    points,
    reason: "Exceptional sportsmanship during the season",
    status: "pending",
    requestedBy: "league-admin",
    requestedAt: serverTimestamp(),
    reviewedBy: "",
    reviewedAt: null,
    reviewReason: "",
    awardId: "",
    lastAuditId: auditId,
    requestId,
  };
}

function addBonusAwardBatchWrites(batch, firestore, {
  awardId,
  auditId,
  auditAction,
  auditReferenceId = awardId,
  points = 50,
  houseId = "bonus-house-a",
  houseName = "Bonus House A",
  kind = "bonus",
  source = "platform-direct",
  requestId = "",
  requestedBy = "",
  correctsAwardId = "",
  challengeDate = serverTimestamp(),
  reason = "Exceptional sportsmanship during the season",
  actorId = "admin-one",
}) {
  const contributionId = `season_bonus_${awardId}`;
  batch.set(doc(firestore, "auditEvents", auditId), bonusAuditData({
    actorId,
    action: auditAction,
    referenceId: auditReferenceId,
    points,
  }));
  batch.set(doc(firestore, "seasonBonusAwards", awardId), {
    leagueId: "bonus-league",
    userId: "player-one",
    displayName: "Test Player",
    avatarId: "legacy-trophy",
    houseId,
    houseName,
    houseEmblemId: "springbok",
    points,
    reason,
    kind,
    source,
    requestId,
    requestedBy,
    correctsAwardId,
    contributionId,
    rulesVersion: "season-houses-v4",
    challengeDate,
    awardedAt: serverTimestamp(),
    awardedBy: actorId,
    lastAuditId: auditId,
  });
  batch.set(doc(firestore, "leagueContributions", contributionId), {
    leagueId: "bonus-league",
    entryId: "",
    userId: "player-one",
    displayName: "Test Player",
    avatarId: "legacy-trophy",
    houseId,
    houseName,
    houseEmblemId: "springbok",
    teamId: houseId,
    teamName: houseName,
    category: "seasonBonus",
    scoreCategory: "seasonBonus",
    pointGroup: "seasonBonus",
    challengeDate,
    activityPoints: points,
    rulesVersion: "season-houses-v4",
    source: "season-bonus",
    sourceRedemptionId: "",
    evidenceClaimId: "",
    evidenceDecisionId: "",
    correctionId: "",
    correctionRole: "",
    replacesContributionIds: [],
    bonusAwardId: awardId,
    createdAt: serverTimestamp(),
  });
}

test("League Administrators may submit an audited season bonus request without changing points", async () => {
  await seedSeasonBonusRulesFixture();
  const firestore = playerContext("league-admin").firestore();
  const batch = writeBatch(firestore);
  const requestId = "bonus-request-submit";
  const auditId = "bonus-request-submit-audit";
  batch.set(doc(firestore, "auditEvents", auditId), bonusAuditData({
    actorId: "league-admin",
    action: "season-bonus.requested",
    referenceId: requestId,
  }));
  const requestData = bonusRequestData({ requestId, auditId });
  delete requestData.requestId;
  batch.set(doc(firestore, "seasonBonusRequests", requestId), requestData);
  await assertSucceeds(batch.commit());

  const normalFirestore = playerContext().firestore();
  await assertFails(getDoc(doc(normalFirestore, "seasonBonusRequests", requestId)));
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const snapshot = await getDocs(collection(context.firestore(), "leagueContributions"));
    assert.equal(snapshot.size, 0);
  });
});

test("ordinary players cannot request League Season bonus points", async () => {
  await seedSeasonBonusRulesFixture();
  const firestore = playerContext().firestore();
  const requestId = "bonus-request-player";
  const data = bonusRequestData({ requestId, auditId: "missing-audit" });
  delete data.requestId;
  await assertFails(setDoc(doc(firestore, "seasonBonusRequests", requestId), data));
});

test("League Administrators cannot directly create a bonus award or contribution", async () => {
  await seedSeasonBonusRulesFixture();
  const firestore = playerContext("league-admin").firestore();
  const batch = writeBatch(firestore);
  const awardId = "league-admin-direct-award";
  const challengeDate = serverTimestamp();
  addBonusAwardBatchWrites(batch, firestore, {
    awardId,
    auditId: "league-admin-direct-audit",
    auditAction: "season-bonus.direct-awarded",
    challengeDate,
    actorId: "league-admin",
  });
  await assertFails(batch.commit());
});

test("Platform Administrators atomically award the same bonus to the player and current House", async () => {
  await seedSeasonBonusRulesFixture();
  const firestore = adminContext().firestore();
  const batch = writeBatch(firestore);
  const awardId = "platform-direct-award";
  const challengeDate = serverTimestamp();
  addBonusAwardBatchWrites(batch, firestore, {
    awardId,
    auditId: "platform-direct-audit",
    auditAction: "season-bonus.direct-awarded",
    points: 75,
    challengeDate,
  });
  await assertSucceeds(batch.commit());
  const award = await getDoc(doc(firestore, "seasonBonusAwards", awardId));
  const contribution = await getDoc(doc(firestore, "leagueContributions", `season_bonus_${awardId}`));
  assert.equal(award.data().points, 75);
  assert.equal(contribution.data().activityPoints, 75);
  assert.equal(contribution.data().houseId, "bonus-house-a");
});

test("Platform approval resolves the player's House at approval time rather than request time", async () => {
  await seedSeasonBonusRulesFixture();
  const requestId = "bonus-request-moved-player";
  const requestAuditId = "bonus-request-moved-audit";
  const leagueAdminFirestore = playerContext("league-admin").firestore();
  const requestBatch = writeBatch(leagueAdminFirestore);
  requestBatch.set(doc(leagueAdminFirestore, "auditEvents", requestAuditId), bonusAuditData({
    actorId: "league-admin",
    action: "season-bonus.requested",
    referenceId: requestId,
  }));
  const requestData = bonusRequestData({ requestId, auditId: requestAuditId });
  delete requestData.requestId;
  requestBatch.set(doc(leagueAdminFirestore, "seasonBonusRequests", requestId), requestData);
  await assertSucceeds(requestBatch.commit());

  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    await updateDoc(doc(context.firestore(), "leagueMemberships", "bonus-league_player-one"), {
      currentHouseId: "bonus-house-b",
      currentHouseName: "Bonus House B",
      currentHouseEmblemId: "springbok",
    });
  });

  const firestore = adminContext().firestore();
  const batch = writeBatch(firestore);
  const awardId = "approved-after-move";
  const auditId = "approved-after-move-audit";
  const challengeDate = serverTimestamp();
  addBonusAwardBatchWrites(batch, firestore, {
    awardId,
    auditId,
    auditAction: "season-bonus.request-approved",
    auditReferenceId: requestId,
    houseId: "bonus-house-b",
    houseName: "Bonus House B",
    source: "league-admin-request",
    requestId,
    requestedBy: "league-admin",
    challengeDate,
  });
  batch.update(doc(firestore, "seasonBonusRequests", requestId), {
    status: "approved",
    reviewedBy: "admin-one",
    reviewedAt: serverTimestamp(),
    reviewReason: "",
    awardId,
    lastAuditId: auditId,
  });
  await assertSucceeds(batch.commit());
  const award = await getDoc(doc(firestore, "seasonBonusAwards", awardId));
  assert.equal(award.data().houseId, "bonus-house-b");
});

test("Platform Administrators can reject a League Administrator bonus request without creating points", async () => {
  await seedSeasonBonusRulesFixture();
  const requestId = "bonus-request-reject";
  const requestAuditId = "bonus-request-reject-submit-audit";
  const leagueAdminFirestore = playerContext("league-admin").firestore();
  const requestBatch = writeBatch(leagueAdminFirestore);
  requestBatch.set(doc(leagueAdminFirestore, "auditEvents", requestAuditId), bonusAuditData({
    actorId: "league-admin",
    action: "season-bonus.requested",
    referenceId: requestId,
  }));
  const requestData = bonusRequestData({ requestId, auditId: requestAuditId });
  delete requestData.requestId;
  requestBatch.set(doc(leagueAdminFirestore, "seasonBonusRequests", requestId), requestData);
  await assertSucceeds(requestBatch.commit());

  const firestore = adminContext().firestore();
  const batch = writeBatch(firestore);
  const auditId = "bonus-request-rejected-audit";
  batch.set(doc(firestore, "auditEvents", auditId), bonusAuditData({
    actorId: "admin-one",
    action: "season-bonus.request-rejected",
    referenceId: requestId,
  }));
  batch.update(doc(firestore, "seasonBonusRequests", requestId), {
    status: "rejected",
    reviewedBy: "admin-one",
    reviewedAt: serverTimestamp(),
    reviewReason: "The proposed award does not meet the season criteria.",
    awardId: "",
    lastAuditId: auditId,
  });
  await assertSucceeds(batch.commit());
});

test("bonus corrections preserve the original award House and remain immutable ledger adjustments", async () => {
  await seedSeasonBonusRulesFixture();
  const firestore = adminContext().firestore();
  const originalBatch = writeBatch(firestore);
  const originalId = "bonus-original-award";
  const originalChallengeDate = serverTimestamp();
  addBonusAwardBatchWrites(originalBatch, firestore, {
    awardId: originalId,
    auditId: "bonus-original-audit",
    auditAction: "season-bonus.direct-awarded",
    points: 100,
    challengeDate: originalChallengeDate,
  });
  await assertSucceeds(originalBatch.commit());
  const original = await getDoc(doc(firestore, "seasonBonusAwards", originalId));

  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    await updateDoc(doc(context.firestore(), "leagueMemberships", "bonus-league_player-one"), {
      currentHouseId: "bonus-house-b",
      currentHouseName: "Bonus House B",
    });
  });

  const correctionBatch = writeBatch(firestore);
  const correctionId = "bonus-correction-award";
  addBonusAwardBatchWrites(correctionBatch, firestore, {
    awardId: correctionId,
    auditId: "bonus-correction-audit",
    auditAction: "season-bonus.corrected",
    points: -25,
    houseId: "bonus-house-a",
    houseName: "Bonus House A",
    kind: "correction",
    source: "platform-correction",
    correctsAwardId: originalId,
    challengeDate: original.data().challengeDate,
    reason: "Correct the duplicated portion of the original award",
  });
  await assertSucceeds(correctionBatch.commit());
  const correction = await getDoc(doc(firestore, "seasonBonusAwards", correctionId));
  assert.equal(correction.data().houseId, "bonus-house-a");
  assert.equal(correction.data().points, -25);
  await assertFails(updateDoc(doc(firestore, "seasonBonusAwards", correctionId), { points: -20 }));
});

test("Platform bonus review queue is globally visible only to Platform Administrators", async () => {
  await seedSeasonBonusRulesFixture();
  const leagueAdminFirestore = playerContext("league-admin").firestore();
  const requestId = "bonus-request-global-review";
  const auditId = "bonus-request-global-review-audit";
  const batch = writeBatch(leagueAdminFirestore);
  batch.set(doc(leagueAdminFirestore, "auditEvents", auditId), bonusAuditData({
    actorId: "league-admin",
    action: "season-bonus.requested",
    referenceId: requestId,
  }));
  const requestData = bonusRequestData({ requestId, auditId });
  delete requestData.requestId;
  batch.set(doc(leagueAdminFirestore, "seasonBonusRequests", requestId), requestData);
  await assertSucceeds(batch.commit());

  const platformFirestore = adminContext().firestore();
  const platformQueue = query(
    collection(platformFirestore, "seasonBonusRequests"),
    where("status", "==", "pending"),
  );
  const platformSnapshot = await assertSucceeds(getDocs(platformQueue));
  assert.equal(platformSnapshot.size, 1);

  const scopedLeagueAdminQueue = query(
    collection(leagueAdminFirestore, "seasonBonusRequests"),
    where("leagueId", "==", "bonus-league"),
  );
  const scopedSnapshot = await assertSucceeds(getDocs(scopedLeagueAdminQueue));
  assert.equal(scopedSnapshot.size, 1);

  const unscopedLeagueAdminQueue = query(
    collection(leagueAdminFirestore, "seasonBonusRequests"),
    where("status", "==", "pending"),
  );
  await assertFails(getDocs(unscopedLeagueAdminQueue));
});
