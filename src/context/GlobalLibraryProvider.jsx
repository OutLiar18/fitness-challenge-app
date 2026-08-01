import { useEffect, useMemo, useState } from "react";

import {
  findPublishedLibraryItem,
  getPublishedItemsByType,
} from "../services/libraries/globalLibraryModel";
import { subscribeToPublishedLibraryItems } from "../services/libraries/globalLibraryService";
import { GlobalLibraryContext } from "./GlobalLibraryContext";

const INITIAL_STATE = Object.freeze({
  items: [],
  loading: true,
  error: "",
});

export function GlobalLibraryProvider({ children }) {
  const [state, setState] = useState(INITIAL_STATE);

  useEffect(
    () =>
      subscribeToPublishedLibraryItems(
        (items) => {
          setState({ items, loading: false, error: "" });
        },
        (error) => {
          console.error("Published library subscription failed:", error);
          setState({
            items: [],
            loading: false,
            error:
              error?.message ||
              "The shared activity library could not be loaded.",
          });
        },
      ),
    [],
  );

  const value = useMemo(
    () => ({
      ...state,
      exercises: getPublishedItemsByType(state.items, "exercise"),
      cardioActivities: getPublishedItemsByType(state.items, "cardio"),
      skills: getPublishedItemsByType(state.items, "skill"),
      findItem: (itemType, name) =>
        findPublishedLibraryItem(state.items, itemType, name),
    }),
    [state],
  );

  return (
    <GlobalLibraryContext.Provider value={value}>
      {children}
    </GlobalLibraryContext.Provider>
  );
}
