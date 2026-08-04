import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";

import { db } from "../../firebase";
import { addAuditWrite } from "./auditService";

function sortRequestsNewestFirst(requests) {
  return [...requests].sort((first, second) => {
    const firstMillis = first.requestedAt?.toMillis?.() ?? 0;
    const secondMillis = second.requestedAt?.toMillis?.() ?? 0;
    return secondMillis - firstMillis;
  });
}

export function subscribeToAccountDeletionRequests(onUpdate, onError) {
  const requestsQuery = query(
    collection(db, "accountDeletionRequests"),
    orderBy("requestedAt", "desc"),
  );

  return onSnapshot(
    requestsQuery,
    (snapshot) => {
      const requests = snapshot.docs.map((requestDocument) => ({
        id: requestDocument.id,
        ...requestDocument.data(),
      }));
      onUpdate?.(sortRequestsNewestFirst(requests));
    },
    onError,
  );
}

export async function acknowledgeAccountDeletionRequest({ request, actorId }) {
  if (!request?.id || !request?.userId) {
    throw new Error("A valid account deletion request is required.");
  }

  if (!actorId) {
    throw new Error("A Platform Administrator is required.");
  }

  if (request.status !== "requested") {
    throw new Error("Only newly requested account deletions can be acknowledged.");
  }

  const batch = writeBatch(db);
  const auditReference = addAuditWrite(batch, {
    actorId,
    action: "account.deletion.acknowledged",
    entityType: "accountDeletionRequest",
    entityId: request.id,
    summary: `Acknowledged the account deletion request for ${request.displayName || request.userId}`,
    details: {
      userId: request.userId,
      reasonCode: request.reasonCode || "prefer-not-to-say",
    },
  });

  batch.update(doc(db, "accountDeletionRequests", request.id), {
    status: "acknowledged",
    acknowledgedAt: serverTimestamp(),
    acknowledgedBy: actorId,
    updatedAt: serverTimestamp(),
    lastAuditId: auditReference.id,
  });

  await batch.commit();
}
