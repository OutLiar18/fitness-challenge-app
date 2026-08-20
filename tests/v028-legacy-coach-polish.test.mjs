import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (relative) =>
  fs.readFileSync(new URL(`../${relative}`, import.meta.url), "utf8");

const coach = read("src/pages/LegacyCoach.jsx");
const css = read("src/pages/LegacyCoach.css");

test("28D8 uses the shared professional icon language throughout Legacy Coach", () => {
  assert.match(coach, /import ThemeIcon/);
  assert.match(coach, /icon: <ThemeIcon name="coach"/);
  assert.match(coach, /icon: <ThemeIcon name="evidence"/);
  assert.match(coach, /icon: <ThemeIcon name="admin"/);
  assert.match(coach, /icon=\{<ThemeIcon name="coach"/);
  assert.match(coach, /<ThemeIcon name="compass"/);
  assert.match(coach, /<ThemeIcon name="check"/);
  assert.match(coach, /<ThemeIcon name="info"/);
  assert.doesNotMatch(coach, /🧭|🔎|⚙️|✨|✓|🌱/);
});

test("28D8 keeps recommendation counts grammatically correct and evidence explicit", () => {
  assert.match(coach, /pluralize\(report\.recommendations\.length, "suggestion", "suggestions"\)/);
  assert.match(coach, /Recommendations with reasons/);
  assert.match(coach, /Why this was suggested/);
  assert.match(coach, /No hidden judgement/);
});

test("28D8 preserves Legacy Coach as optional factual guidance", () => {
  assert.match(coach, /Legacy Coach is optional/);
  assert.match(coach, /Changing these settings never changes points, goals or league standings/);
  assert.match(coach, /Your judgement remains in charge/);
  assert.match(coach, /does not diagnose health conditions/);
  assert.match(coach, /send data to an external artificial-intelligence service/);
});

test("28D8 preserves URL-backed workspaces and explicit saving states", () => {
  assert.match(coach, /searchParams\.get\("tab"\)/);
  assert.match(coach, /setCoachTab/);
  assert.match(coach, /aria-busy=\{saving \|\| undefined\}/);
  assert.match(coach, /disabled=\{saving\}/);
  assert.match(coach, /No recommendation needs your attention/);
  assert.match(css, /\.coach-hero > span \{/);
  assert.match(css, /\.coach-empty-state > span \{/);
});
