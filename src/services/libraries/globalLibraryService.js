import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { db } from "../../firebase";
import {
  normalizePublishedLibraryItem,
  sortPublishedLibraryItems,
} from "./globalLibraryModel";

export function subscribeToPublishedLibraryItems(onUpdate, onError) {
  const publishedQuery = query(
    collection(db, "publishedLibraryItems"),
    where("status", "==", "published"),
  );

  return onSnapshot(
    publishedQuery,
    (snapshot) => {
      onUpdate?.(
        sortPublishedLibraryItems(
          snapshot.docs.map((libraryDocument) =>
            normalizePublishedLibraryItem({
              id: libraryDocument.id,
              ...libraryDocument.data(),
            }),
          ),
        ),
      );
    },
    onError,
  );
}
