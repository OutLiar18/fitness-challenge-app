import { getLocalDateKey, toDate } from "../dateService";
import { calculateEntryPoints } from "../points";

export const JOURNAL_HISTORY_PAGE_SIZE = 7;

function getTimestampMillis(value) {
  if (typeof value?.toMillis === "function") {
    return value.toMillis();
  }

  const date = toDate(value);
  return date?.getTime() ?? 0;
}

function getEntrySortValue(entry) {
  return Math.max(
    getTimestampMillis(entry?.createdAt),
    getTimestampMillis(entry?.challengeDate),
  );
}

function sortNewestFirst(entries = []) {
  return [...entries].sort(
    (first, second) => getEntrySortValue(second) - getEntrySortValue(first),
  );
}

function getEntryRootId(entry) {
  return entry?.correctionRootEntryId || entry?.id || "";
}

function getCorrectionSortValue(correction) {
  const sequence = Number(correction?.sequence ?? 0);
  return sequence * 10 ** 15 + getTimestampMillis(correction?.createdAt);
}

export function resolveEntryHistory({
  entries = [],
  correctionHeads = [],
  corrections = [],
} = {}) {
  const entriesById = new Map(entries.map((entry) => [entry.id, entry]));
  const headsByRoot = new Map(
    correctionHeads
      .filter((head) => head?.rootEntryId)
      .map((head) => [head.rootEntryId, head]),
  );
  const correctionsByRoot = new Map();

  corrections.forEach((correction) => {
    const rootEntryId = correction?.rootEntryId;
    if (!rootEntryId) return;
    const current = correctionsByRoot.get(rootEntryId) ?? [];
    current.push(correction);
    correctionsByRoot.set(rootEntryId, current);
  });

  correctionsByRoot.forEach((items, rootEntryId) => {
    correctionsByRoot.set(
      rootEntryId,
      [...items].sort(
        (first, second) => getCorrectionSortValue(first) - getCorrectionSortValue(second),
      ),
    );
  });

  const warnings = [];
  const currentEntryIdByRoot = new Map();

  headsByRoot.forEach((head, rootEntryId) => {
    if (entriesById.has(head.currentEntryId)) {
      currentEntryIdByRoot.set(rootEntryId, head.currentEntryId);
      return;
    }

    const chainEntries = entries.filter(
      (entry) => getEntryRootId(entry) === rootEntryId,
    );
    const fallback = [...chainEntries].sort(
      (first, second) =>
        Number(second.correctionSequence ?? 0) - Number(first.correctionSequence ?? 0),
    )[0];

    if (fallback?.id) {
      currentEntryIdByRoot.set(rootEntryId, fallback.id);
      warnings.push({
        code: "HEAD_CURRENT_ENTRY_MISSING",
        rootEntryId,
        message:
          "The correction head points to a missing entry. The newest available correction is being used for personal statistics until an administrator reconciles the chain.",
      });
    }
  });

  correctionsByRoot.forEach((items, rootEntryId) => {
    if (currentEntryIdByRoot.has(rootEntryId)) return;
    const latestCorrection = items.at(-1);
    if (entriesById.has(latestCorrection?.replacementEntryId)) {
      currentEntryIdByRoot.set(rootEntryId, latestCorrection.replacementEntryId);
      warnings.push({
        code: "CORRECTION_HEAD_MISSING",
        rootEntryId,
        message:
          "A correction record exists without a readable correction head. The newest replacement is being used while an administrator reconciles the chain.",
      });
    }
  });

  const rootsWithoutCurrent = new Set(entries.map(getEntryRootId));
  rootsWithoutCurrent.forEach((rootEntryId) => {
    if (!rootEntryId || currentEntryIdByRoot.has(rootEntryId)) return;
    const chainEntries = entries.filter(
      (entry) => getEntryRootId(entry) === rootEntryId,
    );
    if (chainEntries.length <= 1) return;
    const fallback = [...chainEntries].sort(
      (first, second) =>
        Number(second.correctionSequence ?? 0) - Number(first.correctionSequence ?? 0),
    )[0];
    if (fallback?.id) {
      currentEntryIdByRoot.set(rootEntryId, fallback.id);
      warnings.push({
        code: "CORRECTION_RECORD_MISSING",
        rootEntryId,
        message:
          "Multiple immutable entry versions are present without a readable correction record. The newest replacement is being used until reconciliation.",
      });
    }
  });

  const historyEntries = sortNewestFirst(
    entries.map((entry) => {
      const rootEntryId = getEntryRootId(entry);
      const head = headsByRoot.get(rootEntryId) ?? null;
      const chain = correctionsByRoot.get(rootEntryId) ?? [];
      const currentEntryId = currentEntryIdByRoot.get(rootEntryId) || entry.id;
      const isCurrent = currentEntryId === entry.id;

      return {
        ...entry,
        correction: {
          rootEntryId,
          currentEntryId,
          sequence: Number(entry.correctionSequence ?? 0),
          isCorrected: Boolean(head || entry.source === "correction"),
          isCurrent,
          isSuperseded: !isCurrent,
          chain,
          head,
        },
      };
    }),
  );

  return {
    activeEntries: historyEntries.filter((entry) => !entry.correction.isSuperseded),
    historyEntries,
    warnings,
  };
}

export function buildEntryDateIndex(entries = []) {
  const index = new Map();

  sortNewestFirst(entries).forEach((entry) => {
    const dateKey = getLocalDateKey(entry?.challengeDate);
    if (!dateKey) return;
    const current = index.get(dateKey) ?? [];
    current.push(entry);
    index.set(dateKey, current);
  });

  return index;
}

export function buildJournalDateSummaries(entries = []) {
  const index = buildEntryDateIndex(entries);

  return [...index.entries()]
    .map(([dateKey, dateEntries]) => ({
      dateKey,
      entryCount: dateEntries.length,
      pointTotal: Math.round(
        dateEntries.reduce(
          (total, entry) => total + Number(calculateEntryPoints(entry) ?? 0),
          0,
        ) * 100,
      ) / 100,
    }))
    .sort((first, second) => second.dateKey.localeCompare(first.dateKey));
}

export function getJournalHistoryPage({
  entries = [],
  page = 0,
  pageSize = JOURNAL_HISTORY_PAGE_SIZE,
} = {}) {
  const summaries = buildJournalDateSummaries(entries);
  const safePageSize = Math.max(1, Math.min(31, Number(pageSize) || JOURNAL_HISTORY_PAGE_SIZE));
  const pageCount = Math.max(1, Math.ceil(summaries.length / safePageSize));
  const safePage = Math.min(Math.max(0, Number(page) || 0), pageCount - 1);
  const start = safePage * safePageSize;

  return {
    items: summaries.slice(start, start + safePageSize),
    page: safePage,
    pageCount,
    hasNewer: safePage > 0,
    hasOlder: safePage < pageCount - 1,
    totalRecordedDays: summaries.length,
  };
}
