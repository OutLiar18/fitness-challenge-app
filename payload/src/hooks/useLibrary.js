import { useEffect, useMemo, useState } from "react";

import { subscribeToLibraryItems } from "../services/libraries/libraryService";
import { normalizeLibraryText } from "../utils/libraryTextUtils";

const EMPTY_ITEMS = [];

function getItemPrimaryText(itemType, item) {
  if (itemType === "books") {
    return item.title ?? "";
  }

  return item.name ?? item.title ?? "";
}

function getSearchableText(itemType, item) {
  if (itemType === "books") {
    return [item.title, item.author].filter(Boolean).join(" ");
  }

  return getItemPrimaryText(itemType, item);
}

function createLibraryKey(userId, itemType) {
  if (!userId || !itemType) {
    return "";
  }

  return `${userId}:${itemType}`;
}

export default function useLibrary({ userId, itemType, searchText = "" }) {
  const libraryKey = createLibraryKey(userId, itemType);

  const [libraryState, setLibraryState] = useState({
    key: "",
    items: EMPTY_ITEMS,
    error: "",
  });

  useEffect(() => {
    if (!libraryKey) {
      return undefined;
    }

    return subscribeToLibraryItems(
      userId,
      itemType,
      (libraryItems) => {
        setLibraryState({
          key: libraryKey,
          items: libraryItems,
          error: "",
        });
      },
      (subscriptionError) => {
        console.error("❌ Library subscription error:", subscriptionError);

        setLibraryState({
          key: libraryKey,
          items: EMPTY_ITEMS,
          error:
            subscriptionError instanceof Error
              ? subscriptionError.message
              : "Unable to load your library.",
        });
      },
    );
  }, [userId, itemType, libraryKey]);

  const hasLibrary = Boolean(libraryKey);

  const stateMatchesLibrary = libraryState.key === libraryKey;

  const items =
    hasLibrary && stateMatchesLibrary ? libraryState.items : EMPTY_ITEMS;

  const loading = hasLibrary && !stateMatchesLibrary;

  const error = hasLibrary && stateMatchesLibrary ? libraryState.error : "";

  const matchingItems = useMemo(() => {
    const normalizedSearch = normalizeLibraryText(searchText);

    if (!normalizedSearch) {
      return items.slice(0, 5);
    }

    return items
      .map((item) => {
        const primaryText = getItemPrimaryText(itemType, item);

        const normalizedPrimaryText = normalizeLibraryText(primaryText);

        const normalizedSearchableText = normalizeLibraryText(
          getSearchableText(itemType, item),
        );

        let matchScore = 0;

        if (normalizedPrimaryText === normalizedSearch) {
          matchScore = 100;
        } else if (normalizedPrimaryText.startsWith(normalizedSearch)) {
          matchScore = 80;
        } else if (normalizedPrimaryText.includes(normalizedSearch)) {
          matchScore = 60;
        } else if (normalizedSearchableText.includes(normalizedSearch)) {
          matchScore = 40;
        }

        return {
          item,
          matchScore,
        };
      })
      .filter(({ matchScore }) => matchScore > 0)
      .sort((firstMatch, secondMatch) => {
        if (secondMatch.matchScore !== firstMatch.matchScore) {
          return secondMatch.matchScore - firstMatch.matchScore;
        }

        return (
          Number(secondMatch.item.usageCount ?? 0) -
          Number(firstMatch.item.usageCount ?? 0)
        );
      })
      .slice(0, 5)
      .map(({ item }) => item);
  }, [items, itemType, searchText]);

  return {
    items,
    matchingItems,
    loading,
    error,
  };
}
