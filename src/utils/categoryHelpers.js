import { CATEGORIES } from "../constants/categories";

export function getCategory(categoryId) {
  return (
    CATEGORIES.find(
      (c) => c.id === categoryId
    ) || null
  );
}