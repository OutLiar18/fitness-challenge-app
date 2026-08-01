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
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
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


test("team creation, joining and captain transfer remain atomic and role-safe", async () => {
  const captainFirestore = playerContext("player-one").firestore();
  const teamId = "team-one";
  const inviteCode = "TEAMABCD";
  const createBatch = writeBatch(captainFirestore);

  createBatch.set(doc(captainFirestore, "teams", teamId), {
    name: "Legacy Builders",
    normalizedName: "legacy builders",
    description: "A steady team committed to becoming better together.",
    motto: "Consistency builds legacy",
    emblemId: "legacy-banner",
    status: "active",
    captainId: "player-one",
    memberCount: 1,
    inviteCode,
    createdAt: serverTimestamp(),
    createdBy: "player-one",
    updatedAt: serverTimestamp(),
    updatedBy: "player-one",
  });
  createBatch.set(doc(captainFirestore, "teams", teamId, "members", "player-one"), {
    userId: "player-one",
    displayName: "Test Player",
    avatarId: "legacy-trophy",
    role: "captain",
    inviteCode,
    joinedAt: serverTimestamp(),
    weeklyKey: "",
    weeklyPoints: 0,
    activeDays: 0,
    entriesRecorded: 0,
    currentStreak: 0,
    progressUpdatedAt: serverTimestamp(),
  });
  createBatch.set(doc(captainFirestore, "playerTeams", "player-one"), {
    userId: "player-one",
    teamId,
    teamName: "Legacy Builders",
    emblemId: "legacy-banner",
    role: "captain",
    joinedAt: serverTimestamp(),
  });
  createBatch.set(doc(captainFirestore, "teamInvites", inviteCode), {
    teamId,
    teamName: "Legacy Builders",
    emblemId: "legacy-banner",
    status: "active",
    createdAt: serverTimestamp(),
    createdBy: "player-one",
    updatedAt: serverTimestamp(),
    updatedBy: "player-one",
  });

  await assertSucceeds(createBatch.commit());

  const memberFirestore = playerContext("player-two").firestore();
  const joinBatch = writeBatch(memberFirestore);
  joinBatch.set(doc(memberFirestore, "teams", teamId, "members", "player-two"), {
    userId: "player-two",
    displayName: "Test Player",
    avatarId: "legacy-trophy",
    role: "member",
    inviteCode,
    joinedAt: serverTimestamp(),
    weeklyKey: "",
    weeklyPoints: 0,
    activeDays: 0,
    entriesRecorded: 0,
    currentStreak: 0,
    progressUpdatedAt: serverTimestamp(),
  });
  joinBatch.set(doc(memberFirestore, "playerTeams", "player-two"), {
    userId: "player-two",
    teamId,
    teamName: "Legacy Builders",
    emblemId: "legacy-banner",
    role: "member",
    joinedAt: serverTimestamp(),
  });
  joinBatch.update(doc(memberFirestore, "teams", teamId), {
    memberCount: 2,
    updatedAt: serverTimestamp(),
    updatedBy: "player-two",
  });

  await assertSucceeds(joinBatch.commit());
  await assertFails(
    updateDoc(doc(memberFirestore, "teams", teamId, "members", "player-two"), {
      role: "captain",
    }),
  );

  const transferBatch = writeBatch(captainFirestore);
  transferBatch.update(doc(captainFirestore, "teams", teamId), {
    captainId: "player-two",
    updatedAt: serverTimestamp(),
    updatedBy: "player-one",
  });
  transferBatch.update(doc(captainFirestore, "teams", teamId, "members", "player-one"), {
    role: "member",
  });
  transferBatch.update(doc(captainFirestore, "teams", teamId, "members", "player-two"), {
    role: "captain",
  });
  transferBatch.update(doc(captainFirestore, "playerTeams", "player-one"), {
    role: "member",
  });
  transferBatch.update(doc(captainFirestore, "playerTeams", "player-two"), {
    role: "captain",
  });

  await assertSucceeds(transferBatch.commit());

  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    await updateDoc(doc(context.firestore(), "teams", teamId), {
      memberCount: 25,
    });
  });

  const overflowFirestore = playerContext("player-three").firestore();
  const overflowBatch = writeBatch(overflowFirestore);
  overflowBatch.set(doc(overflowFirestore, "teams", teamId, "members", "player-three"), {
    userId: "player-three",
    displayName: "Third Player",
    avatarId: "legacy-trophy",
    role: "member",
    inviteCode,
    joinedAt: serverTimestamp(),
    weeklyKey: "",
    weeklyPoints: 0,
    activeDays: 0,
    entriesRecorded: 0,
    currentStreak: 0,
    progressUpdatedAt: serverTimestamp(),
  });
  overflowBatch.set(doc(overflowFirestore, "playerTeams", "player-three"), {
    userId: "player-three",
    teamId,
    teamName: "Legacy Builders",
    emblemId: "legacy-banner",
    role: "member",
    joinedAt: serverTimestamp(),
  });
  overflowBatch.update(doc(overflowFirestore, "teams", teamId), {
    memberCount: 26,
    updatedAt: serverTimestamp(),
    updatedBy: "player-three",
  });

  await assertFails(overflowBatch.commit());
});

test("Legacy Coach preferences remain private to their owner", async () => {
  const ownerFirestore = playerContext("player-one").firestore();
  const preferencesReference = doc(ownerFirestore, "users", "player-one", "coach", "preferences");

  await assertSucceeds(
    setDoc(preferencesReference, {
      enabled: true,
      tone: "balanced",
      focus: "consistency",
      updatedAt: serverTimestamp(),
    }),
  );
  await assertSucceeds(getDoc(preferencesReference));
  await assertFails(
    getDoc(doc(playerContext("player-two").firestore(), "users", "player-one", "coach", "preferences")),
  );
});

test("league drafts require an authorised operator and a matching audit event", async () => {
  async function commitLeagueDraft(firestore, actorId, leagueId) {
    const batch = writeBatch(firestore);
    const inviteCode = leagueId === "league-admin" ? "LEAGUEAA" : "LEAGUEBB";
    const auditId = `${leagueId}-audit`;

    batch.set(doc(firestore, "auditEvents", auditId), {
      actorId,
      action: "league.created",
      entityType: "league",
      entityId: leagueId,
      summary: "Created a new consistency league",
      details: { status: "draft" },
      createdAt: serverTimestamp(),
    });
    batch.set(doc(firestore, "leagues", leagueId), {
      name: "Consistency League",
      normalizedName: "consistency league",
      description: "A friendly season that rewards steady participation over isolated peaks.",
      type: "Community",
      mode: "individual",
      status: "draft",
      startDate: Timestamp.fromDate(new Date("2026-08-10T00:00:00.000Z")),
      endDate: Timestamp.fromDate(new Date("2026-08-24T00:00:00.000Z")),
      rulesVersion: "consistency-v1",
      ruleset: {
        version: "consistency-v1",
        scoringEngineVersion: "points-v2",
        dailyActivityCap: 20,
        dailyParticipationBonus: 5,
        includedCategories: [
          "water",
          "fruit",
          "reading",
          "running",
          "upperBody",
          "lowerBody",
          "core",
          "cardio",
          "skill",
          "steps",
        ],
      },
      administratorIds: [actorId],
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
      leagueName: "Consistency League",
      status: "closed",
      createdAt: serverTimestamp(),
      createdBy: actorId,
      updatedAt: serverTimestamp(),
      updatedBy: actorId,
    });

    return batch.commit();
  }

  await assertFails(
    commitLeagueDraft(playerContext("player-one").firestore(), "player-one", "league-player"),
  );
  await assertSucceeds(
    commitLeagueDraft(adminContext("admin-one").firestore(), "admin-one", "league-admin"),
  );
});

test("league lifecycle changes move forward one stage and remain audited", async () => {
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    await setDoc(doc(firestore, "leagues", "league-lifecycle"), {
      name: "Lifecycle League",
      normalizedName: "lifecycle league",
      description: "A league used to verify safe and ordered seasonal status changes.",
      type: "Community",
      mode: "individual",
      status: "draft",
      startDate: Timestamp.fromDate(new Date("2026-08-10T00:00:00.000Z")),
      endDate: Timestamp.fromDate(new Date("2026-08-24T00:00:00.000Z")),
      rulesVersion: "consistency-v1",
      ruleset: {
        version: "consistency-v1",
        scoringEngineVersion: "points-v2",
        dailyActivityCap: 20,
        dailyParticipationBonus: 5,
        includedCategories: [
          "water", "fruit", "reading", "running", "upperBody",
          "lowerBody", "core", "cardio", "skill", "steps",
        ],
      },
      administratorIds: ["admin-one"],
      inviteCode: "LIFECYCL",
      createdAt: Timestamp.now(),
      createdBy: "admin-one",
      updatedAt: Timestamp.now(),
      updatedBy: "admin-one",
      activatedAt: null,
      completedAt: null,
      archivedAt: null,
      lastAuditId: "original-audit",
    });
    await setDoc(doc(firestore, "leagueInvites", "LIFECYCL"), {
      leagueId: "league-lifecycle",
      leagueName: "Lifecycle League",
      status: "closed",
      createdAt: Timestamp.now(),
      createdBy: "admin-one",
      updatedAt: Timestamp.now(),
      updatedBy: "admin-one",
    });
  });

  const firestore = adminContext("admin-one").firestore();
  const invalidBatch = writeBatch(firestore);
  invalidBatch.set(doc(firestore, "auditEvents", "skip-audit"), {
    actorId: "admin-one",
    action: "league.active",
    entityType: "league",
    entityId: "league-lifecycle",
    summary: "Attempted to skip league registration",
    details: {},
    createdAt: serverTimestamp(),
  });
  invalidBatch.update(doc(firestore, "leagues", "league-lifecycle"), {
    status: "active",
    updatedAt: serverTimestamp(),
    updatedBy: "admin-one",
    activatedAt: serverTimestamp(),
    lastAuditId: "skip-audit",
  });
  await assertFails(invalidBatch.commit());

  const validBatch = writeBatch(firestore);
  validBatch.set(doc(firestore, "auditEvents", "registration-audit"), {
    actorId: "admin-one",
    action: "league.registration",
    entityType: "league",
    entityId: "league-lifecycle",
    summary: "Opened league registration",
    details: {},
    createdAt: serverTimestamp(),
  });
  validBatch.update(doc(firestore, "leagues", "league-lifecycle"), {
    status: "registration",
    updatedAt: serverTimestamp(),
    updatedBy: "admin-one",
    lastAuditId: "registration-audit",
  });
  validBatch.update(doc(firestore, "leagueInvites", "LIFECYCL"), {
    status: "active",
    updatedAt: serverTimestamp(),
    updatedBy: "admin-one",
  });
  await assertSucceeds(validBatch.commit());

  const playerFirestore = playerContext("player-one").firestore();
  await assertSucceeds(
    setDoc(doc(playerFirestore, "leagueMemberships", "league-lifecycle_player-one"), {
      leagueId: "league-lifecycle",
      userId: "player-one",
      displayName: "Test Player",
      avatarId: "legacy-trophy",
      teamId: "",
      teamName: "Independent",
      role: "participant",
      status: "registered",
      inviteCode: "LIFECYCL",
      joinedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }),
  );

  const falseTeamFirestore = playerContext("player-two").firestore();
  await assertFails(
    setDoc(doc(falseTeamFirestore, "leagueMemberships", "league-lifecycle_player-two"), {
      leagueId: "league-lifecycle",
      userId: "player-two",
      displayName: "Test Player",
      avatarId: "legacy-trophy",
      teamId: "invented-team",
      teamName: "Invented Team",
      role: "participant",
      status: "registered",
      inviteCode: "LIFECYCL",
      joinedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }),
  );
});

test("league contributions must match an active membership and the entry written with them", async () => {
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore();
    await setDoc(doc(firestore, "leagues", "league-active"), {
      name: "Active League",
      normalizedName: "active league",
      description: "An active consistency league used to verify contribution integrity.",
      type: "Community",
      mode: "individual",
      status: "active",
      startDate: Timestamp.fromDate(new Date("2026-08-01T00:00:00.000Z")),
      endDate: Timestamp.fromDate(new Date("2026-08-31T00:00:00.000Z")),
      rulesVersion: "consistency-v1",
      ruleset: {
        version: "consistency-v1",
        scoringEngineVersion: "points-v2",
        dailyActivityCap: 20,
        dailyParticipationBonus: 5,
        includedCategories: [
          "water", "fruit", "reading", "running", "upperBody",
          "lowerBody", "core", "cardio", "skill", "steps",
        ],
      },
      administratorIds: ["admin-one"],
      inviteCode: "ACTIVEAA",
      createdAt: Timestamp.now(),
      createdBy: "admin-one",
      updatedAt: Timestamp.now(),
      updatedBy: "admin-one",
      activatedAt: Timestamp.now(),
      completedAt: null,
      archivedAt: null,
      lastAuditId: "active-audit",
    });
    await setDoc(doc(firestore, "leagueMemberships", "league-active_player-one"), {
      leagueId: "league-active",
      userId: "player-one",
      displayName: "Test Player",
      avatarId: "legacy-trophy",
      teamId: "",
      teamName: "Independent",
      role: "participant",
      status: "active",
      inviteCode: "ACTIVEAA",
      joinedAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  });

  const firestore = playerContext("player-one").firestore();
  const challengeDate = Timestamp.fromDate(new Date("2026-08-12T12:00:00.000Z"));
  const validBatch = writeBatch(firestore);
  validBatch.set(doc(firestore, "challengeEntries", "league-entry-one"), {
    userId: "player-one",
    category: "water",
    data: { amount: 1000 },
    createdAt: serverTimestamp(),
    challengeDate,
  });
  validBatch.set(doc(firestore, "leagueContributions", "league-active_league-entry-one"), {
    leagueId: "league-active",
    entryId: "league-entry-one",
    userId: "player-one",
    displayName: "Test Player",
    avatarId: "legacy-trophy",
    teamId: "",
    teamName: "Independent",
    category: "water",
    challengeDate,
    activityPoints: 4,
    rulesVersion: "consistency-v1",
    createdAt: serverTimestamp(),
  });
  await assertSucceeds(validBatch.commit());

  const invalidBatch = writeBatch(firestore);
  invalidBatch.set(doc(firestore, "challengeEntries", "league-entry-two"), {
    userId: "player-one",
    category: "reading",
    data: { duration: 30 },
    createdAt: serverTimestamp(),
    challengeDate,
  });
  invalidBatch.set(doc(firestore, "leagueContributions", "league-active_league-entry-two"), {
    leagueId: "league-active",
    entryId: "league-entry-two",
    userId: "player-one",
    displayName: "Test Player",
    avatarId: "legacy-trophy",
    teamId: "",
    teamName: "Independent",
    category: "water",
    challengeDate,
    activityPoints: 3,
    rulesVersion: "consistency-v1",
    createdAt: serverTimestamp(),
  });
  await assertFails(invalidBatch.commit());
});
