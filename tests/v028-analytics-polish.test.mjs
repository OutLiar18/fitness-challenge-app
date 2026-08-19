import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (relative) =>
  fs.readFileSync(new URL(`../${relative}`, import.meta.url), "utf8");

const analytics = read("src/pages/Analytics.jsx");
const css = read("src/pages/Analytics.css");

test("28D6 uses the shared professional icon language for Analytics chrome", () => {
  assert.match(analytics, /import ThemeIcon/);
  assert.match(analytics, /icon: <ThemeIcon name="analytics"/);
  assert.match(analytics, /icon: <ThemeIcon name="check"/);
  assert.match(analytics, /icon: <ThemeIcon name="balance"/);
  assert.match(analytics, /icon=\{<ThemeIcon name="analytics"/);
  assert.match(analytics, /INSIGHT_ICON_NAMES/);
  assert.doesNotMatch(analytics, /📈|🗓️|⚖️|🔎|📊|⭐|🏅/);
});

test("28D6 keeps category identity data-driven while ordinary Analytics chrome is icon-system owned", () => {
  assert.match(analytics, /\{category\.emoji\}/);
  assert.match(analytics, /INSIGHT_ICON_NAMES\[insight\.id\]/);
  assert.doesNotMatch(analytics, /\{insight\.icon\}/);
});

test("28D6 does not render an empty weekly chart underneath the no-data recovery state", () => {
  assert.match(analytics, /analytics\.summary\.entries === 0 \? \(/);
  assert.match(analytics, /No activity in this window yet/);
  assert.match(analytics, /\) : \([\s\S]*analytics-week-chart/);
});

test("28D6 keeps Analytics focused while preserving URL and accessible data semantics", () => {
  assert.match(analytics, /title="Analytics"/);
  assert.doesNotMatch(analytics, /Back to progress/);
  assert.match(analytics, /searchParams\.get\("weeks"\)/);
  assert.match(analytics, /searchParams\.get\("tab"\)/);
  assert.match(analytics, /analytics-week-chart"[\s\S]*role="list"/);
  assert.match(analytics, /className="analytics-week"[\s\S]*role="listitem"/);
  assert.match(analytics, /className="analytics-heatmap"[\s\S]*role="list"/);
  assert.match(css, /\.analytics-insight-list > article > span \{/);
});
