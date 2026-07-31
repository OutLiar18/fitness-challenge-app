import { CATEGORY_MAP } from "../constants/categories";

export function getCategory(categoryId) {
  return CATEGORY_MAP.get(categoryId) ?? null;
}
