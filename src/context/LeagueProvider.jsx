import { useEffect, useMemo, useState } from "react";

import usePlayerData from "../hooks/usePlayerData";
import {
  subscribeToAllLeagues,
  subscribeToManagedLeagues,
  subscribeToPlayerLeagueMemberships,
  subscribeToPublishedLeagues,
} from "../services/leagues/leagueService";
import { LeagueContext } from "./LeagueContext";

function mergeById(...collections) {
  return [...new Map(collections.flat().map((item) => [item.id, item])).values()];
}

export function LeagueProvider({ children }) {
  const { user, profile, isPlatformAdmin } = usePlayerData();
  const [publishedLeagues, setPublishedLeagues] = useState([]);
  const [managedLeagues, setManagedLeagues] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.uid) {
      return undefined;
    }

    return subscribeToPlayerLeagueMemberships(
      user.uid,
      setMemberships,
      (subscriptionError) =>
        setError(subscriptionError.message || "Your league memberships could not be loaded."),
    );
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) {
      return undefined;
    }

    if (isPlatformAdmin) {
      return subscribeToAllLeagues(
        setManagedLeagues,
        (subscriptionError) =>
          setError(subscriptionError.message || "Leagues could not be loaded."),
      );
    }

    const unsubscribePublished = subscribeToPublishedLeagues(
      setPublishedLeagues,
      (subscriptionError) =>
        setError(subscriptionError.message || "Published leagues could not be loaded."),
    );

    const unsubscribeManaged =
      profile?.role === "leagueAdmin"
        ? subscribeToManagedLeagues(
            user.uid,
            setManagedLeagues,
            (subscriptionError) =>
              setError(subscriptionError.message || "Managed leagues could not be loaded."),
          )
        : () => {};

    return () => {
      unsubscribePublished();
      unsubscribeManaged();
    };
  }, [isPlatformAdmin, profile?.role, user?.uid]);

  const leagues = useMemo(
    () =>
      mergeById(publishedLeagues, managedLeagues).sort((first, second) =>
        String(first.name).localeCompare(String(second.name)),
      ),
    [managedLeagues, publishedLeagues],
  );

  const value = useMemo(
    () => ({
      leagues,
      memberships,
      error,
      canManageLeagues: isPlatformAdmin || profile?.role === "leagueAdmin",
    }),
    [error, isPlatformAdmin, leagues, memberships, profile?.role],
  );

  return <LeagueContext.Provider value={value}>{children}</LeagueContext.Provider>;
}
