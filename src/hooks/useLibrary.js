import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getLibraryItems } from "../services/libraryService";
import { normalizeLibraryText } from "../utils/libraryTextUtils";

function getItemPrimaryText(itemType, item) {
  if (itemType === "books") {
    return item.title ?? "";
  }

  return item.name ?? item.title ?? "";
}

function getSearchableText(itemType, item) {
  if (itemType === "books") {
    return [
      item.title,
      item.author,
    ]
      .filter(Boolean)
      .join(" ");
  }

  return getItemPrimaryText(itemType, item);
}

export default function useLibrary({
  userId,
  itemType,
  searchText = "",
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadItems = useCallback(async () => {
    if (!userId || !itemType) {
      setItems([]);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const libraryItems = await getLibraryItems(
        userId,
        itemType,
      );

      setItems(libraryItems);
    } catch (loadError) {
      console.error(
        "Failed to load library items:",
        loadError,
      );

      setItems([]);

      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load your library.",
      );
    } finally {
      setLoading(false);
    }
  }, [userId, itemType]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const matchingItems = useMemo(() => {
    const normalizedSearch =
      normalizeLibraryText(searchText);

    if (!normalizedSearch) {
      return items.slice(0, 5);
    }

    return items
      .map((item) => {
        const primaryText = getItemPrimaryText(
          itemType,
          item,
        );

        const normalizedPrimaryText =
          normalizeLibraryText(primaryText);

        const normalizedSearchableText =
          normalizeLibraryText(
            getSearchableText(itemType, item),
          );

        let matchScore = 0;

        if (
          normalizedPrimaryText === normalizedSearch
        ) {
          matchScore = 100;
        } else if (
          normalizedPrimaryText.startsWith(
            normalizedSearch,
          )
        ) {
          matchScore = 80;
        } else if (
          normalizedPrimaryText.includes(
            normalizedSearch,
          )
        ) {
          matchScore = 60;
        } else if (
          normalizedSearchableText.includes(
            normalizedSearch,
          )
        ) {
          matchScore = 40;
        }

        return {
          item,
          matchScore,
        };
      })
      .filter(({ matchScore }) => matchScore > 0)
      .sort((firstMatch, secondMatch) => {
        if (
          secondMatch.matchScore !==
          firstMatch.matchScore
        ) {
          return (
            secondMatch.matchScore -
            firstMatch.matchScore
          );
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
    refreshLibrary: loadItems,
  };
}