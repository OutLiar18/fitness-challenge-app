import { useEffect, useState } from "react";

import { subscribeToEntries } from "../services/entries";
import { subscribeToUserEvidenceClaims } from "../services/evidence/evidenceService";
import { subscribeToUserProfile } from "../services/users/userRepository";

const EMPTY_STATE = Object.freeze({
  profile: null,
  entries: [],
  evidenceClaims: [],
  loading: true,
  error: "",
});

const INITIAL_STATE = {
  ...EMPTY_STATE,
  ownerId: "",
  profileLoaded: false,
  entriesLoaded: false,
  evidenceLoaded: false,
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
          loading: !(next.profileLoaded && next.entriesLoaded && next.evidenceLoaded),
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

    const unsubscribeEvidence = subscribeToUserEvidenceClaims(
      userId,
      (evidenceClaims) => {
        if (active) {
          updateForCurrentUser((current) => ({
            ...current,
            evidenceClaims,
            evidenceLoaded: true,
          }));
        }
      },
      (error) => {
        if (active) {
          updateForCurrentUser((current) => ({
            ...current,
            evidenceLoaded: true,
            error:
              error.message ||
              "Your proof statuses could not be loaded.",
          }));
        }
      },
    );

    return () => {
      active = false;
      unsubscribeProfile();
      unsubscribeEntries();
      unsubscribeEvidence();
    };
  }, [userId]);

  if (!userId || state.ownerId !== userId) {
    return EMPTY_STATE;
  }

  return {
    profile: state.profile,
    entries: state.entries,
    evidenceClaims: state.evidenceClaims,
    loading: state.loading,
    error: state.error,
  };
}
