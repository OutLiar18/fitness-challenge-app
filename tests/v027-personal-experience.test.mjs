import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (relative) =>
  fs.readFileSync(new URL(`../${relative}`, import.meta.url), "utf8");

const progress = read("src/pages/Progress.jsx");
const analytics = read("src/pages/Analytics.jsx");
const profile = read("src/pages/Profile.jsx");
const inbox = read("src/pages/Inbox.jsx");
const coach = read("src/pages/LegacyCoach.jsx");

test("Progress, Profile and Legacy Coach keep workspace state in the URL", () => {
  assert.match(progress, /useSearchParams/);
  assert.match(progress, /next\.set\("tab", tabId\)/);
  assert.match(profile, /useSearchParams/);
  assert.match(profile, /setProfileTab\("personalise"\)/);
  assert.match(coach, /useSearchParams/);
  assert.match(coach, /setCoachTab/);
});

test("Analytics keeps both range and section state in the URL and exposes a real loading state", () => {
  assert.match(analytics, /searchParams\.get\("weeks"\)/);
  assert.match(analytics, /searchParams\.get\("tab"\)/);
  assert.match(analytics, /setAnalyticsRange/);
  assert.match(analytics, /Reading your activity patterns/);
});

test("Analytics data visuals keep readable child data in the accessibility tree", () => {
  assert.doesNotMatch(analytics, /analytics-week-chart" role="img"/);
  assert.match(analytics, /analytics-week-chart"[\s\S]*role="list"/);
  assert.match(analytics, /className="analytics-week"[\s\S]*role="listitem"/);
  assert.match(analytics, /className="analytics-heatmap"[\s\S]*role="list"/);
  assert.match(analytics, /key=\{day\.dateKey\}[\s\S]*role="listitem"/);
});

test("Profile errors are focusable and forms expose busy state", () => {
  assert.match(profile, /statusRef\.current\?\.focus\(\)/);
  assert.match(profile, /tabIndex=\{status\.type === "error" \? -1 : undefined\}/);
  assert.match(profile, /aria-busy=\{saving \|\| undefined\}/);
  assert.match(profile, /Loading your player profile/);
});

test("Inbox reuses shared keyboard-accessible workspace tabs", () => {
  assert.match(inbox, /import WorkspaceTabs/);
  assert.match(inbox, /<WorkspaceTabs[\s\S]*idPrefix="inbox"/);
  assert.match(inbox, /<WorkspacePanel id=\{ANNOUNCEMENT_TAB\}/);
  assert.match(inbox, /<WorkspacePanel id=\{PRIVATE_TAB\}/);
  assert.doesNotMatch(inbox, /className="inbox-tabs" role="tablist"/);
});

test("Legacy Coach has explicit saving and zero-recommendation states", () => {
  assert.match(coach, /aria-busy=\{saving \|\| undefined\}/);
  assert.match(coach, /disabled=\{saving\}/);
  assert.match(coach, /No recommendation needs your attention/);
});
