import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";

import { db } from "../../firebase";
import { DEFAULT_AVATAR_ID } from "../../constants/avatars";
import {
  DEFAULT_TEAM_EMBLEM_ID,
  TEAM_MEMBER_LIMIT,
} from "../../constants/teams";
import {
  createTeamInviteCode,
  normalizeTeamCode,
  validateTeamInput,
} from "./teamModel";

function mapSnapshot(snapshot) {
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

async function reserveInviteCode() {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const code = createTeamInviteCode();
    const snapshot = await getDoc(doc(db, "teamInvites", code));

    if (!snapshot.exists()) {
      return code;
    }
  }

  throw new Error("A unique team invitation code could not be created. Try again.");
}

export function subscribeToPlayerTeam(userId, onUpdate, onError) {
  if (!userId) {
    onUpdate?.(null);
    return () => {};
  }

  return onSnapshot(
    doc(db, "playerTeams", userId),
    (snapshot) => {
      onUpdate?.(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
    },
    onError,
  );
}

export function subscribeToTeam(teamId, onUpdate, onError) {
  if (!teamId) {
    onUpdate?.(null);
    return () => {};
  }

  return onSnapshot(
    doc(db, "teams", teamId),
    (snapshot) => {
      onUpdate?.(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
    },
    onError,
  );
}

export function subscribeToTeamMembers(teamId, onUpdate, onError) {
  if (!teamId) {
    onUpdate?.([]);
    return () => {};
  }

  return onSnapshot(
    collection(db, "teams", teamId, "members"),
    (snapshot) => onUpdate?.(mapSnapshot(snapshot)),
    onError,
  );
}

export async function createTeam({ userId, profile, input }) {
  if (!userId) {
    throw new Error("Sign in before creating a team.");
  }

  const validation = validateTeamInput(input);
  if (!validation.valid) {
    throw new Error(validation.errors.join(" "));
  }

  const existingMembership = await getDoc(doc(db, "playerTeams", userId));
  if (existingMembership.exists()) {
    throw new Error("Leave your current team before creating another one.");
  }

  const inviteCode = await reserveInviteCode();
  const teamReference = doc(collection(db, "teams"));
  const memberReference = doc(db, "teams", teamReference.id, "members", userId);
  const playerTeamReference = doc(db, "playerTeams", userId);
  const inviteReference = doc(db, "teamInvites", inviteCode);
  const batch = writeBatch(db);
  const displayName = profile?.displayName || profile?.fullName || "Champion";
  const avatarId = profile?.avatarId || DEFAULT_AVATAR_ID;

  batch.set(teamReference, {
    name: validation.value.name,
    normalizedName: validation.value.name.toLocaleLowerCase(),
    description: validation.value.description,
    motto: validation.value.motto,
    emblemId: validation.value.emblemId || DEFAULT_TEAM_EMBLEM_ID,
    status: "active",
    captainId: userId,
    memberCount: 1,
    inviteCode,
    createdAt: serverTimestamp(),
    createdBy: userId,
    updatedAt: serverTimestamp(),
    updatedBy: userId,
  });

  batch.set(memberReference, {
    userId,
    displayName,
    avatarId,
    role: "captain",
    inviteCode,
    joinedAt: serverTimestamp(),
    weeklyKey: "",
    weeklyPoints: 0,
    activeDays: 0,
    entriesRecorded: 0,
    currentStreak: 0,
    progressUpdatedAt: serverTimestamp(),
  });

  batch.set(playerTeamReference, {
    userId,
    teamId: teamReference.id,
    teamName: validation.value.name,
    emblemId: validation.value.emblemId,
    role: "captain",
    joinedAt: serverTimestamp(),
  });

  batch.set(inviteReference, {
    teamId: teamReference.id,
    teamName: validation.value.name,
    emblemId: validation.value.emblemId,
    status: "active",
    createdAt: serverTimestamp(),
    createdBy: userId,
    updatedAt: serverTimestamp(),
    updatedBy: userId,
  });

  await batch.commit();
  return teamReference.id;
}

export async function joinTeam({ userId, profile, code }) {
  if (!userId) {
    throw new Error("Sign in before joining a team.");
  }

  const inviteCode = normalizeTeamCode(code);
  if (inviteCode.length !== 8) {
    throw new Error("Enter the complete 8-character team invitation code.");
  }

  return runTransaction(db, async (transaction) => {
    const membershipReference = doc(db, "playerTeams", userId);
    const inviteReference = doc(db, "teamInvites", inviteCode);
    const [existingMembership, inviteSnapshot] = await Promise.all([
      transaction.get(membershipReference),
      transaction.get(inviteReference),
    ]);

    if (existingMembership.exists()) {
      throw new Error("You already belong to a team.");
    }

    if (!inviteSnapshot.exists() || inviteSnapshot.data().status !== "active") {
      throw new Error("That team invitation is unavailable or has expired.");
    }

    const invite = inviteSnapshot.data();
    const teamReference = doc(db, "teams", invite.teamId);
    const teamSnapshot = await transaction.get(teamReference);

    if (!teamSnapshot.exists() || teamSnapshot.data().status !== "active") {
      throw new Error("That team is not currently accepting members.");
    }

    const team = teamSnapshot.data();
    const memberCount = Number(team.memberCount ?? 0);
    if (memberCount >= TEAM_MEMBER_LIMIT) {
      throw new Error("This team has reached its 25-player limit.");
    }

    const displayName = profile?.displayName || profile?.fullName || "Champion";
    const avatarId = profile?.avatarId || DEFAULT_AVATAR_ID;

    transaction.set(doc(db, "teams", invite.teamId, "members", userId), {
      userId,
      displayName,
      avatarId,
      role: "member",
      inviteCode,
      joinedAt: serverTimestamp(),
      weeklyKey: "",
      weeklyPoints: 0,
      activeDays: 0,
      entriesRecorded: 0,
      currentStreak: 0,
      progressUpdatedAt: serverTimestamp(),
    });

    transaction.set(membershipReference, {
      userId,
      teamId: invite.teamId,
      teamName: team.name,
      emblemId: team.emblemId,
      role: "member",
      joinedAt: serverTimestamp(),
    });

    transaction.update(teamReference, {
      memberCount: memberCount + 1,
      updatedAt: serverTimestamp(),
      updatedBy: userId,
    });

    return invite.teamId;
  });
}

export async function updateTeam({ teamId, userId, input }) {
  const validation = validateTeamInput(input);

  if (!validation.valid) {
    throw new Error(validation.errors.join(" "));
  }

  await updateDoc(doc(db, "teams", teamId), {
    description: validation.value.description,
    motto: validation.value.motto,
    emblemId: validation.value.emblemId,
    updatedAt: serverTimestamp(),
    updatedBy: userId,
  });
}

export async function syncTeamMemberProgress({
  teamId,
  userId,
  displayName,
  avatarId,
  snapshot,
}) {
  if (!teamId || !userId || !snapshot) {
    return;
  }

  await updateDoc(doc(db, "teams", teamId, "members", userId), {
    displayName: displayName || "Champion",
    avatarId: avatarId || DEFAULT_AVATAR_ID,
    weeklyKey: snapshot.weeklyKey,
    weeklyPoints: Math.max(
      0,
      Math.round((Number(snapshot.weeklyPoints) || 0) * 100) / 100,
    ),
    activeDays: Math.max(0, Math.round(Number(snapshot.activeDays) || 0)),
    entriesRecorded: Math.max(0, Math.round(Number(snapshot.entriesRecorded) || 0)),
    currentStreak: Math.max(0, Math.round(Number(snapshot.currentStreak) || 0)),
    progressUpdatedAt: serverTimestamp(),
  });
}


export async function transferTeamCaptain({
  teamId,
  currentCaptainId,
  nextCaptainId,
}) {
  if (!teamId || !currentCaptainId || !nextCaptainId) {
    throw new Error("Choose a team member to become captain.");
  }

  if (currentCaptainId === nextCaptainId) {
    throw new Error("Choose a different team member.");
  }

  const nextMemberSnapshot = await getDoc(
    doc(db, "teams", teamId, "members", nextCaptainId),
  );

  if (!nextMemberSnapshot.exists()) {
    throw new Error("The selected player is no longer part of this team.");
  }

  const batch = writeBatch(db);
  batch.update(doc(db, "teams", teamId), {
    captainId: nextCaptainId,
    updatedAt: serverTimestamp(),
    updatedBy: currentCaptainId,
  });
  batch.update(doc(db, "teams", teamId, "members", currentCaptainId), {
    role: "member",
  });
  batch.update(doc(db, "teams", teamId, "members", nextCaptainId), {
    role: "captain",
  });
  batch.update(doc(db, "playerTeams", currentCaptainId), {
    role: "member",
  });
  batch.update(doc(db, "playerTeams", nextCaptainId), {
    role: "captain",
  });
  await batch.commit();
}

export async function leaveTeam({ teamId, userId, role }) {
  if (role === "captain") {
    throw new Error("Transfer captaincy before leaving the team.");
  }

  await runTransaction(db, async (transaction) => {
    const teamReference = doc(db, "teams", teamId);
    const teamSnapshot = await transaction.get(teamReference);

    if (!teamSnapshot.exists()) {
      throw new Error("This team is no longer available.");
    }

    const memberCount = Number(teamSnapshot.data().memberCount ?? 0);
    transaction.update(teamReference, {
      memberCount: Math.max(1, memberCount - 1),
      updatedAt: serverTimestamp(),
      updatedBy: userId,
    });
    transaction.delete(doc(db, "teams", teamId, "members", userId));
    transaction.delete(doc(db, "playerTeams", userId));
  });
}
