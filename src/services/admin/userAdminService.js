import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  writeBatch,
} from "firebase/firestore";

import { USER_ROLE_IDS } from "../../constants/admin";
import { db } from "../../firebase";
import { addAuditWrite } from "./auditService";

function sortUsers(users = []) {
  return [...users].sort((first, second) => {
    const firstName = first.displayName || first.fullName || first.email || "";
    const secondName = second.displayName || second.fullName || second.email || "";
    return firstName.localeCompare(secondName);
  });
}

export async function getUserPage({
  cursor = null,
  pageSize = 25,
} = {}) {
  const constraints = [orderBy("displayName"), limit(pageSize)];

  if (cursor) {
    constraints.splice(1, 0, startAfter(cursor));
  }

  const snapshot = await getDocs(
    query(collection(db, "users"), ...constraints),
  );
  const items = sortUsers(
    snapshot.docs.map((userDocument) => ({
      id: userDocument.id,
      ...userDocument.data(),
    })),
  );

  return {
    items,
    cursor: snapshot.docs.at(-1) ?? null,
    hasMore: snapshot.docs.length === pageSize,
  };
}

export async function updateUserAdministration({
  targetUser,
  role,
  actorId,
}) {
  if (!targetUser?.id) {
    throw new Error("Choose a valid player account.");
  }

  if (targetUser.id === actorId) {
    throw new Error("For safety, administrators cannot change their own trusted role here.");
  }

  if (!USER_ROLE_IDS.includes(role)) {
    throw new Error("Choose a valid player role.");
  }

  const batch = writeBatch(db);
  const userReference = doc(db, "users", targetUser.id);
  const auditReference = addAuditWrite(batch, {
    actorId,
    action: "user.access.updated",
    entityType: "user",
    entityId: targetUser.id,
    summary: `Updated trusted access for ${
      targetUser.displayName || targetUser.email || targetUser.id
    }`,
    details: {
      previousRole: targetUser.role ?? "user",
      nextRole: role,
    },
  });

  batch.update(userReference, {
    role,
    adminUpdatedAt: serverTimestamp(),
    adminUpdatedBy: actorId,
    lastAuditId: auditReference.id,
  });

  await batch.commit();
}
