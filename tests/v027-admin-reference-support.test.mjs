import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (relative) =>
  fs.readFileSync(new URL(`../${relative}`, import.meta.url), "utf8");

const admin = read("src/pages/Admin.jsx");
const userManagement = read("src/components/admin/UserManagement.jsx");
const rulebook = read("src/pages/Rulebook.jsx");
const pointsGuide = read("src/pages/PointsGuide.jsx");
const help = read("src/pages/Help.jsx");
const pocket = read("src/pages/PocketWeek.jsx");
const future = read("src/pages/FutureFeature.jsx");

test("Admin workspace is URL-backed and trusted-role changes use ConfirmDialog", () => {
  assert.match(admin, /useSearchParams/);
  assert.match(admin, /searchParams\.get\("tab"\)/);
  assert.match(admin, /next\.set\("tab", tabId\)/);
  assert.match(userManagement, /import ConfirmDialog/);
  assert.match(userManagement, /title=\{`Change trusted role for/);
  assert.match(userManagement, /description=\{`This changes audited platform access/);
});

test("Rulebook search and status filters are URL-backed and recoverable", () => {
  assert.match(rulebook, /searchParams\.get\("q"\)/);
  assert.match(rulebook, /searchParams\.get\("status"\)/);
  assert.match(rulebook, /function clearRuleFilters/);
  assert.match(rulebook, /Clear search and filters/);
  assert.doesNotMatch(rulebook, /“team”/);
});

test("Points Guide preserves section and category in the URL without changing guide models", () => {
  assert.match(pointsGuide, /searchParams\.get\("category"\)/);
  assert.match(pointsGuide, /searchParams\.get\("tab"\)/);
  assert.match(pointsGuide, /function setSelectedGuideId/);
  assert.match(pointsGuide, /getActivityPointGuide\(requestedGuideId\)/);
});

test("Help preserves its section in the URL and focuses account/restart errors", () => {
  assert.match(help, /searchParams\.get\("tab"\)/);
  assert.match(help, /function setActiveTab/);
  assert.match(help, /statusRef\.current\?\.focus\(\)/);
  assert.match(help, /restartErrorRef\.current\?\.focus\(\)/);
  assert.match(help, /aria-busy=\{exporting \|\| requestBusy \|\| undefined\}/);
});

test("Pocket Week uses URL presentation state instead of league-scoped local tab state", () => {
  assert.match(pocket, /searchParams\.get\("tab"\)/);
  assert.match(pocket, /const defaultTab = canStore \? "store" : "wallet"/);
  assert.match(pocket, /next\.delete\("tab"\)/);
  assert.doesNotMatch(pocket, /setTabState/);
});

test("Future feature pages clearly remain previews with a return path", () => {
  assert.match(future, /Preview only/);
  assert.match(future, /Return to dashboard/);
  assert.match(future, /Keep building today/);
});
