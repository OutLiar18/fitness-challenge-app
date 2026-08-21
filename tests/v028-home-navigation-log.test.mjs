import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (relative) =>
  fs.readFileSync(new URL(`../${relative}`, import.meta.url), "utf8");

const welcome = read("src/components/dashboard/WelcomeCard.jsx");
const quickActions = read("src/components/dashboard/QuickActions.jsx");
const dailyGoalsCss = read("src/components/dashboard/DailyGoals.css");
const progression = read("src/components/dashboard/ProgressionCard.jsx");
const shell = read("src/components/layout/AppShell.jsx");
const shellCss = read("src/components/layout/AppShell.css");
const navigation = read("src/constants/navigation.js");
const activity = read("src/pages/ActivityLog.jsx");
const activityCss = read("src/pages/ActivityLog.css");
const categoryGrid = read("src/components/categories/CategoryGrid.jsx");
const categoryGridCss = read("src/components/categories/CategoryGrid.css");
const motivation = read("src/constants/motivation.js");
const themeIcon = read("src/components/common/ThemeIcon.jsx");
const indexCss = read("src/index.css");
const packageJson = JSON.parse(read("package.json"));

test("application package identifies the current v0.29 development line", () => {
  assert.equal(packageJson.version, "0.29.0");
});

test("Dashboard Champion Transmission is the sole hero motivation and uses the MBTI-aware avatar", () => {
  assert.doesNotMatch(welcome, /Record the work, learn from the day/);
  assert.doesNotMatch(welcome, /Another transmission/);
  assert.match(welcome, /aria-label="Show another Champion transmission"/);
  assert.match(welcome, /<PlayerAvatar profile=\{profile\}/);
  assert.match(welcome, /profile\?\.mbtiType/);
});

test("Champion Transmission uses MBTI as a preference cue without requiring it", () => {
  assert.match(motivation, /getMbtiProfileByType/);
  assert.match(motivation, /profile\?\.thrive/);
  assert.match(motivation, /mbtiType = ""/);
  assert.match(motivation, /profile\?\.type \?\? "general"/);
});

test("Quick Actions use reusable currentColor SVG symbols instead of arrow affordances", () => {
  assert.match(quickActions, /<ThemeIcon name=\{action\.icon\}/);
  assert.doesNotMatch(quickActions, /quick-action__arrow/);
  assert.match(themeIcon, /color="currentColor"/);
  assert.match(themeIcon, /name/);
});

test("Dashboard goal period controls and XP progression have explicit visual affordances", () => {
  assert.match(dailyGoalsCss, /\.goal-period-tab \{[\s\S]*border: 1px solid/);
  assert.match(dailyGoalsCss, /\.goal-period-tab:hover/);
  assert.match(dailyGoalsCss, /var\(--interactive-glow\)/);
  assert.match(progression, /\{xp\.percentage\}%/);
  assert.match(progression, /xp\.xpIntoLevel/);
  assert.match(progression, /xp\.xpForNextLevel/);
});

test("desktop shell labels are concise and brand copy is all-caps with theme accents", () => {
  assert.match(shell, /label: "streak"/);
  assert.match(shell, /label: "points"/);
  assert.doesNotMatch(shell, /label: "day streak"/);
  assert.doesNotMatch(shell, /label: "total points"/);
  assert.match(shell, /CHAMPIONS/);
  assert.match(shell, /LEGACY/);
  assert.match(shell, /CHALLENGE/);
  assert.match(shellCss, /\.app-brand__accent/);
});

test("mobile navigation exposes Seasons and Houses directly while Inbox remains reachable through More", () => {
  assert.match(navigation, /COMPETITION_NAV_ITEMS\[0\]/);
  assert.match(navigation, /COMPETITION_NAV_ITEMS\[1\]/);
  assert.match(shell, /item=\{INBOX_NAV_ITEM\}/);
  assert.match(shell, /Inbox and account/);
  assert.match(shellCss, /grid-template-columns: repeat\(6, minmax\(0, 1fr\)\)/);
});

test("Log Activity lets players choose Today or Yesterday without visiting Journal", () => {
  assert.match(activity, />\s*Today\s*</);
  assert.match(activity, />\s*Yesterday\s*</);
  assert.match(activity, /isToday\(selectedDate\)/);
  assert.match(activity, /isYesterday\(selectedDate\)/);
  assert.match(activity, /addDays\(today, -1\)/);
  assert.match(activity, /selectedDate=\{selectedDate\}/);
  assert.match(activity, /setSelectedDate=\{setSelectedDate\}/);
});

test("Log Activity keeps honesty copy in the header and date controls inside the category picker", () => {
  assert.match(activity, /actions=\{\s*<ol className="activity-page__guide"/);
  assert.match(activity, /description=\{\s*<>[\s\S]*Keep the legend real\./);
  assert.doesNotMatch(
    activity,
    /You do the work\. Log it accurately\. Champions Legacy handles the maths\./,
  );
  assert.match(activity, /check with an administrator/i);
  assert.match(activity, /headerActions=\{/);
  assert.doesNotMatch(activity, /activity-log-toolbar card/);
  assert.match(categoryGrid, /headerActions = null/);
  assert.match(categoryGrid, /category-picker__actions/);
  assert.match(categoryGridCss, /\.category-picker__topline/);
  assert.match(activityCss, /\.activity-log-date-tab/);
  assert.match(indexCss, /--interactive-glow/);
});
