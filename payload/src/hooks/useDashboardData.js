import { useEffect, useState } from "react";

import { subscribeToEntries } from "../services/entries";
import { getUserProfile } from "../services/users/userRepository";

const INITIAL_STATE = {
  profile: null,
  entries: [],
  loading: true,
  error: "",
};

export default function useDashboardData(userId) {
  const [state, setState] = useState(INITIAL_STATE);

  useEffect(() => {
    if (!userId) {
      setState(INITIAL_STATE);
      return undefined;
    }

    let active = true;
    setState(INITIAL_STATE);

    getUserProfile(userId)
      .then((profile) => {
        if (active) {
          setState((current) => ({ ...current, profile }));
        }
      })
      .catch((error) => {
        if (active) {
          setState((current) => ({
            ...current,
            error: error.message || "Your profile could not be loaded.",
          }));
        }
      });

    const unsubscribe = subscribeToEntries(
      userId,
      (entries) => {
        if (active) {
          setState((current) => ({
            ...current,
            entries,
            loading: false,
          }));
        }
      },
      (error) => {
        if (active) {
          setState((current) => ({
            ...current,
            loading: false,
            error: error.message || "Your entries could not be loaded.",
          }));
        }
      },
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, [userId]);

  return state;
}
