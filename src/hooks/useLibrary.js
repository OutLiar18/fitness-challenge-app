import { useEffect, useMemo, useState } from "react";

import { subscribeToLibraryItems } from "../services/libraryService";
import { normalizeLibraryText } from "../utils/libraryTextUtils";

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

export default function useLibrary({ userId, itemType, searchText = "" }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(Boolean(userId && itemType));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId || !itemType) {

      setItems([]);
      setLoading(false);
      setError("");

      return undefined;
    }

    setLoading(true);
    setError("");

    const unsubscribe = subscribeToLibraryItems(
      userId,
      itemType,
      (libraryItems) => {

        setItems(libraryItems);
        setLoading(false);
        setError("");
      },
      (subscriptionError) => {
        console.error("❌ Library subscription error:", subscriptionError);

        setItems([]);
        setLoading(false);

        setError(
          subscriptionError instanceof Error
            ? subscriptionError.message
            : "Unable to load your library.",
        );
      },
    );

    return unsubscribe;
  }, [userId, itemType]);

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
