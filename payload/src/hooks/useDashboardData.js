import { useEffect, useState } from "react";

import { subscribeToEntries } from "../services/entries";
import { subscribeToUserProfile } from "../services/users/userRepository";

const EMPTY_STATE = Object.freeze({
  profile: null,
  entries: [],
  loading: true,
  error: "",
});

const INITIAL_STATE = {
  ...EMPTY_STATE,
  ownerId: "",
  profileLoaded: false,
  entriesLoaded: false,
};

export default function useDashboardData(userId) {
  const [state, setState] = useState(INITIAL_STATE);

  useEffect(() => {
    if (!userId) {
      return undefined;
    }

    let active = true;

    function updateForCurrentUser(updater) {
      setState((current) => {
        const currentUserState =
          current.ownerId === userId
            ? current
            : {
                ...INITIAL_STATE,
                ownerId: userId,
              };

        const next = updater(currentUserState);

        return {
          ...next,
          loading: !(next.profileLoaded && next.entriesLoaded),
        };
      });
    }

    const unsubscribeProfile = subscribeToUserProfile(
      userId,
      (profile) => {
        if (active) {
          updateForCurrentUser((current) => ({
            ...current,
            profile,
            profileLoaded: true,
          }));
        }
      },
      (error) => {
        if (active) {
          updateForCurrentUser((current) => ({
            ...current,
            profileLoaded: true,
            error:
              error.message ||
              "Your profile could not be loaded.",
          }));
        }
      },
    );

    const unsubscribeEntries = subscribeToEntries(
      userId,
      (entries) => {
        if (active) {
          updateForCurrentUser((current) => ({
            ...current,
            entries,
            entriesLoaded: true,
          }));
        }
      },
      (error) => {
        if (active) {
          updateForCurrentUser((current) => ({
            ...current,
            entriesLoaded: true,
            error:
              error.message ||
              "Your entries could not be loaded.",
          }));
        }
      },
    );

    return () => {
      active = false;
      unsubscribeProfile();
      unsubscribeEntries();
    };
  }, [userId]);

  if (!userId || state.ownerId !== userId) {
    return EMPTY_STATE;
  }

  return {
    profile: state.profile,
    entries: state.entries,
    loading: state.loading,
    error: state.error,
  };
}
