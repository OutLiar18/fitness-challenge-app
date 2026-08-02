import { useEffect, useMemo, useState } from "react";

import usePlayerData from "../hooks/usePlayerData";
import {
  subscribeToAllLeagues,
  subscribeToManagedLeagues,
  subscribeToPlayerLeagueMemberships,
  subscribeToPublishedLeagues,
} from "../services/leagues/leagueService";
import { LeagueContext } from "./LeagueContext";

const EMPTY_ITEMS = Object.freeze([]);

function mergeById(...collections) {
  return [...new Map(collections.flat().map((item) => [item.id, item])).values()];
}

function createSubscriptionState() {
  return { key: "", items: [], loaded: false, error: "" };
}

export function LeagueProvider({ children }) {
  const { user, profile, isPlatformAdmin } = usePlayerData();
  const [membershipState, setMembershipState] = useState(createSubscriptionState);
  const [publishedState, setPublishedState] = useState(createSubscriptionState);
  const [managedState, setManagedState] = useState(createSubscriptionState);
  const [adminState, setAdminState] = useState(createSubscriptionState);

  const userId = user?.uid || "";
  const role = profile?.role || "user";
  const membershipKey = userId;
  const publishedKey = userId && !isPlatformAdmin ? userId : "";
  const managedKey =
    userId && !isPlatformAdmin && role === "leagueAdmin" ? userId : "";
  const adminKey = userId && isPlatformAdmin ? userId : "";

  useEffect(() => {
    if (!membershipKey) {
      return undefined;
    }

    return subscribeToPlayerLeagueMemberships(
      membershipKey,
      (items) =>
        setMembershipState({
          key: membershipKey,
          items,
          loaded: true,
          error: "",
        }),
      (subscriptionError) =>
        setMembershipState({
          key: membershipKey,
          items: [],
          loaded: true,
          error:
            subscriptionError.message ||
            "Your league memberships could not be loaded.",
        }),
    );
  }, [membershipKey]);

  useEffect(() => {
    if (!publishedKey) {
      return undefined;
    }

    return subscribeToPublishedLeagues(
      (items) =>
        setPublishedState({
          key: publishedKey,
          items,
          loaded: true,
          error: "",
        }),
      (subscriptionError) =>
        setPublishedState({
          key: publishedKey,
          items: [],
          loaded: true,
          error:
            subscriptionError.message ||
            "Published leagues could not be loaded.",
        }),
    );
  }, [publishedKey]);

  useEffect(() => {
    if (!managedKey) {
      return undefined;
    }

    return subscribeToManagedLeagues(
      managedKey,
      (items) =>
        setManagedState({
          key: managedKey,
          items,
          loaded: true,
          error: "",
        }),
      (subscriptionError) =>
        setManagedState({
          key: managedKey,
          items: [],
          loaded: true,
          error:
            subscriptionError.message ||
            "Managed leagues could not be loaded.",
        }),
    );
  }, [managedKey]);

  useEffect(() => {
    if (!adminKey) {
      return undefined;
    }

    return subscribeToAllLeagues(
      (items) =>
        setAdminState({
          key: adminKey,
          items,
          loaded: true,
          error: "",
        }),
      (subscriptionError) =>
        setAdminState({
          key: adminKey,
          items: [],
          loaded: true,
          error: subscriptionError.message || "Leagues could not be loaded.",
        }),
    );
  }, [adminKey]);

  const memberships =
    membershipState.key === membershipKey ? membershipState.items : EMPTY_ITEMS;
  const publishedLeagues =
    publishedState.key === publishedKey ? publishedState.items : EMPTY_ITEMS;
  const managedLeagues =
    managedState.key === managedKey ? managedState.items : EMPTY_ITEMS;
  const adminLeagues =
    adminState.key === adminKey ? adminState.items : EMPTY_ITEMS;

  const leagues = useMemo(() => {
    const visibleLeagues = isPlatformAdmin
      ? adminLeagues
      : mergeById(publishedLeagues, managedLeagues);

    return [...visibleLeagues].sort((first, second) =>
      String(first.name).localeCompare(String(second.name)),
    );
  }, [adminLeagues, isPlatformAdmin, managedLeagues, publishedLeagues]);

  const loading = Boolean(
    userId &&
      (!membershipState.loaded || membershipState.key !== membershipKey ||
        (isPlatformAdmin
          ? !adminState.loaded || adminState.key !== adminKey
          : !publishedState.loaded || publishedState.key !== publishedKey ||
            (role === "leagueAdmin" &&
              (!managedState.loaded || managedState.key !== managedKey)))),
  );

  const error = [
    membershipState.key === membershipKey ? membershipState.error : "",
    isPlatformAdmin && adminState.key === adminKey ? adminState.error : "",
    !isPlatformAdmin && publishedState.key === publishedKey
      ? publishedState.error
      : "",
    !isPlatformAdmin && role === "leagueAdmin" && managedState.key === managedKey
      ? managedState.error
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  const value = useMemo(
    () => ({
      leagues,
      memberships,
      loading,
      error,
      canManageLeagues: isPlatformAdmin || role === "leagueAdmin",
    }),
    [error, isPlatformAdmin, leagues, loading, memberships, role],
  );

  return <LeagueContext.Provider value={value}>{children}</LeagueContext.Provider>;
}
