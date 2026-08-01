import { useMemo } from "react";

import useAuth from "../hooks/useAuth";
import useDashboardData from "../hooks/useDashboardData";
import { getProgressionSummary } from "../services/progression";
import { PlayerDataContext } from "./PlayerDataContext";

export function PlayerDataProvider({ children }) {
  const { user, claims } = useAuth();
  const data = useDashboardData(user?.uid);
  const progression = useMemo(
    () => getProgressionSummary(data.entries ?? []),
    [data.entries],
  );
  const isPlatformAdmin =
    claims?.admin === true || data.profile?.role === "admin";

  const value = useMemo(
    () => ({
      ...data,
      user,
      claims,
      isPlatformAdmin,
      progression,
    }),
    [claims, data, isPlatformAdmin, progression, user],
  );

  return (
    <PlayerDataContext.Provider value={value}>
      {children}
    </PlayerDataContext.Provider>
  );
}
