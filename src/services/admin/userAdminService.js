import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
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

export function subscribeToUsers(onUpdate, onError) {
  return onSnapshot(
    collection(db, "users"),
    (snapshot) => {
      onUpdate?.(
        sortUsers(
          snapshot.docs.map((userDocument) => ({
            id: userDocument.id,
            ...userDocument.data(),
          })),
        ),
      );
    },
    onError,
  );
}

export async function updateUserAdministration({
  targetUser,
  role,
  team,
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

  const normalizedTeam = String(team ?? "").trim().slice(0, 80);
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
      previousTeam: targetUser.team ?? "",
      nextTeam: normalizedTeam,
    },
  });

  batch.update(userReference, {
    role,
    team: normalizedTeam,
    adminUpdatedAt: serverTimestamp(),
    adminUpdatedBy: actorId,
    lastAuditId: auditReference.id,
  });

  await batch.commit();
}
