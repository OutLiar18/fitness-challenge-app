import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (relative) =>
  fs.readFileSync(new URL(`../${relative}`, import.meta.url), "utf8");

const dashboard = read("src/pages/Dashboard.jsx");
const quickActions = read("src/components/dashboard/QuickActions.jsx");
const activity = read("src/pages/ActivityLog.jsx");
const entryForm = read("src/components/entries/EntryForm.jsx");
const journal = read("src/components/journal/Journal.jsx");
const confirmDialog = read("src/components/common/ConfirmDialog.jsx");
const confirmCss = read("src/components/common/ConfirmDialog.css");

test("Dashboard prioritises goals and exposes a direct Journal action", () => {
  assert.ok(dashboard.indexOf("<DailyGoals") < dashboard.indexOf("<ProgressionCard"));
  assert.match(quickActions, /title: "Open journal"/);
  assert.match(quickActions, /to: "\/log\?tab=journal"/);
});

test("Activity Log stores its workspace tab in the URL", () => {
  assert.match(activity, /searchParams\.get\("tab"\) === "journal"/);
  assert.match(activity, /nextSearchParams\.set\("tab", "journal"\)/);
  assert.match(activity, /nextSearchParams\.delete\("tab"\)/);
  assert.match(activity, /onChange=\{onTabChange\}/);
});

test("editable entry deletion uses an accessible app confirmation instead of window.confirm", () => {
  assert.doesNotMatch(activity, /window\.confirm/);
  assert.match(activity, /<ConfirmDialog/);
  assert.match(activity, /pendingDeleteId/);
  assert.match(confirmDialog, /role="alertdialog"/);
  assert.match(confirmDialog, /aria-modal="true"/);
  assert.match(confirmDialog, /event\.key === "Escape"/);
  assert.match(confirmDialog, /previousFocus\?\.isConnected/);
  assert.match(confirmCss, /min\(100%, 470px\)/);
});

test("entry validation and Journal empty state guide the player to recovery", () => {
  assert.match(entryForm, /errorSummaryRef\.current\?\.focus\(\)/);
  assert.match(entryForm, /tabIndex="-1"/);
  assert.match(entryForm, /aria-busy=\{saving \|\| undefined\}/);
  assert.match(journal, /Nothing has been recorded today yet\./);
  assert.match(journal, />\s*Log activity\s*</);
  assert.doesNotMatch(journal, /Only \{JOURNAL_HISTORY_PAGE_SIZE\} recorded days are rendered/);
});
