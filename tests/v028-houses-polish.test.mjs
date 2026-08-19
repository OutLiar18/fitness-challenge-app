import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import {
  HOUSE_ACCENTS,
  HOUSE_EMBLEMS,
  getHouseThemeStyle,
} from "../src/constants/seasons.js";

const read = (relative) =>
  fs.readFileSync(new URL(`../${relative}`, import.meta.url), "utf8");

const houses = read("src/pages/Houses.jsx");
const housesCss = read("src/pages/Houses.css");
const roster = read("src/components/seasons/HouseRosterWorkspace.jsx");
const themeIcon = read("src/components/common/ThemeIcon.jsx");

test("28D4 expands the curated House colour library", () => {
  assert.ok(HOUSE_ACCENTS.length >= 24);
  assert.equal(new Set(HOUSE_ACCENTS.map((item) => item.id)).size, HOUSE_ACCENTS.length);
  assert.equal(new Set(HOUSE_ACCENTS.map((item) => item.value)).size, HOUSE_ACCENTS.length);
  assert.ok(HOUSE_ACCENTS.every((item) => item.secondary));
});

test("28D4 expands the House emblem library without duplicate identifiers", () => {
  assert.ok(HOUSE_EMBLEMS.length >= 56);
  assert.equal(new Set(HOUSE_EMBLEMS.map((item) => item.id)).size, HOUSE_EMBLEMS.length);
  assert.ok(HOUSE_EMBLEMS.every((item) => item.symbol && item.name && item.family));
});

test("28D4 exposes a House-local theme style without changing global theme state", () => {
  const style = getHouseThemeStyle({ accentId: "sapphire" });
  assert.equal(style["--house-accent"], "#2877c8");
  assert.equal(style["--house-secondary"], "#80b9ff");
  assert.equal(Object.keys(style).length, 2);
});

test("28D4 applies the selected House palette only inside the Houses page", () => {
  assert.match(houses, /house-theme-scope--active/);
  assert.match(houses, /style=\{houseThemeStyle\}/);
  assert.match(housesCss, /\.house-theme-scope--active/);
  assert.match(housesCss, /@media \(prefers-color-scheme: dark\)/);
});

test("28D4 keeps House workspace tabs concise and theme-ready", () => {
  assert.match(houses, /icon: <ThemeIcon name="houses" \/>/);
  assert.match(houses, /icon: <ThemeIcon name="roster" \/>/);
  assert.match(houses, /icon: <ThemeIcon name="crown" \/>/);
  assert.doesNotMatch(houses, /description: "House identities and season context"/);
  assert.doesNotMatch(houses, /badge: houses\.length/);
});

test("28D4 prioritises the player's House and strengthens House identity", () => {
  assert.match(houses, /orderedHouses/);
  assert.match(houses, /current=\{currentHouse\?\.id === house\.id\}/);
  assert.match(roster, /Your House/);
  assert.match(houses, /house-identity__meta/);
});

test("28D4 uses deliberate currentColor leadership and House-operation icons", () => {
  for (const name of ["crown", "star", "roster", "swap", "balance", "check"]) {
    assert.match(themeIcon, new RegExp(`${name}:`));
  }
  assert.match(roster, /<ThemeIcon name=\{captain \? "crown" : "star"\}/);
  assert.match(houses, /record\.method === "chaos" \? "power" : "swap"/);
});

test("28D4 removes stale House clutter and records the human historical rule", () => {
  assert.doesNotMatch(houses, /Open Pocket Week/);
  assert.doesNotMatch(houses, /Workingâ€¦/);
  assert.match(houses, /What you earned under a banner stays with that House/);
  assert.match(housesCss, /\.house-identity__meta/);
  assert.match(housesCss, /\.season-houses-page \.workspace-panel/);
});
