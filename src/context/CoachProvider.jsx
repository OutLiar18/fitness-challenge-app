import { useEffect, useMemo, useState } from "react";

import { DEFAULT_COACH_PREFERENCES } from "../constants/coach";
import usePlayerData from "../hooks/usePlayerData";
import { createCoachReport } from "../services/coach/coachModel";
import { subscribeToCoachPreferences } from "../services/coach/coachService";
import { CoachContext } from "./CoachContext";

export function CoachProvider({ children }) {
  const { user, entries } = usePlayerData();
  const [preferences, setPreferences] = useState(DEFAULT_COACH_PREFERENCES);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.uid) {
      return undefined;
    }

    return subscribeToCoachPreferences(
      user.uid,
      (nextPreferences) => {
        setPreferences(nextPreferences);
        setError("");
      },
      (subscriptionError) =>
        setError(subscriptionError.message || "Legacy Coach preferences could not be loaded."),
    );
  }, [user?.uid]);

  const report = useMemo(
    () => createCoachReport(entries, preferences),
    [entries, preferences],
  );

  const value = useMemo(
    () => ({ preferences, report, error }),
    [error, preferences, report],
  );

  return <CoachContext.Provider value={value}>{children}</CoachContext.Provider>;
}
