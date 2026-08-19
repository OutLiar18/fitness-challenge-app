import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { HOUSE_EMBLEMS } from "../src/constants/seasons.js";

const read = (relative) =>
  fs.readFileSync(new URL(`../${relative}`, import.meta.url), "utf8");

const packageJson = JSON.parse(read("package.json"));
const themeIcon = read("src/components/common/ThemeIcon.jsx");
const houseEmblem = read("src/components/seasons/HouseEmblem.jsx");

test("28D4B keeps Phosphor pinned for ordinary application UI icons", () => {
  assert.equal(packageJson.dependencies["@phosphor-icons/react"], "2.1.10");
});

test("28D4B routes the shared UI icon wrapper through Phosphor", () => {
  assert.match(themeIcon, /@phosphor-icons\/react\/dist\/csr\/HouseSimple/);
  assert.match(themeIcon, /@phosphor-icons\/react\/dist\/csr\/ShieldCheckered/);
  assert.match(themeIcon, /@phosphor-icons\/react\/dist\/csr\/UsersThree/);
  assert.match(themeIcon, /color="currentColor"/);
  assert.doesNotMatch(themeIcon, /<path d=/);
});

test("28D4C separates House identity artwork from the monochrome UI icon system", () => {
  const ids = HOUSE_EMBLEMS.map((item) => item.id);

  for (const id of ids) {
    assert.ok(
      houseEmblem.includes(`  ${id}: `),
      `missing full-colour House emblem mapping for ${id}`,
    );
    assert.ok(
      houseEmblem.includes(`house-emblems/${id}.png`),
      `missing local PNG import for ${id}`,
    );
  }

  assert.equal(ids.length, 56);
  assert.doesNotMatch(houseEmblem, /@phosphor-icons\/react/);
  assert.doesNotMatch(houseEmblem, /currentColor/);
  assert.match(houseEmblem, /<img/);
});

test("28D4C keeps House artwork accessible and loading-friendly", () => {
  assert.match(houseEmblem, /alt=\{decorative \? "" : accessibleLabel\}/);
  assert.match(houseEmblem, /decoding="async"/);
  assert.match(houseEmblem, /loading="lazy"/);
});
