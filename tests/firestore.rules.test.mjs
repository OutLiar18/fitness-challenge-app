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

