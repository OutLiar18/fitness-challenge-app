import { FRUIT_LIBRARY } from "../constants/libraries/fruitLibrary";

export function getFruit(name) {
  return FRUIT_LIBRARY[name] || null;
}

export function getFruits() {
  return Object.values(FRUIT_LIBRARY);
}

export function getFruitNames() {
  return getFruits()
    .map((fruit) => fruit.name)
    .sort((a, b) => a.localeCompare(b));
}
