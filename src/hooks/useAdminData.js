import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { subscribeToAllAnnouncements } from "../services/admin/announcementAdminService";
import { subscribeToAccountDeletionRequests } from "../services/admin/accountRequestService";
import { getAuditEventPage } from "../services/admin/auditService";
import { getErrorReportPage } from "../services/admin/errorReportService";
import {
  subscribeToAllPublishedLibraryItems,
  subscribeToLibraryReleases,
} from "../services/admin/libraryPublishingService";
import {
  subscribeToExerciseSuggestions,
  subscribeToLibrarySuggestions,
} from "../services/admin/moderationService";
import { getUserPage } from "../services/admin/userAdminService";

function createEmptyPage() {
  return {
    items: [],
    cursor: null,
    hasMore: false,
    loading: true,
  };
}

const INITIAL_STATE = {
  announcements: [],
  exerciseSuggestions: [],
  librarySuggestions: [],
  libraryItems: [],
  libraryReleases: [],
  accountDeletionRequests: [],
  usersPage: createEmptyPage(),
  auditPage: createEmptyPage(),
  errorPage: createEmptyPage(),
  errors: [],
};

function mergeUniqueItems(currentItems, nextItems) {
  const itemsById = new Map(
    [...currentItems, ...nextItems].map((item) => [item.id, item]),
  );

  return [...itemsById.values()];
}

function updateErrorList(currentErrors, source, error) {
  return [
    ...currentErrors.filter((item) => item.source !== source),
    {
      source,
      message: error?.message || `${source} data could not be loaded.`,
    },
  ];
}

export default function useAdminData(enabled) {
  const [state, setState] = useState(INITIAL_STATE);

  const reportError = useCallback((source, error) => {
    console.error(error);

    setState((current) => ({
      ...current,
      errors: updateErrorList(current.errors, source, error),
    }));
  }, []);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    let active = true;

    const unsubscribers = [
      subscribeToAllAnnouncements(
        (announcements) => {
          if (!active) {
            return;
          }

          setState((current) => ({ ...current, announcements }));
        },
        (error) => reportError("Announcements", error),
      ),
      subscribeToExerciseSuggestions(
        (exerciseSuggestions) => {
          if (!active) {
            return;
          }

          setState((current) => ({ ...current, exerciseSuggestions }));
        },
        (error) => reportError("Exercise suggestions", error),
      ),
      subscribeToLibrarySuggestions(
        (librarySuggestions) => {
          if (!active) {
            return;
          }

          setState((current) => ({ ...current, librarySuggestions }));
        },
        (error) => reportError("Library suggestions", error),
      ),
      subscribeToAllPublishedLibraryItems(
        (libraryItems) => {
          if (!active) {
            return;
          }

          setState((current) => ({ ...current, libraryItems }));
        },
        (error) => reportError("Published library", error),
      ),
      subscribeToLibraryReleases(
        (libraryReleases) => {
          if (!active) {
            return;
          }

          setState((current) => ({ ...current, libraryReleases }));
        },
        (error) => reportError("Library releases", error),
      ),
      subscribeToAccountDeletionRequests(
        (accountDeletionRequests) => {
          if (!active) {
            return;
          }

          setState((current) => ({ ...current, accountDeletionRequests }));
        },
        (error) => reportError("Account deletion requests", error),
      ),
    ];

    getUserPage()
      .then((page) => {
        if (!active) {
          return;
        }

        setState((current) => ({
          ...current,
          usersPage: { ...page, loading: false },
        }));
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        console.error(error);
        setState((current) => ({
          ...current,
          usersPage: { ...current.usersPage, loading: false },
          errors: updateErrorList(current.errors, "Users", error),
        }));
      });

    getAuditEventPage()
      .then((page) => {
        if (!active) {
          return;
        }

        setState((current) => ({
          ...current,
          auditPage: { ...page, loading: false },
        }));
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        console.error(error);
        setState((current) => ({
          ...current,
          auditPage: { ...current.auditPage, loading: false },
          errors: updateErrorList(current.errors, "Audit history", error),
        }));
      });

    getErrorReportPage()
      .then((page) => {
        if (!active) {
          return;
        }

        setState((current) => ({
          ...current,
          errorPage: { ...page, loading: false },
        }));
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        console.error(error);
        setState((current) => ({
          ...current,
          errorPage: { ...current.errorPage, loading: false },
          errors: updateErrorList(current.errors, "Error reports", error),
        }));
      });

    return () => {
      active = false;
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [enabled, reportError]);

  const loadMorePage = useCallback(
    async (pageKey, loader, source) => {
      const pageState = state[pageKey];

      if (pageState.loading || !pageState.hasMore) {
        return;
      }

      setState((current) => ({
        ...current,
        [pageKey]: { ...current[pageKey], loading: true },
      }));

      try {
        const page = await loader(pageState.cursor);
        setState((current) => ({
          ...current,
          [pageKey]: {
            ...page,
            items: mergeUniqueItems(current[pageKey].items, page.items),
            loading: false,
          },
        }));
      } catch (error) {
        console.error(error);
        setState((current) => ({
          ...current,
          [pageKey]: { ...current[pageKey], loading: false },
          errors: updateErrorList(current.errors, source, error),
        }));
      }
    },
    [state],
  );

  const loadMoreUsers = useCallback(
    () =>
      loadMorePage(
        "usersPage",
        (cursor) => getUserPage({ cursor }),
        "Users",
      ),
    [loadMorePage],
  );

  const loadMoreAuditEvents = useCallback(
    () =>
      loadMorePage(
        "auditPage",
        (cursor) => getAuditEventPage({ cursor }),
        "Audit history",
      ),
    [loadMorePage],
  );

  const loadMoreErrorReports = useCallback(
    () =>
      loadMorePage(
        "errorPage",
        (cursor) => getErrorReportPage({ cursor }),
        "Error reports",
      ),
    [loadMorePage],
  );

  const markUserUpdated = useCallback((userId, updates) => {
    setState((current) => ({
      ...current,
      usersPage: {
        ...current.usersPage,
        items: current.usersPage.items.map((player) =>
          player.id === userId ? { ...player, ...updates } : player,
        ),
      },
    }));
  }, []);

  const markErrorResolved = useCallback((reportId, resolutionNote) => {
    setState((current) => ({
      ...current,
      errorPage: {
        ...current.errorPage,
        items: current.errorPage.items.map((report) =>
          report.id === reportId
            ? { ...report, status: "resolved", resolutionNote }
            : report,
        ),
      },
    }));
  }, []);

  return useMemo(
    () => ({
      ...state,
      users: state.usersPage.items,
      auditEvents: state.auditPage.items,
      errorReports: state.errorPage.items,
      suggestions: [
        ...state.exerciseSuggestions,
        ...state.librarySuggestions,
      ],
      loadMoreUsers,
      loadMoreAuditEvents,
      loadMoreErrorReports,
      markErrorResolved,
      markUserUpdated,
    }),
    [
      loadMoreAuditEvents,
      loadMoreErrorReports,
      loadMoreUsers,
      markErrorResolved,
      markUserUpdated,
      state,
    ],
  );
}
