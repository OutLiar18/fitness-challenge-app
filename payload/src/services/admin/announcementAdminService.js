import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";

import { db } from "../../firebase";
import { getBundledAnnouncements } from "../announcements/announcementService";
import {
  normalizeAnnouncement,
  sortAnnouncementsNewestFirst,
  validateAnnouncement,
} from "../announcements/announcementModel";
import { addAuditWrite } from "./auditService";

export function subscribeToAllAnnouncements(onUpdate, onError) {
  return onSnapshot(
    collection(db, "announcements"),
    (snapshot) => {
      const announcements = snapshot.docs.map((announcementDocument) =>
        normalizeAnnouncement({
          id: announcementDocument.id,
          ...announcementDocument.data(),
        }),
      );

      onUpdate?.(sortAnnouncementsNewestFirst(announcements));
    },
    onError,
  );
}

export async function createAnnouncement({ input, actorId }) {
  const validation = validateAnnouncement(input);

  if (!validation.valid) {
    throw new Error(validation.errors.join(" "));
  }

  const batch = writeBatch(db);
  const announcementReference = doc(collection(db, "announcements"));
  const auditReference = addAuditWrite(batch, {
    actorId,
    action: "announcement.created",
    entityType: "announcement",
    entityId: announcementReference.id,
    summary: `Created announcement: ${validation.value.title}`,
    details: {
      status: validation.value.status,
      type: validation.value.type,
    },
  });

  batch.set(announcementReference, {
    title: validation.value.title,
    summary: validation.value.summary,
    body: validation.value.body,
    type: validation.value.type,
    icon: validation.value.icon,
    status: validation.value.status,
    featured: validation.value.featured,
    version: validation.value.version,
    createdAt: serverTimestamp(),
    createdBy: actorId,
    updatedAt: serverTimestamp(),
    updatedBy: actorId,
    publishedAt:
      validation.value.status === "published" ? serverTimestamp() : null,
    lastAuditId: auditReference.id,
  });

  await batch.commit();
  return announcementReference.id;
}

export async function updateAnnouncement({ announcement, input, actorId }) {
  if (!announcement?.id) {
    throw new Error("Choose an announcement to update.");
  }

  const validation = validateAnnouncement(input);

  if (!validation.valid) {
    throw new Error(validation.errors.join(" "));
  }

  const batch = writeBatch(db);
  const announcementReference = doc(db, "announcements", announcement.id);
  const auditReference = addAuditWrite(batch, {
    actorId,
    action: "announcement.updated",
    entityType: "announcement",
    entityId: announcement.id,
    summary: `Updated announcement: ${validation.value.title}`,
    details: {
      previousStatus: announcement.status,
      nextStatus: validation.value.status,
      type: validation.value.type,
    },
  });

  const firstPublication =
    announcement.status !== "published" && validation.value.status === "published";

  batch.update(announcementReference, {
    title: validation.value.title,
    summary: validation.value.summary,
    body: validation.value.body,
    type: validation.value.type,
    icon: validation.value.icon,
    status: validation.value.status,
    featured: validation.value.featured,
    version: validation.value.version,
    updatedAt: serverTimestamp(),
    updatedBy: actorId,
    publishedAt: firstPublication
      ? serverTimestamp()
      : announcement.publishedAt ?? null,
    lastAuditId: auditReference.id,
  });

  await batch.commit();
}

export async function importBundledAnnouncements(actorId) {
  const snapshot = await getDocs(collection(db, "announcements"));
  const existingIds = new Set(snapshot.docs.map((announcement) => announcement.id));
  const announcementsToImport = getBundledAnnouncements().filter(
    (announcement) => !existingIds.has(announcement.id),
  );

  if (announcementsToImport.length === 0) {
    return 0;
  }

  const batch = writeBatch(db);

  announcementsToImport.forEach((announcement) => {
    const announcementReference = doc(db, "announcements", announcement.id);
    const auditReference = addAuditWrite(batch, {
      actorId,
      action: "announcement.imported",
      entityType: "announcement",
      entityId: announcement.id,
      summary: `Imported release history: ${announcement.title}`,
      details: { version: announcement.version, type: announcement.type },
    });

    batch.set(announcementReference, {
      title: announcement.title,
      summary: announcement.summary,
      body: announcement.body,
      type: announcement.type,
      icon: announcement.icon,
      status: "published",
      featured: announcement.featured,
      version: announcement.version,
      createdAt: serverTimestamp(),
      createdBy: actorId,
      updatedAt: serverTimestamp(),
      updatedBy: actorId,
      publishedAt: announcement.publishedAt ?? serverTimestamp(),
      lastAuditId: auditReference.id,
    });
  });

  await batch.commit();
  return announcementsToImport.length;
}
