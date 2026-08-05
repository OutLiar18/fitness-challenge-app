import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../../firebase";
import {
  PERSONAL_DATA_EXPORT_SCHEMA_VERSION,
  createPersonalDataFilename,
  serializeExportValue,
} from "./dataExportModel";

const QUERY_SECTIONS = Object.freeze([
  ["challengeEntries", "challengeEntries", "userId"],
  ["entryCorrectionHeads", "entryCorrectionHeads", "userId"],
  ["entryCorrections", "entryCorrections", "userId"],
  ["leagueMemberships", "leagueMemberships", "userId"],
  ["leagueContributions", "leagueContributions", "userId"],
  ["seasonEvidenceClaims", "seasonEvidenceClaims", "userId"],
  ["seasonEvidenceDecisions", "seasonEvidenceDecisions", "userId"],
  ["pocketActivities", "pocketActivities", "userId"],
  ["pocketRedemptions", "pocketRedemptions", "userId"],
  ["playerNotifications", "playerNotifications", "userId"],
  ["leadershipVotes", "leadershipVotes", "voterId"],
  ["exerciseSuggestions", "exerciseSuggestions", "submittedBy"],
  ["librarySuggestions", "librarySuggestions", "submittedBy"],
  ["clientErrorReports", "clientErrorReports", "userId"],
]);

const SUBCOLLECTION_SECTIONS = Object.freeze([
  ["personalLibrary", "library"],
  ["announcementReads", "announcementReads"],
  ["coachPreferences", "coach"],
]);

function mapSnapshot(snapshot) {
  return snapshot.docs.map((documentSnapshot) => ({
    id: documentSnapshot.id,
    ...documentSnapshot.data(),
  }));
}

async function loadQuerySection(collectionName, fieldName, userId) {
  const snapshot = await getDocs(
    query(collection(db, collectionName), where(fieldName, "==", userId)),
  );
  return mapSnapshot(snapshot);
}

async function loadSubcollectionSection(userId, subcollectionName) {
  return mapSnapshot(
    await getDocs(collection(db, "users", userId, subcollectionName)),
  );
}

async function settleSection(name, loader) {
  try {
    return { name, value: await loader(), error: null };
  } catch (error) {
    console.error(`Could not export ${name}:`, error);
    return {
      name,
      value: [],
      error: error?.message || `${name} could not be exported.`,
    };
  }
}

export async function buildPersonalDataExport(userId) {
  if (!userId) {
    throw new Error("A signed-in player is required to export personal data.");
  }

  const profileSnapshot = await getDoc(doc(db, "users", userId));
  if (!profileSnapshot.exists()) {
    throw new Error("Your player profile could not be found.");
  }

  const queryResults = await Promise.all(
    QUERY_SECTIONS.map(([name, collectionName, fieldName]) =>
      settleSection(name, () =>
        loadQuerySection(collectionName, fieldName, userId)),
    ),
  );
  const subcollectionResults = await Promise.all(
    SUBCOLLECTION_SECTIONS.map(([name, subcollectionName]) =>
      settleSection(name, () =>
        loadSubcollectionSection(userId, subcollectionName)),
    ),
  );
  const deletionRequestResult = await settleSection(
    "accountDeletionRequest",
    async () => {
      const snapshot = await getDoc(doc(db, "accountDeletionRequests", userId));
      return snapshot.exists()
        ? { id: snapshot.id, ...snapshot.data() }
        : null;
    },
  );

  const sections = Object.fromEntries(
    [...queryResults, ...subcollectionResults].map(({ name, value }) => [
      name,
      value,
    ]),
  );
  sections.accountDeletionRequest = deletionRequestResult.value;

  const unavailableSections = [
    ...queryResults,
    ...subcollectionResults,
    deletionRequestResult,
  ]
    .filter((result) => result.error)
    .map((result) => ({
      section: result.name,
      reason: result.error,
    }));

  return serializeExportValue({
    metadata: {
      product: "Champions Legacy Challenge",
      schemaVersion: PERSONAL_DATA_EXPORT_SCHEMA_VERSION,
      generatedAt: new Date().toISOString(),
      userId,
      scopeNotes: [
        "This file contains account-owned data readable by the signed-in player.",
        "Shared season documents, public announcements and administrator-only audit records are not duplicated in this personal export.",
        "Derived points, streaks and analytics can be recalculated from the exported active factual entries and immutable correction chains.",
        "An acknowledged account deletion request has a seven-day cancellation window before trusted processing can begin.",
      ],
      unavailableSections,
    },
    profile: {
      id: profileSnapshot.id,
      ...profileSnapshot.data(),
    },
    ...sections,
  });
}

export function downloadPersonalDataExport(exportData, date = new Date()) {
  const blob = new Blob([`${JSON.stringify(exportData, null, 2)}\n`], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = createPersonalDataFilename(date);
  anchor.hidden = true;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}
