import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (relative) =>
  fs.readFileSync(new URL(`../${relative}`, import.meta.url), "utf8");

const progressionCard = read("src/components/dashboard/ProgressionCard.jsx");
const welcomeCss = read("src/components/dashboard/WelcomeCard.css");
const themeIcon = read("src/components/common/ThemeIcon.jsx");
const navigation = read("src/constants/navigation.js");
const shell = read("src/components/layout/AppShell.jsx");
const activity = read("src/pages/ActivityLog.jsx");
const categoryGrid = read("src/components/categories/CategoryGrid.jsx");
const progress = read("src/pages/Progress.jsx");
const seasons = read("src/pages/Seasons.jsx");
const seasonsCss = read("src/pages/Seasons.css");

test("28D3 keeps the Dashboard progression preview focused", () => {
  assert.match(progressionCard, /achievements\.inProgress/);
  assert.match(progressionCard, /achievements\.available/);
  assert.match(progressionCard, /Current streak/);
  assert.match(progressionCard, /Next achievement/);
  assert.match(progressionCard, /Open Progress/);
  assert.doesNotMatch(progressionCard, /Longest streak/);
  assert.doesNotMatch(progressionCard, /Bonus points/);
  assert.doesNotMatch(progressionCard, /Streak shield ready/);
  assert.doesNotMatch(progressionCard, /unlockedCount/);
});

test("28D3 reduces Welcome Card pressure without collapsing useful content too early", () => {
  assert.match(welcomeCss, /28D3 — compact mobile welcome hierarchy/);
  assert.match(welcomeCss, /@media \(max-width: 620px\)[\s\S]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(welcomeCss, /@media \(max-width: 460px\)[\s\S]*grid-template-columns: 1fr/);
});

test("28D3 uses currentColor ThemeIcon symbols for ordinary navigation", () => {
  for (const icon of ["home", "seasons", "houses", "inbox", "analytics", "profile", "more", "signout"]) {
    assert.match(themeIcon, new RegExp(`${icon}:`));
  }
  assert.match(themeIcon, /stroke="currentColor"/);
  assert.match(shell, /import ThemeIcon from "\.\.\/common\/ThemeIcon"/);
  assert.match(shell, /<ThemeIcon name=\{item\.icon\}/);
  assert.match(shell, /<ThemeIcon name="more"/);
  assert.match(shell, /<ThemeIcon name="signout"/);
  assert.match(navigation, /icon: "home"/);
  assert.match(navigation, /icon: "seasons"/);
  assert.doesNotMatch(navigation, /icon: "🏠"|icon: "🛡️"|icon: "🏰"/);
});

test("28D3 simplifies the More menu information architecture", () => {
  assert.match(shell, /Inbox and account/);
  assert.match(shell, />Tools</);
  assert.match(shell, /Reference and support/);
  assert.doesNotMatch(shell, /Tools and reflection/);
  assert.doesNotMatch(shell, /Challenge reference/);
  assert.doesNotMatch(shell, /Support and account/);
});

test("28D3 removes duplicate Log Activity instructional copy", () => {
  assert.doesNotMatch(activity, /Choose a category and record the facts/);
  assert.doesNotMatch(activity, /Review and manage entries by date/);
  assert.match(activity, /description=""/);
  assert.match(categoryGrid, /description && <p>\{description\}<\/p>/);
  assert.match(activity, /Keep the legend real\./);
  assert.match(activity, /Today/);
  assert.match(activity, /Yesterday/);
});

test("28D3 lets the Progress hero own the next-level percentage", () => {
  assert.match(progress, /`\$\{xp\.percentage\}% to next`/);
  assert.doesNotMatch(progress, /<h2 id="experience-title">Level progress<\/h2>[\s\S]{0,100}<strong>\{xp\.percentage\}%<\/strong>/);
  assert.doesNotMatch(progress, /progress-xp-values[\s\S]{0,260}<strong>\{xp\.percentage\}%<\/strong>/);
  assert.match(progress, /xp\.xpIntoLevel/);
  assert.match(progress, /xp\.xpForNextLevel/);
});

test("28D3 makes Seasons read like the competition arena rather than an archive", () => {
  assert.match(seasons, /Enter the season\. Climb the ranks, carry your House/);
  assert.doesNotMatch(seasons, /Register once, compete individually/);
  assert.match(seasons, /Season roster/);
  assert.match(seasons, /league-browser__dates/);
  assert.match(seasons, /league-browser__meta/);
  assert.match(seasons, /league-browser__item--live/);
  assert.doesNotMatch(seasons, /description: "Season dates, rules and lifecycle"/);
  assert.doesNotMatch(seasons, /badge: members\.length/);
  assert.doesNotMatch(seasons, /Deleting draftâ€¦/);
});

test("28D3 gives Seasons role-aware context and hides technical rule IDs from players", () => {
  assert.match(seasons, /summarizeCurrentPowerPlay/);
  assert.match(seasons, /label: "Your House"/);
  assert.match(seasons, /label: "Individual rank"/);
  assert.match(seasons, /label: "Your points"/);
  assert.match(seasons, /label: "Current Power Play"/);
  assert.match(seasons, /metrics=\{summaryMetrics\}/);
  assert.doesNotMatch(seasons, />Season overview</);
  assert.match(seasons, />\s*Open Houses\s*</);
  assert.match(seasons, />\s*Open Pocket\s*</);
  assert.match(seasons, /\{isManager && \([\s\S]*Scoring engine[\s\S]*Rules version/);
  assert.match(seasons, /How this season scores/);
  assert.match(seasonsCss, /grid-template-columns: repeat\(4, minmax\(0, 1fr\)\)/);
  assert.match(seasonsCss, /@media \(max-width: 980px\)[\s\S]*repeat\(2, minmax\(0, 1fr\)\)/);
});
