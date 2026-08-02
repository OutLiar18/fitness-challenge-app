import { useEffect, useMemo, useRef, useState } from "react";

import usePlayerData from "../hooks/usePlayerData";
import {
  subscribeToPlayerTeam,
  subscribeToTeam,
  subscribeToTeamMembers,
  syncTeamMemberProgress,
} from "../services/teams/teamService";
import { calculateTeamMemberSnapshot } from "../services/teams/teamModel";
import { TeamContext } from "./TeamContext";

const EMPTY_ITEMS = Object.freeze([]);

function createItemState() {
  return { key: "", item: null, loaded: false, error: "" };
}

function createListState() {
  return { key: "", items: [], loaded: false, error: "" };
}

export function TeamProvider({ children }) {
  const { user, profile, entries, progression } = usePlayerData();
  const [membershipState, setMembershipState] = useState(createItemState);
  const [teamState, setTeamState] = useState(createItemState);
  const [membersState, setMembersState] = useState(createListState);
  const lastSyncFingerprint = useRef("");

  const userId = user?.uid || "";
  const membership =
    membershipState.key === userId ? membershipState.item : null;
  const teamId = membership?.teamId || "";
  const team = teamState.key === teamId ? teamState.item : null;
  const members =
    membersState.key === teamId ? membersState.items : EMPTY_ITEMS;

  useEffect(() => {
    if (!userId) {
      return undefined;
    }

    return subscribeToPlayerTeam(
      userId,
      (item) => {
        setMembershipState({
          key: userId,
          item,
          loaded: true,
          error: "",
        });
      },
      (subscriptionError) => {
        setMembershipState({
          key: userId,
          item: null,
          loaded: true,
          error:
            subscriptionError.message ||
            "Your team membership could not be loaded.",
        });
      },
    );
  }, [userId]);

  useEffect(() => {
    if (!teamId) {
      return undefined;
    }

    return subscribeToTeam(
      teamId,
      (item) =>
        setTeamState({
          key: teamId,
          item,
          loaded: true,
          error: "",
        }),
      (subscriptionError) =>
        setTeamState({
          key: teamId,
          item: null,
          loaded: true,
          error: subscriptionError.message || "Your team could not be loaded.",
        }),
    );
  }, [teamId]);

  useEffect(() => {
    if (!teamId) {
      return undefined;
    }

    return subscribeToTeamMembers(
      teamId,
      (items) =>
        setMembersState({
          key: teamId,
          items,
          loaded: true,
          error: "",
        }),
      (subscriptionError) =>
        setMembersState({
          key: teamId,
          items: [],
          loaded: true,
          error:
            subscriptionError.message || "The team roster could not be loaded.",
        }),
    );
  }, [teamId]);

  useEffect(() => {
    if (!teamId || !userId || !profile) {
      return;
    }

    const snapshot = calculateTeamMemberSnapshot(entries, progression);
    const fingerprint = JSON.stringify({
      teamId,
      userId,
      displayName: profile.displayName,
      avatarId: profile.avatarId,
      ...snapshot,
    });

    if (lastSyncFingerprint.current === fingerprint) {
      return;
    }

    lastSyncFingerprint.current = fingerprint;
    syncTeamMemberProgress({
      teamId,
      userId,
      displayName: profile.displayName,
      avatarId: profile.avatarId,
      snapshot,
    }).catch((syncError) => {
      lastSyncFingerprint.current = "";
      console.error(syncError);
    });
  }, [entries, profile, progression, teamId, userId]);

  const loading = Boolean(
    userId &&
      (!membershipState.loaded || membershipState.key !== userId ||
        (teamId &&
          (!teamState.loaded ||
            teamState.key !== teamId ||
            !membersState.loaded ||
            membersState.key !== teamId))),
  );

  const error = [
    membershipState.key === userId ? membershipState.error : "",
    teamState.key === teamId ? teamState.error : "",
    membersState.key === teamId ? membersState.error : "",
  ]
    .filter(Boolean)
    .join(" ");

  const value = useMemo(
    () => ({ membership, team, members, loading, error }),
    [error, loading, members, membership, team],
  );

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
}
