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

function adminContext(userId = "admin-one") {
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

function auditData({ action, entityId = "season-one", summary = "Season operation" }) {
  return {
    actorId: "admin-one",
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
  reviewerCategories = [],
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
    if (reviewerCategories.length > 0) {
      await setDoc(doc(firestore, "leagueEvidenceReviewers", `${leagueId}_player-two`), {
        leagueId,
        userId: "player-two",
        displayName: "player two",
        avatarId: "legacy-trophy",
        categories: reviewerCategories,
        status: "active",
        createdAt: Timestamp.now(),
        createdBy: "admin-one",
        updatedAt: Timestamp.now(),
        updatedBy: "admin-one",
        lastAuditId: "seed-audit",
      });
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

test("season administrators assign multiple proof categories without rewriting reviewer history", async () => {
  const leagueId = "season-v2";
  await seedActiveEvidenceSeason();
  const firestore = adminContext().firestore();
  const assignmentId = `${leagueId}_player-two`;
  const createBatch = writeBatch(firestore);
  createBatch.set(doc(firestore, "auditEvents", "reviewer-create-audit"), auditData({
    action: "evidence.reviewer.assigned",
    entityId: leagueId,
    summary: "Assigned evidence reviewer",
  }));
  createBatch.set(doc(firestore, "leagueEvidenceReviewers", assignmentId), {
    leagueId,
    userId: "player-two",
    displayName: "player two",
    avatarId: "legacy-trophy",
    categories: ["running", "steps"],
    status: "active",
    createdAt: serverTimestamp(),
    createdBy: "admin-one",
    updatedAt: serverTimestamp(),
    updatedBy: "admin-one",
    lastAuditId: "reviewer-create-audit",
  });
  await assertSucceeds(createBatch.commit());

  const created = await getDoc(doc(firestore, "leagueEvidenceReviewers", assignmentId));
  const updateBatch = writeBatch(firestore);
  updateBatch.set(doc(firestore, "auditEvents", "reviewer-update-audit"), auditData({
    action: "evidence.reviewer.assigned",
    entityId: leagueId,
    summary: "Updated evidence reviewer",
  }));
  updateBatch.update(doc(firestore, "leagueEvidenceReviewers", assignmentId), {
    categories: ["running", "steps", "water", "fruit"],
    status: "active",
    updatedAt: serverTimestamp(),
    updatedBy: "admin-one",
    lastAuditId: "reviewer-update-audit",
  });
  await assertSucceeds(updateBatch.commit());
  const updated = await getDoc(doc(firestore, "leagueEvidenceReviewers", assignmentId));
  assert.deepEqual(updated.data().createdAt, created.data().createdAt);
  assert.equal(updated.data().createdBy, "admin-one");
});

test("assigned category reviewers release proof-dependent points atomically", async () => {
  const leagueId = "season-v2";
  const house = houseData({ leagueId });
  const base = evidenceClaimData({ leagueId, house });
  const claim = { id: `${leagueId}_run-entry`, data: base };
  await seedActiveEvidenceSeason({ claim, reviewerCategories: ["running"] });

  await assertSucceeds(commitEvidenceVerification({
    firestore: playerContext("player-two").firestore(),
    actorId: "player-two",
    claim,
    decisionId: "decision-reviewer",
    contributionId: `${leagueId}_${claim.id}_decision-reviewer`,
  }));
  await assertSucceeds(getDoc(doc(
    playerContext().firestore(),
    "seasonEvidenceClaims",
    claim.id,
  )));
});

test("unassigned reviewers cannot decide another evidence category", async () => {
  const leagueId = "season-v2";
  const house = houseData({ leagueId });
  const claim = {
    id: `${leagueId}_run-entry`,
    data: evidenceClaimData({ leagueId, house }),
  };
  await seedActiveEvidenceSeason({ claim, reviewerCategories: ["steps"] });
  await assertFails(commitEvidenceVerification({
    firestore: playerContext("player-two").firestore(),
    actorId: "player-two",
    claim,
    decisionId: "decision-forbidden",
    contributionId: `${leagueId}_${claim.id}_decision-forbidden`,
  }));
});

test("unassigned season administrators cannot bypass category reviewer assignments", async () => {
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
    decisionId: "decision-unassigned-season-admin",
    contributionId: `${leagueId}_${claim.id}_decision-unassigned-season-admin`,
  }));
});

test("category reviewers can read only the evidence categories assigned to them", async () => {
  const leagueId = "season-v2";
  const house = houseData({ leagueId });
  const runningClaim = {
    id: `${leagueId}_run-entry`,
    data: evidenceClaimData({ leagueId, house }),
  };
  const stepsClaim = {
    id: `${leagueId}_steps-entry`,
    data: evidenceClaimData({
      leagueId,
      entryId: "steps-entry",
      category: "steps",
      house,
      pendingPoints: 12,
    }),
  };
  await seedActiveEvidenceSeason({
    claim: runningClaim,
    reviewerCategories: ["running"],
  });
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    await setDoc(
      doc(context.firestore(), "seasonEvidenceClaims", stepsClaim.id),
      stepsClaim.data,
    );
  });

  const reviewerFirestore = playerContext("player-two").firestore();
  await assertSucceeds(getDoc(doc(
    reviewerFirestore,
    "seasonEvidenceClaims",
    runningClaim.id,
  )));
  await assertFails(getDoc(doc(
    reviewerFirestore,
    "seasonEvidenceClaims",
    stepsClaim.id,
  )));
});

test("late proof requires a Platform Administrator and an audit reason", async () => {
  const leagueId = "season-v2";
  const house = houseData({ leagueId });
  const deadlineAt = Timestamp.fromMillis(Date.now() - 60 * 60 * 1000);
  const claim = {
    id: `${leagueId}_run-entry`,
    data: evidenceClaimData({ leagueId, house, deadlineAt }),
  };
  await seedActiveEvidenceSeason({ claim, reviewerCategories: ["running"] });
  const lateSubmission = Timestamp.now();

  await assertFails(commitEvidenceVerification({
    firestore: playerContext("player-two").firestore(),
    actorId: "player-two",
    claim,
    decisionId: "late-reviewer",
    contributionId: `${leagueId}_${claim.id}_late-reviewer`,
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
  challengeDate,
} = {}) {
  const batch = writeBatch(firestore);
  const reason = "The recorded bottle amount was entered incorrectly.";

  batch.set(doc(firestore, "auditEvents", auditId), {
    actorId,
    action: "entry.correction.completed",
    entityType: "entryCorrection",
    entityId: correctionId,
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
