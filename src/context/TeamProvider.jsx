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

export function TeamProvider({ children }) {
  const { user, profile, entries, progression } = usePlayerData();
  const [membership, setMembership] = useState(null);
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const lastSyncFingerprint = useRef("");

  useEffect(() => {
    if (!user?.uid) {
      return undefined;
    }

    return subscribeToPlayerTeam(
      user.uid,
      (nextMembership) => {
        setMembership(nextMembership);

        if (!nextMembership) {
          setTeam(null);
          setMembers([]);
          lastSyncFingerprint.current = "";
        }

        setLoading(false);
        setError("");
      },
      (subscriptionError) => {
        setError(subscriptionError.message || "Your team membership could not be loaded.");
        setLoading(false);
      },
    );
  }, [user?.uid]);

  useEffect(() => {
    if (!membership?.teamId) {
      return undefined;
    }

    const unsubscribeTeam = subscribeToTeam(
      membership.teamId,
      setTeam,
      (subscriptionError) =>
        setError(subscriptionError.message || "Your team could not be loaded."),
    );
    const unsubscribeMembers = subscribeToTeamMembers(
      membership.teamId,
      setMembers,
      (subscriptionError) =>
        setError(subscriptionError.message || "The team roster could not be loaded."),
    );

    return () => {
      unsubscribeTeam();
      unsubscribeMembers();
    };
  }, [membership?.teamId]);

  useEffect(() => {
    if (!membership?.teamId || !user?.uid || !profile) {
      return;
    }

    const snapshot = calculateTeamMemberSnapshot(entries, progression);
    const fingerprint = JSON.stringify({
      teamId: membership.teamId,
      userId: user.uid,
      displayName: profile.displayName,
      avatarId: profile.avatarId,
      ...snapshot,
    });

    if (lastSyncFingerprint.current === fingerprint) {
      return;
    }

    lastSyncFingerprint.current = fingerprint;
    syncTeamMemberProgress({
      teamId: membership.teamId,
      userId: user.uid,
      displayName: profile.displayName,
      avatarId: profile.avatarId,
      snapshot,
    }).catch((syncError) => {
      lastSyncFingerprint.current = "";
      console.error(syncError);
    });
  }, [entries, membership?.teamId, profile, progression, user?.uid]);

  const value = useMemo(
    () => ({ membership, team, members, loading, error }),
    [error, loading, members, membership, team],
  );

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
}
