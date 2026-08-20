import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const indexCss = fs.readFileSync(new URL("../src/index.css", import.meta.url), "utf8");
const shellCss = fs.readFileSync(
  new URL("../src/components/layout/AppShell.css", import.meta.url),
  "utf8",
);
const pageHeaderCss = fs.readFileSync(
  new URL("../src/components/layout/PageHeader.css", import.meta.url),
  "utf8",
);
const workspaceTabsCss = fs.readFileSync(
  new URL("../src/components/common/WorkspaceTabs.css", import.meta.url),
  "utf8",
);
const welcomeCss = fs.readFileSync(
  new URL("../src/components/dashboard/WelcomeCard.css", import.meta.url),
  "utf8",
);
const authCss = fs.readFileSync(
  new URL("../src/pages/Auth.css", import.meta.url),
  "utf8",
);
const dailyProgressCss = fs.readFileSync(
  new URL("../src/components/dashboard/DailyProgress.css", import.meta.url),
  "utf8",
);

test("v0.27 uses the Champions Legacy blood-red design tokens", () => {
  assert.match(indexCss, /--primary:\s*#c20e0d;/);
  assert.match(indexCss, /--primary-control:\s*#c20e0d;/);
  assert.match(indexCss, /--primary:\s*#ff5148;/);
  assert.match(indexCss, /--primary-control:\s*#c20e0d;/);
  assert.match(indexCss, /--tone-purple:/);
  assert.match(indexCss, /--tone-cyan:/);
});

test("Dashboard Welcome Card uses the crimson-black warrior identity instead of legacy blue", () => {
  const lowerWelcomeCss = welcomeCss.toLowerCase();
  assert.ok(lowerWelcomeCss.includes("var(--primary-control)"));
  assert.ok(lowerWelcomeCss.includes("var(--mbti-primary-bright"));
  assert.ok(lowerWelcomeCss.includes("#050505"));
  for (const retiredBlue of ["#101d42", "#2447c6", "#4169e1", "#16214a"]) {
    assert.ok(!lowerWelcomeCss.includes(retiredBlue));
  }
});

test("Auth and Daily Progress no longer leak legacy blue branding", () => {
  const auth = authCss.toLowerCase();
  const progress = dailyProgressCss.toLowerCase();

  for (const retiredBlue of ["#101d42", "#2447c6", "#4169e1"]) {
    assert.ok(!auth.includes(retiredBlue));
  }

  assert.ok(auth.includes("#050505"));
  assert.ok(auth.includes("#c20e0d"));
  assert.ok(!progress.includes("#5f86ff"));
  assert.ok(progress.includes("var(--primary-control)"));
  assert.ok(progress.includes("#ff5148"));
});

test("shared controls use readable focus and touch foundations", () => {
  assert.match(indexCss, /outline:\s*3px solid var\(--focus-ring\)/);
  assert.match(indexCss, /box-shadow:\s*0 0 0 3px var\(--focus-ring\)/);
  assert.match(indexCss, /\.button\s*\{[\s\S]*?min-height:\s*46px;/);
  assert.match(indexCss, /\.button--primary\s*\{[\s\S]*?color:\s*var\(--on-primary\)/);
  assert.match(indexCss, /\.card\s*\{[\s\S]*?border:\s*1px solid var\(--border\)/);
});

test("application shell has a readable microcopy floor for primary navigation", () => {
  assert.match(shellCss, /\.app-shell-stat small\s*\{[\s\S]*?font-size:\s*0\.7rem;/);
  assert.match(shellCss, /\.app-nav__badge\s*\{[\s\S]*?font-size:\s*0\.68rem;/);
  assert.match(shellCss, /\.app-nav__group-label\s*\{[\s\S]*?font-size:\s*0\.7rem;/);
  assert.match(shellCss, /\.app-mobile-nav__link small\s*\{[\s\S]*?font-size:\s*0\.68rem;/);
  assert.match(shellCss, /@media \(max-width:\s*360px\)[\s\S]*?font-size:\s*0\.66rem;/);
  assert.match(shellCss, /--nav-tone:\s*var\(--tone-purple\)/);
  assert.match(shellCss, /--nav-tone:\s*var\(--tone-cyan\)/);
});

test("page headers and workspace tabs share the v0.27 brand treatment", () => {
  assert.match(pageHeaderCss, /v0\.27 27B — shared page-header identity/);
  assert.match(pageHeaderCss, /\.page-header::before/);
  assert.match(pageHeaderCss, /font-size:\s*0\.78rem;/);
  assert.match(workspaceTabsCss, /v0\.27 27B — workspace navigation visual foundation/);
  assert.match(workspaceTabsCss, /\.workspace-tab--active[\s\S]*?inset 3px 0 0 var\(--primary\)/);
  assert.match(workspaceTabsCss, /font-size:\s*0\.75rem;/);
});
