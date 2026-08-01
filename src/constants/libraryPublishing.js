export const GLOBAL_LIBRARY_ITEM_TYPES = Object.freeze([
  "exercise",
  "cardio",
  "skill",
]);


export const DEFAULT_LIBRARY_RELEASE_VERSION = "0.11.0";
export const MAX_LIBRARY_ITEMS_PER_RELEASE = 8;

export function isGlobalLibraryItemType(value) {
  return GLOBAL_LIBRARY_ITEM_TYPES.includes(value);
}
