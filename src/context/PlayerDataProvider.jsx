import { useMemo } from "react";

import useAuth from "../hooks/useAuth";
import useDashboardData from "../hooks/useDashboardData";
import { PlayerDataContext } from "./PlayerDataContext";

export function PlayerDataProvider({ children }) {
  const { user } = useAuth();
  const data = useDashboardData(user?.uid);

  const value = useMemo(
    () => ({
      ...data,
      user,
    }),
    [data, user],
  );

  return (
    <PlayerDataContext.Provider value={value}>
      {children}
    </PlayerDataContext.Provider>
  );
}
