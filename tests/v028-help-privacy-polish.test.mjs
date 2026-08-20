import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (relative) =>
  fs.readFileSync(new URL(`../${relative}`, import.meta.url), "utf8");

const help = read("src/pages/Help.jsx");
const css = read("src/pages/Help.css");
const compactHelp = help.replace(/\s+/g, " ");

test("28D11 uses the shared professional icon language across Help and Privacy", () => {
  assert.match(compactHelp, /import ThemeIcon/);
  assert.match(compactHelp, /icon: <ThemeIcon name="compass"/);
  assert.match(compactHelp, /icon: <ThemeIcon name="journal"/);
  assert.match(compactHelp, /icon: <ThemeIcon name="evidence"/);
  assert.match(compactHelp, /icon: <ThemeIcon name="profile"/);
  assert.match(compactHelp, /icon=\{<ThemeIcon name="help"/);
  assert.match(compactHelp, /<ThemeIcon name=\{row\.iconName\}/);
  assert.doesNotMatch(help, /🧭|🗂️|🔐|🧰|📝|⚡|🛡️|🧱|📦|🧹|🛟/);
});

test("28D11 explains privacy access boundaries without claiming legal data ownership", () => {
  assert.match(compactHelp, /Your personal activity history stays tied to your account/);
  assert.doesNotMatch(help, /account-owned data/);
  assert.match(compactHelp, /Season administration is scoped/);
  assert.match(compactHelp, /League Administrators can access the season records needed to operate leagues they manage/);
  assert.match(compactHelp, /Only Platform Administrators can make evidence decisions/);
  assert.match(compactHelp, /Platform Administrators may access additional records required for moderation, security, support and trusted deletion/);
});

test("28D11 states what current evidence delivery stores and what it does not upload", () => {
  assert.match(compactHelp, /Evidence media stays outside the app/);
  assert.match(compactHelp, /currently WhatsApp/);
  assert.match(compactHelp, /verification code/);
  assert.match(compactHelp, /submission time/);
  assert.match(compactHelp, /reviewed quantity/);
  assert.match(compactHelp, /proof image itself is not uploaded to Cloud Firestore by the current client/);
});

test("28D11 keeps the infrastructure disclosure grounded in the current client", () => {
  assert.match(compactHelp, /Firebase Authentication provides sign-in/);
  assert.match(compactHelp, /Cloud Firestore stores app records/);
  assert.match(compactHelp, /Firebase Hosting serves the website/);
  assert.match(compactHelp, /does not include advertising, payment or social-tracking SDKs/);
  assert.match(compactHelp, /not a final legal privacy notice/);
});

test("28D11 makes account export scope clearer and fixes unavailable-section grammar", () => {
  assert.match(compactHelp, /entries and correction history/);
  assert.match(compactHelp, /season memberships, contributions and evidence/);
  assert.match(compactHelp, /Pocket activity/);
  assert.match(compactHelp, /leadership votes/);
  assert.match(compactHelp, /deletion request/);
  assert.match(compactHelp, /unavailable === 1 \? "section" : "sections"/);
});

test("28D11 focuses account-request load errors while preserving URL and busy semantics", () => {
  assert.match(compactHelp, /const requestErrorRef = useRef\(null\)/);
  assert.match(compactHelp, /if \(requestError\) requestErrorRef\.current\?\.focus\(\)/);
  assert.match(compactHelp, /ref=\{requestErrorRef\}/);
  assert.match(compactHelp, /tabIndex="-1"/);
  assert.match(compactHelp, /searchParams\.get\("tab"\)/);
  assert.match(compactHelp, /aria-busy=\{exporting \|\| requestBusy \|\| undefined\}/);
  assert.match(css, /\.account-tools \.inline-alert:focus/);
  assert.match(css, /min-height: 46px/);
});
