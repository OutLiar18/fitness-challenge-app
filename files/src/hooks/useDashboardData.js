import { useEffect, useState } from "react";

import { subscribeToEntries } from "../services/entries";
import { getUserProfile } from "../services/users/userRepository";

const EMPTY_STATE = Object.freeze({
  profile: null,
  entries: [],
  loading: true,
  error: "",
});

const INITIAL_STATE = {
  ...EMPTY_STATE,
  ownerId: "",
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

        return updater(currentUserState);
      });
    }

    getUserProfile(userId)
      .then((profile) => {
        if (active) {
          updateForCurrentUser((current) => ({
            ...current,
            profile,
          }));
        }
      })
      .catch((error) => {
        if (active) {
          updateForCurrentUser((current) => ({
            ...current,
            error:
              error.message ||
              "Your profile could not be loaded.",
          }));
        }
      });

    const unsubscribe = subscribeToEntries(
      userId,
      (entries) => {
        if (active) {
          updateForCurrentUser((current) => ({
            ...current,
            entries,
            loading: false,
          }));
        }
      },
      (error) => {
        if (active) {
          updateForCurrentUser((current) => ({
            ...current,
            loading: false,
            error:
              error.message ||
              "Your entries could not be loaded.",
          }));
        }
      },
    );

    return () => {
      active = false;
      unsubscribe();
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
