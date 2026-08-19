import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (relative) =>
  fs.readFileSync(new URL(`../${relative}`, import.meta.url), "utf8");

const inbox = read("src/pages/Inbox.jsx");
const css = read("src/pages/Inbox.css");

test("28D5 uses the shared professional icon language throughout Inbox", () => {
  assert.match(inbox, /import ThemeIcon/);
  assert.match(inbox, /icon=\{<ThemeIcon name="inbox"/);
  assert.match(inbox, /ANNOUNCEMENT_ICON_NAMES/);
  assert.match(inbox, /<ThemeIcon[\s\S]*ANNOUNCEMENT_ICON_NAMES\[type\.id\]/);
  assert.match(inbox, /icon: <ThemeIcon name="inbox"/);
  assert.match(inbox, /icon: <ThemeIcon name="evidence"/);
  assert.doesNotMatch(inbox, /📣|🔒|🔔|📬|📭|✦|●|○/);
});

test("28D5 removes duplicate Inbox summary chrome and keeps the two workspaces focused", () => {
  assert.doesNotMatch(inbox, /inbox-overview/);
  assert.doesNotMatch(inbox, /inbox-private-summary/);
  assert.doesNotMatch(inbox, /totalAttention/);
  assert.match(inbox, /description: "Public announcements"/);
  assert.match(inbox, /description: "Private season notices"/);
});

test("28D5 keeps read controls explicit while preserving URL-backed workspace state", () => {
  assert.match(inbox, /Mark all read/);
  assert.match(inbox, /Mark as unread/);
  assert.match(inbox, /Mark as read/);
  assert.match(inbox, /aria-pressed=\{typeFilter === typeId\}/);
  assert.match(inbox, /searchParams\.get\("tab"\)/);
  assert.match(inbox, /setSearchParams/);
});

test("28D5 makes private attention and related actions easier to scan", () => {
  assert.match(inbox, /Review in Seasons/);
  assert.match(inbox, /View details/);
  assert.match(inbox, /No private season notifications yet/);
  assert.match(css, /\.inbox-private-item__mark\s*\{[\s\S]*border-radius: 50%/);
  assert.match(css, /\.inbox-private-item--unread \.inbox-private-item__mark/);
});
