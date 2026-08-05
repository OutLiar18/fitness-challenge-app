import {
  doc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../firebase";
import {
  ACCOUNT_REQUEST_ACKNOWLEDGEMENT_VERSION,
  createAccountDeletionRequestDefaults,
  normalizeAccountRequestReason,
} from "./accountModel";

function getRequestReference(userId) {
  return doc(db, "accountDeletionRequests", userId);
}

export function subscribeToAccountDeletionRequest(userId, onUpdate, onError) {
  if (!userId) {
    onUpdate?.(null);
    return () => {};
  }

  return onSnapshot(
    getRequestReference(userId),
    (snapshot) => {
      onUpdate?.(
        snapshot.exists()
          ? { id: snapshot.id, ...snapshot.data() }
          : null,
      );
    },
    onError,
  );
}

export async function submitAccountDeletionRequest({
  userId,
  email,
  displayName,
  reasonCode,
}) {
  if (!userId) {
    throw new Error("A signed-in player is required to request account deletion.");
  }

  const requestReference = getRequestReference(userId);
  const normalizedReason = normalizeAccountRequestReason(reasonCode);

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(requestReference);

    if (!snapshot.exists()) {
      transaction.set(requestReference, {
        userId,
        email: String(email || "").trim(),
        displayName: String(displayName || "Champion").trim() || "Champion",
        status: "requested",
        reasonCode: normalizedReason,
        acknowledgementVersion: ACCOUNT_REQUEST_ACKNOWLEDGEMENT_VERSION,
        requestedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        cancelledAt: null,
        acknowledgedAt: null,
        acknowledgedBy: "",
        lastAuditId: "",
        ...createAccountDeletionRequestDefaults(),
      });
      return;
    }

    const current = snapshot.data();
    if (current.status !== "cancelled") {
      throw new Error("An account deletion request is already active.");
    }

    transaction.update(requestReference, {
      email: String(email || current.email || "").trim(),
      displayName:
        String(displayName || current.displayName || "Champion").trim()
        || "Champion",
      status: "requested",
      reasonCode: normalizedReason,
      acknowledgementVersion: ACCOUNT_REQUEST_ACKNOWLEDGEMENT_VERSION,
      requestedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      cancelledAt: null,
      acknowledgedAt: null,
      acknowledgedBy: "",
      lastAuditId: "",
      ...createAccountDeletionRequestDefaults(),
    });
  });
}

export async function cancelAccountDeletionRequest(userId) {
  if (!userId) {
    throw new Error("A signed-in player is required to cancel this request.");
  }

  await updateDoc(getRequestReference(userId), {
    status: "cancelled",
    cancelledAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}
