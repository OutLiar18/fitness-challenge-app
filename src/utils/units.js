import { CATEGORIES } from "../constants/categories";

export function getUnit(categoryId) {
  const category = CATEGORIES.find(
    (c) => c.id === categoryId
  );

  return category?.unit || "";
}