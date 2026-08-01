import { useEffect, useMemo, useState } from "react";

import { subscribeToAllAnnouncements } from "../services/admin/announcementAdminService";
import { subscribeToAuditEvents } from "../services/admin/auditService";
import {
  subscribeToExerciseSuggestions,
  subscribeToLibrarySuggestions,
} from "../services/admin/moderationService";
import { subscribeToUsers } from "../services/admin/userAdminService";

const INITIAL_STATE = {
  announcements: [],
  exerciseSuggestions: [],
  librarySuggestions: [],
  users: [],
  auditEvents: [],
  errors: [],
};

export default function useAdminData(enabled) {
  const [state, setState] = useState(INITIAL_STATE);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    function reportError(source, error) {
      console.error(error);
      setState((current) => ({
        ...current,
        errors: [
          ...current.errors.filter((item) => item.source !== source),
          {
            source,
            message:
              error?.message || `${source} data could not be loaded.`,
          },
        ],
      }));
    }

    const unsubscribers = [
      subscribeToAllAnnouncements(
        (announcements) =>
          setState((current) => ({ ...current, announcements })),
        (error) => reportError("Announcements", error),
      ),
      subscribeToExerciseSuggestions(
        (exerciseSuggestions) =>
          setState((current) => ({ ...current, exerciseSuggestions })),
        (error) => reportError("Exercise suggestions", error),
      ),
      subscribeToLibrarySuggestions(
        (librarySuggestions) =>
          setState((current) => ({ ...current, librarySuggestions })),
        (error) => reportError("Library suggestions", error),
      ),
      subscribeToUsers(
        (users) => setState((current) => ({ ...current, users })),
        (error) => reportError("Users", error),
      ),
      subscribeToAuditEvents(
        (auditEvents) =>
          setState((current) => ({ ...current, auditEvents })),
        (error) => reportError("Audit history", error),
      ),
    ];

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [enabled]);

  return useMemo(
    () => ({
      ...state,
      suggestions: [
        ...state.exerciseSuggestions,
        ...state.librarySuggestions,
      ],
    }),
    [state],
  );
}
