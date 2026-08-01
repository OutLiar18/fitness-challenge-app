import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";

import { db } from "../../firebase";
import { addAuditWrite } from "./auditService";

function normalizeSuggestion(kind, suggestionDocument) {
  const data = suggestionDocument.data();
  const definition =
    kind === "exercise" ? data.exerciseDefinition : data.definition;

  return {
    id: suggestionDocument.id,
    kind,
    collectionName:
      kind === "exercise" ? "exerciseSuggestions" : "librarySuggestions",
    submittedBy: data.submittedBy ?? "",
    challengeEntryId: data.challengeEntryId ?? "",
    itemType: data.itemType ?? kind,
    definition: definition ?? {},
    status: data.status ?? "pending",
    createdAt: data.createdAt ?? null,
    reviewedAt: data.reviewedAt ?? null,
    reviewedBy: data.reviewedBy ?? null,
    rejectionReason: data.rejectionReason ?? "",
    lastAuditId: data.lastAuditId ?? "",
  };
}

function sortSuggestions(suggestions = []) {
  const statusPriority = { pending: 0, approved: 1, rejected: 2 };

  return [...suggestions].sort((first, second) => {
    const statusDifference =
      (statusPriority[first.status] ?? 9) -
      (statusPriority[second.status] ?? 9);

    if (statusDifference !== 0) {
      return statusDifference;
    }

    const firstTime = first.createdAt?.toMillis?.() ?? 0;
    const secondTime = second.createdAt?.toMillis?.() ?? 0;
    return secondTime - firstTime;
  });
}

export function subscribeToExerciseSuggestions(onUpdate, onError) {
  return onSnapshot(
    collection(db, "exerciseSuggestions"),
    (snapshot) => {
      onUpdate?.(
        sortSuggestions(
          snapshot.docs.map((suggestionDocument) =>
            normalizeSuggestion("exercise", suggestionDocument),
          ),
        ),
      );
    },
    onError,
  );
}

export function subscribeToLibrarySuggestions(onUpdate, onError) {
  return onSnapshot(
    collection(db, "librarySuggestions"),
    (snapshot) => {
      onUpdate?.(
        sortSuggestions(
          snapshot.docs.map((suggestionDocument) =>
            normalizeSuggestion("library", suggestionDocument),
          ),
        ),
      );
    },
    onError,
  );
}

export async function reviewSuggestion({
  suggestion,
  decision,
  rejectionReason = "",
  actorId,
}) {
  if (!suggestion?.id || !suggestion.collectionName) {
    throw new Error("Choose a valid suggestion to review.");
  }

  if (!["approved", "rejected"].includes(decision)) {
    throw new Error("Choose whether to approve or reject the suggestion.");
  }

  const normalizedReason = String(rejectionReason ?? "").trim();

  if (decision === "rejected" && normalizedReason.length < 4) {
    throw new Error("Add a brief, respectful reason before rejecting a suggestion.");
  }

  const name = String(suggestion.definition?.name ?? "Unnamed suggestion");
  const batch = writeBatch(db);
  const suggestionReference = doc(
    db,
    suggestion.collectionName,
    suggestion.id,
  );
  const auditReference = addAuditWrite(batch, {
    actorId,
    action: `suggestion.${decision}`,
    entityType: suggestion.collectionName,
    entityId: suggestion.id,
    summary: `${decision === "approved" ? "Approved" : "Rejected"} suggestion: ${name}`,
    details: {
      itemType: suggestion.itemType,
      submittedBy: suggestion.submittedBy,
      rejectionReason: decision === "rejected" ? normalizedReason : "",
    },
  });

  batch.update(suggestionReference, {
    status: decision,
    reviewedAt: serverTimestamp(),
    reviewedBy: actorId,
    rejectionReason: decision === "rejected" ? normalizedReason : "",
    lastAuditId: auditReference.id,
  });

  await batch.commit();
}
