import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { db } from "../../firebase";
import { serializeExportValue } from "../account/dataExportModel";

function mapSnapshot(snapshot) {
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

function sortNewest(items = [], field = "createdAt") {
  return [...items].sort((first, second) => {
    const firstDate = first[field]?.toDate?.() ?? new Date(first[field] ?? 0);
    const secondDate = second[field]?.toDate?.() ?? new Date(second[field] ?? 0);
    return secondDate.getTime() - firstDate.getTime();
  });
}

export function subscribeToLeagueEvidenceDecisions(
  { leagueId, categories = [], canViewAll = false },
  onUpdate,
  onError,
) {
  if (!leagueId || (!canViewAll && categories.length === 0)) {
    onUpdate?.([]);
    return () => {};
  }

  if (canViewAll) {
    return onSnapshot(
      query(
        collection(db, "seasonEvidenceDecisions"),
        where("leagueId", "==", leagueId),
      ),
      (snapshot) => onUpdate?.(sortNewest(mapSnapshot(snapshot))),
      onError,
    );
  }

  const categorySnapshots = new Map();
  const uniqueCategories = [...new Set(categories)].filter((category) =>
    ["water", "fruit", "running", "steps"].includes(category),
  );
  const publish = () => {
    const byId = new Map();
    categorySnapshots.forEach((items) => {
      items.forEach((item) => byId.set(item.id, item));
    });
    onUpdate?.(sortNewest([...byId.values()]));
  };

  const unsubscribers = uniqueCategories.map((category) =>
    onSnapshot(
      query(
        collection(db, "seasonEvidenceDecisions"),
        where("leagueId", "==", leagueId),
        where("category", "==", category),
      ),
      (snapshot) => {
        categorySnapshots.set(category, mapSnapshot(snapshot));
        publish();
      },
      onError,
    ),
  );

  return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
}

export function subscribeToLeagueLeaderboardSnapshots(leagueId, onUpdate, onError) {
  if (!leagueId) {
    onUpdate?.([]);
    return () => {};
  }
  return onSnapshot(
    query(
      collection(db, "leagueLeaderboardSnapshots"),
      where("leagueId", "==", leagueId),
    ),
    (snapshot) => onUpdate?.(sortNewest(mapSnapshot(snapshot), "publishedAt")),
    onError,
  );
}

export function createSeasonOperationsFilename(league, date = new Date()) {
  const safeName = String(league?.name || "season")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "season";
  const safeDate = date instanceof Date && !Number.isNaN(date.getTime())
    ? date.toISOString().slice(0, 10)
    : "report";
  return `champions-legacy-${safeName}-operations-${safeDate}.json`;
}

export function downloadSeasonOperationsReport(report, league, date = new Date()) {
  const portable = serializeExportValue(report);
  const blob = new Blob([`${JSON.stringify(portable, null, 2)}\n`], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = createSeasonOperationsFilename(league, date);
  anchor.hidden = true;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function subscribeToTrustedSeasonRuns(leagueId, onUpdate, onError) {
  if (!leagueId) {
    onUpdate?.([]);
    return () => {};
  }
  return onSnapshot(
    query(
      collection(db, "seasonTrustedRuns"),
      where("leagueId", "==", leagueId),
    ),
    (snapshot) => onUpdate?.(sortNewest(mapSnapshot(snapshot), "completedAt")),
    onError,
  );
}
