import { useEffect, useState } from "react";

import { subscribeToEntries } from "../services/entries";
import {
  subscribeToEntryCorrectionHeads,
  subscribeToEntryCorrections,
} from "../services/entries/entryCorrectionService";
import { subscribeToUserEvidenceClaims } from "../services/evidence/evidenceService";
import { subscribeToUserProfile } from "../services/users/userRepository";

const EMPTY_STATE = Object.freeze({
  profile: null,
  entries: [],
  evidenceClaims: [],
  correctionHeads: [],
  entryCorrections: [],
  loading: true,
  error: "",
});

const INITIAL_STATE = {
  ...EMPTY_STATE,
  ownerId: "",
  profileLoaded: false,
  entriesLoaded: false,
  evidenceLoaded: false,
  correctionHeadsLoaded: false,
  correctionsLoaded: false,
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
          loading: !(
            next.profileLoaded &&
            next.entriesLoaded &&
            next.evidenceLoaded &&
            next.correctionHeadsLoaded &&
            next.correctionsLoaded
          ),
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

    const unsubscribeCorrectionHeads = subscribeToEntryCorrectionHeads(
      userId,
      (correctionHeads) => {
        if (active) {
          updateForCurrentUser((current) => ({
            ...current,
            correctionHeads,
            correctionHeadsLoaded: true,
          }));
        }
      },
      (error) => {
        if (active) {
          updateForCurrentUser((current) => ({
            ...current,
            correctionHeadsLoaded: true,
            error: error.message || "Your correction history could not be loaded.",
          }));
        }
      },
    );

    const unsubscribeCorrections = subscribeToEntryCorrections(
      userId,
      (entryCorrections) => {
        if (active) {
          updateForCurrentUser((current) => ({
            ...current,
            entryCorrections,
            correctionsLoaded: true,
          }));
        }
      },
      (error) => {
        if (active) {
          updateForCurrentUser((current) => ({
            ...current,
            correctionsLoaded: true,
            error: error.message || "Your correction records could not be loaded.",
          }));
        }
      },
    );

    return () => {
      active = false;
      unsubscribeProfile();
      unsubscribeEntries();
      unsubscribeEvidence();
      unsubscribeCorrectionHeads();
      unsubscribeCorrections();
    };
  }, [userId]);

  if (!userId || state.ownerId !== userId) {
    return EMPTY_STATE;
  }

  return {
    profile: state.profile,
    entries: state.entries,
    evidenceClaims: state.evidenceClaims,
    correctionHeads: state.correctionHeads,
    entryCorrections: state.entryCorrections,
    loading: state.loading,
    error: state.error,
  };
}
