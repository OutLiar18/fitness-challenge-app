import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import {
  HOUSE_EMBLEMS,
} from "../src/constants/seasons.js";

const read = (relative) =>
  fs.readFileSync(new URL(`../${relative}`, import.meta.url), "utf8");

const houses = read("src/pages/Houses.jsx");
const roster = read("src/components/seasons/HouseRosterWorkspace.jsx");
const emblem = read("src/components/seasons/HouseEmblem.jsx");

test("28D4A gives every House emblem an app-owned renderer", () => {
  const configured = HOUSE_EMBLEMS.map((item) => item.id).sort();

  for (const id of configured) {
    assert.ok(
      emblem.includes(`  ${id}: `),
      `missing emblem renderer for ${id}`,
    );
  }

  assert.equal(configured.length, 56);
  assert.equal(new Set(configured).size, 56);
});

test("House identity no longer depends on operating-system emoji or inline SVG artwork", () => {
  assert.match(houses, /<HouseEmblem id=\{item\.id\}/);
  assert.match(houses, /<HouseEmblem id=\{form\.emblemId\}/);
  assert.match(roster, /<HouseEmblem id=\{house\.emblemId\}/);
  assert.doesNotMatch(houses, /\{item\.symbol\}/);
  assert.doesNotMatch(roster, /\{emblem\.symbol\}/);
  assert.match(emblem, /<img/);
  assert.match(emblem, /assets\/house-emblems/);
  assert.doesNotMatch(emblem, /<svg|<path|@phosphor-icons\/react/);
});
