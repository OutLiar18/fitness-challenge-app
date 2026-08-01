import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
} from "firebase/firestore";

import { db } from "../../firebase";

export function addAuditWrite(
  batch,
  {
    actorId,
    action,
    entityType,
    entityId,
    summary,
    details = {},
  },
) {
  const auditReference = doc(collection(db, "auditEvents"));

  batch.set(auditReference, {
    actorId,
    action,
    entityType,
    entityId,
    summary,
    details,
    createdAt: serverTimestamp(),
  });

  return auditReference;
}

export async function getAuditEventPage({
  cursor = null,
  pageSize = 30,
} = {}) {
  const constraints = [orderBy("createdAt", "desc"), limit(pageSize)];

  if (cursor) {
    constraints.splice(1, 0, startAfter(cursor));
  }

  const snapshot = await getDocs(
    query(collection(db, "auditEvents"), ...constraints),
  );

  return {
    items: snapshot.docs.map((auditDocument) => ({
      id: auditDocument.id,
      ...auditDocument.data(),
    })),
    cursor: snapshot.docs.at(-1) ?? null,
    hasMore: snapshot.docs.length === pageSize,
  };
}
