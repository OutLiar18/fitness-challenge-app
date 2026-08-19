import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (relative) =>
  fs.readFileSync(new URL(`../${relative}`, import.meta.url), "utf8");

const pocket = read("src/pages/PocketWeek.jsx");
const css = read("src/pages/PocketWeek.css");

test("28D7 uses the shared professional icon language for Pocket Week chrome", () => {
  assert.match(pocket, /import ThemeIcon/);
  assert.match(pocket, /icon: <ThemeIcon name="add"/);
  assert.match(pocket, /icon: <ThemeIcon name="pocket"/);
  assert.match(pocket, /icon: <ThemeIcon name="info"/);
  assert.match(pocket, /icon=\{<ThemeIcon name="pocket"/);
  assert.match(pocket, /<ThemeIcon name="check"/);
  assert.match(pocket, /<ThemeIcon name="points"/);
  assert.match(pocket, /<ThemeIcon name="progress"/);
  assert.match(pocket, /<ThemeIcon name="evidence"/);
  assert.doesNotMatch(pocket, /🧳|🔎|🔒|🦓|↗|✓/);
});

test("28D7 keeps category identity data-driven instead of duplicating category artwork", () => {
  assert.match(pocket, /category\?\.emoji/);
  assert.match(pocket, /CATEGORY_MAP\.get\(pocket\.category\)/);
  assert.match(pocket, /CATEGORY_MAP\.get\(categoryId\)\?\.name/);
});

test("28D7 removes unrelated Pocket Week clutter without changing its lifecycle mechanics", () => {
  assert.doesNotMatch(pocket, /View Houses/);
  assert.doesNotMatch(pocket, /pocket-easter/);
  assert.doesNotMatch(pocket, /prison zebras/i);
  assert.match(pocket, /storePocketActivity/);
  assert.match(pocket, /redeemPocketActivity/);
  assert.match(pocket, /phase === "pocket"/);
  assert.match(pocket, /phase === "active"/);
  assert.match(pocket, /Stored work earns no points until you activate it/);
});

test("28D7 keeps URL-backed workspace state and strengthens compact responsive presentation", () => {
  assert.match(pocket, /searchParams\.get\("league"\)/);
  assert.match(pocket, /searchParams\.get\("tab"\)/);
  assert.match(pocket, /const defaultTab = canStore \? "store" : "wallet"/);
  assert.match(pocket, /next\.delete\("tab"\)/);
  assert.match(css, /\.pocket-principles article > span \{/);
  assert.match(css, /\.pocket-card__empty \{/);
});
