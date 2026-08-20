import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (relative) =>
  fs.readFileSync(new URL(`../${relative}`, import.meta.url), "utf8");

const admin = read("src/pages/Admin.jsx");
const css = read("src/pages/Admin.css");
const overview = read("src/components/admin/AdminOverview.jsx");
const announcements = read("src/components/admin/AnnouncementManager.jsx");
const library = read("src/components/admin/LibraryPublisher.jsx");
const audit = read("src/components/admin/AuditLog.jsx");
const integrity = read("src/components/admin/EntryIntegrityWorkspace.jsx");
const users = read("src/components/admin/UserManagement.jsx");

const compact = (value) => value.replace(/\s+/g, " ");

test("28D12 uses ThemeIcon for ordinary Administration route chrome", () => {
  assert.match(admin, /import ThemeIcon/);
  assert.match(admin, /icon: <ThemeIcon name="compass"/);
  assert.match(admin, /icon: <ThemeIcon name="inbox"/);
  assert.match(admin, /icon: <ThemeIcon name="command"/);
  assert.match(admin, /icon: <ThemeIcon name="journal"/);
  assert.match(admin, /icon: <ThemeIcon name="roster"/);
  assert.match(admin, /icon: <ThemeIcon name="info"/);
  assert.match(admin, /icon: <ThemeIcon name="profile"/);
  assert.match(admin, /icon: <ThemeIcon name="evidence"/);
  assert.match(admin, /icon: <ThemeIcon name="admin"/);
  assert.match(admin, /icon=\{<ThemeIcon name="admin"/);
  assert.match(admin, /<ThemeIcon name="evidence" size=\{30\}/);
  assert.doesNotMatch(admin, /🧭|📣|🧾|📚|👥|🚨|🧹|🕵️|⚙️|🔐/);
});

test("28D12 focuses asynchronous Administration load errors", () => {
  const source = compact(admin);
  assert.match(source, /const adminErrorRef = useRef\(null\)/);
  assert.match(
    source,
    /if \(adminData\.errors\.length > 0\) adminErrorRef\.current\?\.focus\(\)/,
  );
  assert.match(source, /ref=\{adminErrorRef\} role="alert" tabIndex="-1"/);
  assert.match(css, /\.admin-data-errors:focus/);
  assert.match(css, /outline: 3px solid var\(--primary\)/);
});

test("28D12 makes the overview attention-first and labels paged user counts truthfully", () => {
  const start = overview.indexOf("const metrics = [");
  const end = overview.indexOf("return (", start);
  assert.notEqual(start, -1);
  assert.notEqual(end, -1);
  const metrics = overview.slice(start, end);

  assert.ok(metrics.indexOf("pendingSuggestions") < metrics.indexOf("publishedAnnouncements"));
  assert.ok(metrics.indexOf("openErrors") < metrics.indexOf("publishedAnnouncements"));
  assert.ok(metrics.indexOf("activeDeletionRequests") < metrics.indexOf("publishedAnnouncements"));
  assert.match(metrics, /"loaded player"/);
  assert.match(metrics, /"loaded players"/);
  assert.match(metrics, /"loaded Platform Administrator"/);
  assert.match(overview, /<ThemeIcon name=\{metric\.iconName\}/);
});

test("28D12 standardises supporting admin chrome without replacing content identity", () => {
  assert.match(announcements, /import ThemeIcon/);
  assert.match(announcements, /<ThemeIcon name="inbox" size=\{32\}/);
  assert.match(announcements, /\{announcement\.icon\}/);
  assert.match(announcements, /\{type\.icon\}/);

  assert.match(library, /import ThemeIcon/);
  assert.match(library, /<ThemeIcon name="journal" size=\{32\}/);
  assert.match(library, /<ThemeIcon name="progress" size=\{22\}/);
  assert.match(library, /getSuggestionLibraryType/);

  assert.match(audit, /import ThemeIcon/);
  assert.match(audit, /<ThemeIcon name="admin" size=\{20\}/);

  assert.match(integrity, /import ThemeIcon/);
  assert.match(integrity, /<ThemeIcon name="evidence" size=\{32\}/);
  assert.match(integrity, /\{category\?\.emoji \?\? "🏆"\}/);
});

test("28D12 keeps Administration authority, URL state and confirmation boundaries intact", () => {
  const source = compact(admin);
  assert.match(source, /const isAdmin = isPlatformAdmin/);
  assert.match(source, /searchParams\.get\("tab"\)/);
  assert.match(source, /next\.set\("tab", tabId\)/);
  assert.match(users, /import ConfirmDialog/);
  assert.match(users, /title=\{`Change trusted role for/);
  assert.match(library, /import ConfirmDialog/);
  assert.match(library, /confirmLabel="Archive item"/);
});

test("28D12 keeps dense Administration controls touch-safe and fixes the integrity helper indentation", () => {
  assert.match(css, /\.admin-filter-button,[\s\S]*min-height: 46px/);
  assert.match(css, /\.user-access-row select,[\s\S]*min-height: 46px/);
  assert.match(css, /@media \(max-width: 680px\)/);
  assert.match(integrity, /\n  function requestCorrection\(\) \{/);
  assert.doesNotMatch(integrity, /\n    function requestCorrection\(\) \{/);
});
