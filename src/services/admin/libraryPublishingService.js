import {
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";

import { db } from "../../firebase";
import { normalizePublishedLibraryItem } from "../libraries/globalLibraryModel";
import { addAuditWrite } from "./auditService";
import {
  buildPublishedLibraryItem,
  createLibraryReleaseId,
  validateLibraryReleaseDraft,
} from "./libraryPublishingModel";

export function subscribeToAllPublishedLibraryItems(onUpdate, onError) {
  return onSnapshot(
    collection(db, "publishedLibraryItems"),
    (snapshot) => {
      const items = snapshot.docs
        .map((itemDocument) =>
          normalizePublishedLibraryItem({
            id: itemDocument.id,
            ...itemDocument.data(),
          }),
        )
        .sort((first, second) => {
          const statusDifference = first.status.localeCompare(second.status);

          if (statusDifference !== 0) {
            return statusDifference;
          }

          return first.name.localeCompare(second.name);
        });

      onUpdate?.(items);
    },
    onError,
  );
}

export function subscribeToLibraryReleases(onUpdate, onError, maximum = 30) {
  const releaseQuery = query(
    collection(db, "libraryReleases"),
    orderBy("publishedAt", "desc"),
    limit(maximum),
  );

  return onSnapshot(
    releaseQuery,
    (snapshot) => {
      onUpdate?.(
        snapshot.docs.map((releaseDocument) => ({
          id: releaseDocument.id,
          ...releaseDocument.data(),
        })),
      );
    },
    onError,
  );
}

export async function publishLibraryRelease({
  suggestions,
  version,
  notes = "",
  actorId,
}) {
  const releaseDraft = validateLibraryReleaseDraft({
    version,
    notes,
    suggestions,
  });

  if (!actorId) {
    throw new Error("A trusted administrator is required.");
  }

  if (!releaseDraft.valid) {
    throw new Error(releaseDraft.errors[0]);
  }

  const {
    version: releaseVersion,
    notes: normalizedNotes,
    suggestions: selectedSuggestions,
  } = releaseDraft;

  const items = selectedSuggestions.map((suggestion) =>
    buildPublishedLibraryItem(suggestion, releaseVersion),
  );
  const uniqueItemIds = new Set(items.map((item) => item.itemId));

  if (uniqueItemIds.size !== items.length) {
    throw new Error(
      "This release contains duplicate library names. Choose one of each item.",
    );
  }

  const batch = writeBatch(db);
  const releaseReference = doc(
    db,
    "libraryReleases",
    createLibraryReleaseId(releaseVersion),
  );
  const existingRelease = await getDoc(releaseReference);

  if (existingRelease.exists()) {
    throw new Error(
      `Library release ${releaseVersion} already exists. Choose the next semantic version.`,
    );
  }

  const releaseAudit = addAuditWrite(batch, {
    actorId,
    action: "library.release.published",
    entityType: "libraryRelease",
    entityId: releaseReference.id,
    summary: `Published global library release ${releaseVersion}`,
    details: {
      version: releaseVersion,
      itemCount: items.length,
      itemIds: items.map((item) => item.itemId),
    },
  });

  items.forEach((item, index) => {
    const suggestion = selectedSuggestions[index];
    const itemReference = doc(db, "publishedLibraryItems", item.itemId);
    const itemAudit = addAuditWrite(batch, {
      actorId,
      action: "library.item.published",
      entityType: "publishedLibraryItem",
      entityId: item.itemId,
      summary: `Published shared ${item.itemType}: ${item.name}`,
      details: {
        version: item.libraryVersion,
        sourceSuggestionId: suggestion.id,
        sourceCollection: suggestion.collectionName,
      },
    });
    const suggestionAudit = addAuditWrite(batch, {
      actorId,
      action: "suggestion.published",
      entityType: suggestion.collectionName,
      entityId: suggestion.id,
      summary: `Published approved suggestion: ${item.name}`,
      details: {
        libraryItemId: item.itemId,
        version: item.libraryVersion,
      },
    });

    batch.set(itemReference, {
      itemType: item.itemType,
      name: item.name,
      normalizedName: item.normalizedName,
      definition: item.definition,
      status: "published",
      libraryVersion: item.libraryVersion,
      sourceSuggestionId: item.sourceSuggestionId,
      sourceCollection: item.sourceCollection,
      releaseId: releaseReference.id,
      createdAt: serverTimestamp(),
      createdBy: actorId,
      updatedAt: serverTimestamp(),
      updatedBy: actorId,
      publishedAt: serverTimestamp(),
      archivedAt: null,
      lastAuditId: itemAudit.id,
    });

    batch.update(doc(db, suggestion.collectionName, suggestion.id), {
      publicationStatus: "published",
      publishedAt: serverTimestamp(),
      publishedBy: actorId,
      publishedLibraryItemId: item.itemId,
      libraryVersion: item.libraryVersion,
      lastAuditId: suggestionAudit.id,
    });
  });

  batch.set(releaseReference, {
    version: releaseVersion,
    notes: normalizedNotes,
    status: "published",
    itemIds: items.map((item) => item.itemId),
    itemCount: items.length,
    createdAt: serverTimestamp(),
    createdBy: actorId,
    publishedAt: serverTimestamp(),
    lastAuditId: releaseAudit.id,
  });

  await batch.commit();

  return {
    releaseId: releaseReference.id,
    version: releaseVersion,
    itemCount: items.length,
  };
}

export async function archivePublishedLibraryItem({ item, actorId }) {
  if (!item?.id || item.status !== "published") {
    throw new Error("Choose a published library item to archive.");
  }

  const batch = writeBatch(db);
  const itemReference = doc(db, "publishedLibraryItems", item.id);
  const auditReference = addAuditWrite(batch, {
    actorId,
    action: "library.item.archived",
    entityType: "publishedLibraryItem",
    entityId: item.id,
    summary: `Archived shared ${item.itemType}: ${item.name}`,
    details: {
      version: item.libraryVersion,
      releaseId: item.releaseId ?? "",
    },
  });

  batch.update(itemReference, {
    status: "archived",
    updatedAt: serverTimestamp(),
    updatedBy: actorId,
    archivedAt: serverTimestamp(),
    lastAuditId: auditReference.id,
  });

  await batch.commit();
}
