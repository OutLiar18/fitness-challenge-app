export function cleanLibraryText(value = "") {
  return String(value)
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\s+([,.:;!?])/g, "$1");
}

export function normalizeLibraryText(value = "") {
  return cleanLibraryText(value)
    .toLocaleLowerCase()
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function createLibraryItemId(
  itemType,
  primaryText,
) {
  const normalizedType = normalizeLibraryText(itemType)
    .replace(/\s+/g, "-");

  const normalizedText = normalizeLibraryText(primaryText)
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 100);

  if (!normalizedType || !normalizedText) {
    return "";
  }

  return `${normalizedType}_${normalizedText}`;
}