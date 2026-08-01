import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
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

export function subscribeToAuditEvents(onUpdate, onError, maximum = 100) {
  const auditQuery = query(
    collection(db, "auditEvents"),
    orderBy("createdAt", "desc"),
    limit(maximum),
  );

  return onSnapshot(
    auditQuery,
    (snapshot) => {
      onUpdate?.(
        snapshot.docs.map((auditDocument) => ({
          id: auditDocument.id,
          ...auditDocument.data(),
        })),
      );
    },
    onError,
  );
}
