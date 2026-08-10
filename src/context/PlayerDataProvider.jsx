import { useMemo } from "react";

import useAuth from "../hooks/useAuth";
import useDashboardData from "../hooks/useDashboardData";
import { isPlatformAdministrator } from "../services/admin/adminAuthorityModel";
import {
  buildEntryDateIndex,
  buildJournalDateSummaries,
  resolveEntryHistory,
} from "../services/entries/entryHistoryModel";
import { getProgressionSummary } from "../services/progression";
import { PlayerDataContext } from "./PlayerDataContext";

export function PlayerDataProvider({ children }) {
  const { user, claims } = useAuth();
  const data = useDashboardData(user?.uid);
  const resolvedHistory = useMemo(
    () =>
      resolveEntryHistory({
        entries: data.entries ?? [],
        correctionHeads: data.correctionHeads ?? [],
        corrections: data.entryCorrections ?? [],
      }),
    [data.correctionHeads, data.entries, data.entryCorrections],
  );
  const activeEntries = resolvedHistory.activeEntries;
  const entryDateIndex = useMemo(
    () => buildEntryDateIndex(activeEntries),
    [activeEntries],
  );
  const entryHistoryDateIndex = useMemo(
    () => buildEntryDateIndex(resolvedHistory.historyEntries),
    [resolvedHistory.historyEntries],
  );
  const journalDateSummaries = useMemo(
    () => buildJournalDateSummaries(activeEntries),
    [activeEntries],
  );
  const progression = useMemo(
    () => getProgressionSummary(activeEntries),
    [activeEntries],
  );
  const isPlatformAdmin = isPlatformAdministrator(data.profile);

  const value = useMemo(
    () => ({
      ...data,
      rawEntries: data.entries ?? [],
      entries: activeEntries,
      entryHistory: resolvedHistory.historyEntries,
      entryHistoryWarnings: resolvedHistory.warnings,
      entryDateIndex,
      entryHistoryDateIndex,
      journalDateSummaries,
      user,
      claims,
      isPlatformAdmin,
      progression,
    }),
    [
      activeEntries,
      claims,
      data,
      entryDateIndex,
      entryHistoryDateIndex,
      isPlatformAdmin,
      journalDateSummaries,
      progression,
      resolvedHistory.historyEntries,
      resolvedHistory.warnings,
      user,
    ],
  );

  return (
    <PlayerDataContext.Provider value={value}>
      {children}
    </PlayerDataContext.Provider>
  );
}
