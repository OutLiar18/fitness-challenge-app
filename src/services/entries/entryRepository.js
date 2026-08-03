import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  Timestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../firebase";
import { calculateEntryPoints } from "../points";
import { normalizeChallengeDate } from "../dateService";
import { isEntryWithinLeague } from "../leagues/leagueModel";

function getCreatedAtMillis(entry) {
  if (typeof entry.createdAt?.toMillis === "function") {
    return entry.createdAt.toMillis();
  }

  const parsed = new Date(entry.createdAt ?? 0).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

function sortEntriesNewestFirst(entries) {
  return [...entries].sort(
    (first, second) => getCreatedAtMillis(second) - getCreatedAtMillis(first),
  );
}

export async function createEntry(
  userId,
  category,
  data,
  selectedDate,
  leagueContexts = [],
  metadata = {},
) {
  if (!userId) {
    throw new Error("A user is required to save an entry.");
  }

  if (!category) {
    throw new Error("A category is required to save an entry.");
  }

  const challengeDate = normalizeChallengeDate(selectedDate);

  if (!challengeDate) {
    throw new Error("A valid challenge date is required.");
  }

  const entryReference = doc(collection(db, "challengeEntries"));
  const entry = {
    id: entryReference.id,
    userId,
    category,
    data,
    challengeDate,
  };
  const activityPoints = calculateEntryPoints(entry);
  const batch = writeBatch(db);

  batch.set(entryReference, {
    userId,
    category,
    data,
    source: metadata.source || "activity",
    sourceLeagueId: metadata.sourceLeagueId || "",
    sourcePocketId: metadata.sourcePocketId || "",
    sourceRedemptionId: metadata.sourceRedemptionId || "",
    createdAt: serverTimestamp(),
    challengeDate: Timestamp.fromDate(challengeDate),
  });

  leagueContexts
    .filter(({ league }) => isEntryWithinLeague(entry, league))
    .forEach(({ league, membership }) => {
      const contributionReference = doc(
        db,
        "leagueContributions",
        `${league.id}_${entryReference.id}`,
      );

      batch.set(contributionReference, {
        leagueId: league.id,
        entryId: entryReference.id,
        userId,
        displayName: membership.displayName || "Champion",
        avatarId: membership.avatarId || "legacy-trophy",
        houseId: membership.currentHouseId || "",
        houseName: membership.currentHouseName || "Unassigned",
        houseEmblemId: membership.currentHouseEmblemId || "springbok",
        teamId: membership.currentHouseId || "",
        teamName: membership.currentHouseName || "Unassigned",
        category,
        challengeDate: Timestamp.fromDate(challengeDate),
        activityPoints: Math.max(0, Math.round(activityPoints * 100) / 100),
        rulesVersion: league.rulesVersion,
        source: metadata.source || "activity",
        sourceRedemptionId: metadata.sourceRedemptionId || "",
        createdAt: serverTimestamp(),
      });
    });

  await batch.commit();
  return entryReference;
}

export function subscribeToEntries(userId, onUpdate, onError) {
  if (!userId) {
    onUpdate([]);
    return () => {};
  }

  const entriesQuery = query(
    collection(db, "challengeEntries"),
    where("userId", "==", userId),
  );

  return onSnapshot(
    entriesQuery,
    (snapshot) => {
      const entries = snapshot.docs.map((entryDocument) => ({
        id: entryDocument.id,
        ...entryDocument.data(),
      }));

      onUpdate(sortEntriesNewestFirst(entries));
    },
    onError,
  );
}

export async function deleteEntry(entryId, userId) {
  if (!entryId) {
    throw new Error("An entry ID is required.");
  }

  if (!userId) {
    throw new Error("A user is required to delete an entry.");
  }

  const entrySnapshot = await getDoc(doc(db, "challengeEntries", entryId));
  if (entrySnapshot.exists() && entrySnapshot.data().source === "pocket") {
    throw new Error("Pocket redemptions are final and cannot be deleted.");
  }

  const contributionSnapshot = await getDocs(
    query(
      collection(db, "leagueContributions"),
      where("entryId", "==", entryId),
      where("userId", "==", userId),
    ),
  );
  const uniqueLeagueIds = [
    ...new Set(
      contributionSnapshot.docs
        .map((contributionDocument) => contributionDocument.data().leagueId)
        .filter(Boolean),
    ),
  ];
  const leagueStatuses = new Map(
    await Promise.all(
      uniqueLeagueIds.map(async (leagueId) => {
        const leagueSnapshot = await getDoc(doc(db, "leagues", leagueId));
        return [
          leagueId,
          leagueSnapshot.exists() ? leagueSnapshot.data().status : "",
        ];
      }),
    ),
  );
  const batch = writeBatch(db);

  contributionSnapshot.docs.forEach((contributionDocument) => {
    const contribution = contributionDocument.data();

    if (leagueStatuses.get(contribution.leagueId) === "active") {
      batch.delete(contributionDocument.ref);
    }
  });

  batch.delete(doc(db, "challengeEntries", entryId));
  await batch.commit();
}

export async function createExerciseSuggestion({
  userId,
  challengeEntryId,
  exerciseDefinition,
}) {
  if (!userId) {
    throw new Error("A user is required to suggest an exercise.");
  }

  if (!exerciseDefinition?.name) {
    throw new Error("An exercise name is required.");
  }

  const reference = doc(collection(db, "exerciseSuggestions"));
  const batch = writeBatch(db);
  batch.set(reference, {
    submittedBy: userId,
    challengeEntryId,
    exerciseDefinition,
    status: "pending",
    createdAt: serverTimestamp(),
    reviewedAt: null,
    reviewedBy: null,
    rejectionReason: "",
  });
  await batch.commit();
  return reference;
}

export async function createLibrarySuggestion({
  userId,
  challengeEntryId,
  itemType,
  definition,
}) {
  if (!userId) {
    throw new Error("A user is required to create a library suggestion.");
  }

  if (!itemType || !definition?.name) {
    throw new Error("A valid library suggestion is required.");
  }

  const reference = doc(collection(db, "librarySuggestions"));
  const batch = writeBatch(db);
  batch.set(reference, {
    submittedBy: userId,
    challengeEntryId,
    itemType,
    definition,
    status: "pending",
    createdAt: serverTimestamp(),
    reviewedAt: null,
    reviewedBy: null,
    rejectionReason: "",
  });
  await batch.commit();
  return reference;
}
