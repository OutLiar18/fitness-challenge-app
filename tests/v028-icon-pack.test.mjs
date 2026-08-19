import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { HOUSE_EMBLEMS } from "../src/constants/seasons.js";

const read = (relative) =>
  fs.readFileSync(new URL(`../${relative}`, import.meta.url), "utf8");

const packageJson = JSON.parse(read("package.json"));
const themeIcon = read("src/components/common/ThemeIcon.jsx");
const houseEmblem = read("src/components/seasons/HouseEmblem.jsx");

test("28D4B pins the professional Phosphor React icon pack", () => {
  assert.equal(packageJson.dependencies["@phosphor-icons/react"], "2.1.10");
});

test("28D4B routes the shared UI icon wrapper through Phosphor", () => {
  assert.match(themeIcon, /@phosphor-icons\/react\/dist\/csr\/HouseSimple/);
  assert.match(themeIcon, /@phosphor-icons\/react\/dist\/csr\/ShieldCheckered/);
  assert.match(themeIcon, /@phosphor-icons\/react\/dist\/csr\/UsersThree/);
  assert.match(themeIcon, /color="currentColor"/);
  assert.doesNotMatch(themeIcon, /<path d=/);
});

test("28D4B maps every configured House identity to a Phosphor emblem", () => {
  const ids = HOUSE_EMBLEMS.map((item) => item.id);

  for (const id of ids) {
    assert.ok(
      houseEmblem.includes(`  ${id}: `),
      `missing professional emblem mapping for ${id}`,
    );
  }

  assert.equal(ids.length, 56);
  assert.equal(new Set(ids).size, 56);
});

test("28D4B keeps House emblems theme-reactive and visually richer", () => {
  assert.match(houseEmblem, /weight=\{weight\}/);
  assert.match(houseEmblem, /"duotone"/);
  assert.match(houseEmblem, /color="currentColor"/);
  assert.doesNotMatch(houseEmblem, /<path d=/);
});
