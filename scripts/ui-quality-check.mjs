import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const args = process.argv.slice(2);
const verify = args.includes("--verify");
const reportIndex = args.indexOf("--report");
const reportPath = reportIndex >= 0 ? args[reportIndex + 1] : "";

if (!verify && !reportPath) {
  throw new Error("Use --verify and/or --report <path>.");
}

const failures = [];
const observations = [];

function read(relative) {
  const full = path.join(root, relative);
  if (!fs.existsSync(full)) {
    failures.push(`Missing required file: ${relative}`);
    return "";
  }
  return fs.readFileSync(full, "utf8").replace(/\r\n/g, "\n");
}

function walk(directory, extension) {
  const full = path.join(root, directory);
  if (!fs.existsSync(full)) return [];
  const files = [];
  const stack = [full];
  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const target = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(target);
      else if (!extension || entry.name.endsWith(extension)) files.push(target);
    }
  }
  return files.sort();
}

function requireCondition(condition, message) {
  if (!condition) failures.push(message);
}

function kib(bytes) {
  return bytes / 1024;
}

function formatKib(bytes) {
  return `${kib(bytes).toFixed(2)} KiB`;
}

function relative(file) {
  return path.relative(root, file).replaceAll("\\", "/");
}

function parseVariables(block) {
  const variables = new Map();
  for (const match of block.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-f]{6})\s*;/gi)) {
    variables.set(match[1], match[2].toLowerCase());
  }
  return variables;
}

function luminance(hex) {
  const rgb = [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16) / 255);
  const channel = (value) =>
    value <= 0.04045
      ? value / 12.92
      : ((value + 0.055) / 1.055) ** 2.4;
  const [red, green, blue] = rgb.map(channel);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrast(first, second) {
  const firstLum = luminance(first);
  const secondLum = luminance(second);
  const lighter = Math.max(firstLum, secondLum);
  const darker = Math.min(firstLum, secondLum);
  return (lighter + 0.05) / (darker + 0.05);
}

function checkContrast(themeName, variables, foreground, background, threshold = 4.5) {
  const fg = variables.get(foreground);
  const bg = variables.get(background);
  if (!fg || !bg) {
    failures.push(`${themeName}: could not resolve --${foreground} / --${background}.`);
    return;
  }
  const ratio = contrast(fg, bg);
  observations.push(`${themeName} contrast --${foreground} on --${background}: ${ratio.toFixed(2)}:1`);
  requireCondition(
    ratio >= threshold,
    `${themeName}: --${foreground} on --${background} is ${ratio.toFixed(2)}:1; expected at least ${threshold}:1.`,
  );
}

// ---------------------------------------------------------------------------
// Build output / performance
// ---------------------------------------------------------------------------
const distAssets = walk("dist/assets", ".js");
requireCondition(distAssets.length > 0, "No built JavaScript assets found. Run the production build first.");

const jsAssets = distAssets
  .map((file) => ({
    file,
    name: path.basename(file),
    bytes: fs.statSync(file).size,
  }))
  .sort((a, b) => b.bytes - a.bytes);

const largest = jsAssets[0];
if (largest) {
  observations.push(`Largest JavaScript chunk: ${largest.name} (${formatKib(largest.bytes)})`);
  requireCondition(
    largest.bytes <= 500 * 1024,
    `Largest JavaScript chunk ${largest.name} is ${formatKib(largest.bytes)}; UI quality budget is 500 KiB.`,
  );
}

const firebaseAssets = jsAssets.filter((asset) => asset.name.startsWith("firebase-vendor"));
observations.push(
  `Firebase vendor chunks: ${firebaseAssets.length}${firebaseAssets.length ? ` (${firebaseAssets.map((asset) => formatKib(asset.bytes)).join(", ")})` : ""}`,
);
requireCondition(firebaseAssets.length >= 2, "Firebase vendor group was not partitioned into at least two build chunks.");
for (const asset of firebaseAssets) {
  requireCondition(
    asset.bytes <= 500 * 1024,
    `Firebase chunk ${asset.name} exceeds 500 KiB (${formatKib(asset.bytes)}).`,
  );
}

// ---------------------------------------------------------------------------
// Route loading / responsive / accessibility foundations
// ---------------------------------------------------------------------------
const app = read("src/App.jsx");
const lazyRoutes = [...app.matchAll(/\bconst\s+\w+\s*=\s*lazy\(\(\)\s*=>\s*import\(/g)].length;
observations.push(`Lazy-loaded page modules: ${lazyRoutes}`);
requireCondition(lazyRoutes >= 18, `Expected at least 18 lazy-loaded page modules; found ${lazyRoutes}.`);
requireCondition(app.includes("<Suspense"), "App route tree is missing Suspense around lazy pages.");

const indexCss = read("src/index.css");
requireCondition(/html\s*\{[\s\S]*?min-width:\s*320px;/m.test(indexCss), "Global HTML 320px minimum-width foundation is missing.");
requireCondition(/body\s*\{[\s\S]*?min-width:\s*320px;/m.test(indexCss), "Global body 320px minimum-width foundation is missing.");
requireCondition(indexCss.includes(":focus-visible"), "Global focus-visible styling is missing.");
requireCondition(indexCss.includes("@media (prefers-color-scheme: dark)"), "Dark color-scheme token block is missing.");
requireCondition(indexCss.includes("@media (prefers-reduced-motion: reduce)"), "Reduced-motion handling is missing.");

const lightRoot = indexCss.match(/^\s*:root\s*\{([\s\S]*?)\}\s*@media\s*\(prefers-color-scheme:\s*dark\)/m)?.[1] ?? "";
const darkRoot = indexCss.match(/@media\s*\(prefers-color-scheme:\s*dark\)\s*\{\s*:root\s*\{([\s\S]*?)\}\s*\}/m)?.[1] ?? "";
const lightVars = parseVariables(lightRoot);
const darkVars = parseVariables(darkRoot);

checkContrast("Light", lightVars, "text", "surface-raised");
checkContrast("Light", lightVars, "text-muted", "surface-raised");
checkContrast("Light", lightVars, "primary", "surface-raised");
checkContrast("Light", lightVars, "on-primary", "primary-control");
checkContrast("Dark", darkVars, "text", "surface-raised");
checkContrast("Dark", darkVars, "text-muted", "surface-raised");
checkContrast("Dark", darkVars, "primary", "surface-raised");
checkContrast("Dark", darkVars, "on-primary", "primary-control");

const shell = read("src/components/layout/AppShell.jsx");
requireCondition(
  shell.includes('href="#main-content"')
    && shell.includes('id="main-content"')
    && shell.includes("Skip to main content"),
  "Application shell skip-link target contract is missing.",
);
requireCondition(shell.includes('role="dialog"'), "Application shell More dialog semantics are missing.");
requireCondition(shell.includes('aria-modal="true"'), "Application shell More dialog aria-modal semantics are missing.");
requireCondition(shell.includes('event.key === "Escape"'), "Application shell Escape handling is missing.");

const tabs = read("src/components/common/WorkspaceTabs.jsx");
requireCondition(tabs.includes('role="tablist"'), "WorkspaceTabs tablist semantics are missing.");
requireCondition(tabs.includes('role="tab"'), "WorkspaceTabs tab semantics are missing.");
requireCondition(tabs.includes('"ArrowRight"'), "WorkspaceTabs ArrowRight keyboard navigation is missing.");
requireCondition(tabs.includes('"Home"'), "WorkspaceTabs Home keyboard navigation is missing.");
requireCondition(tabs.includes('"End"'), "WorkspaceTabs End keyboard navigation is missing.");

const dialog = read("src/components/common/ConfirmDialog.jsx");
requireCondition(dialog.includes('role="alertdialog"'), "ConfirmDialog alertdialog semantics are missing.");
requireCondition(dialog.includes('aria-modal="true"'), "ConfirmDialog aria-modal semantics are missing.");
requireCondition(dialog.includes('event.key === "Escape"'), "ConfirmDialog Escape handling is missing.");
requireCondition(dialog.includes("previousFocus"), "ConfirmDialog focus restoration foundation is missing.");

// Consequential actions should use app dialogs instead of browser-native prompts.
const sourceFiles = [
  ...walk("src/pages", ".jsx"),
  ...walk("src/components", ".jsx"),
];
const nativeDialogs = [];
for (const file of sourceFiles) {
  const content = fs.readFileSync(file, "utf8");
  if (/\bwindow\.(confirm|prompt)\s*\(/.test(content)) nativeDialogs.push(relative(file));
}
observations.push(`Browser-native confirm/prompt usages in pages/components: ${nativeDialogs.length}`);
requireCondition(nativeDialogs.length === 0, `Browser-native confirm/prompt remains in: ${nativeDialogs.join(", ")}`);

// Static review candidates. These are reported rather than treated as automatic defects.
const cssFiles = walk("src", ".css");
let microTextUnder065 = 0;
let microTextUnder060 = 0;
for (const file of cssFiles) {
  const content = fs.readFileSync(file, "utf8");
  for (const match of content.matchAll(/font-size:\s*([0-9.]+)rem\s*;/g)) {
    const size = Number(match[1]);
    if (size < 0.65) microTextUnder065 += 1;
    if (size < 0.60) microTextUnder060 += 1;
  }
}
observations.push(`CSS rem font declarations below 0.65rem: ${microTextUnder065}`);
observations.push(`CSS rem font declarations below 0.60rem: ${microTextUnder060}`);

let buttonsWithoutType = 0;
let imagesWithoutAlt = 0;
for (const file of sourceFiles) {
  const content = fs.readFileSync(file, "utf8");
  buttonsWithoutType += [...content.matchAll(/<button\b(?![^>]*\btype=)[^>]*>/gs)].length;
  imagesWithoutAlt += [...content.matchAll(/<img\b(?![^>]*\balt=)[^>]*>/gs)].length;
}
observations.push(`Static button tags without explicit type candidate count: ${buttonsWithoutType}`);
observations.push(`Static img tags without alt candidate count: ${imagesWithoutAlt}`);

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------
const status = failures.length === 0 ? "PASS" : "FAIL";
const lines = [
  `UI QUALITY CHECK: ${status}`,
  ...observations.map((item) => `- ${item}`),
];

if (failures.length > 0) {
  lines.push("Failures:");
  lines.push(...failures.map((item) => `- ${item}`));
}

console.log(lines.join("\n"));

if (reportPath) {
  const report = [
    "# Champions Legacy Challenge — v0.27 Automated Acceptance Report",
    "",
    "Generated by `scripts/ui-quality-check.mjs` from the local production build.",
    "",
    `Automated status: **${status}**`,
    "",
    "## Verified automatically",
    "",
    ...observations.map((item) => `- ${item}`),
    "",
    "## Automated failures",
    "",
    ...(failures.length ? failures.map((item) => `- ${item}`) : ["- None."]),
    "",
    "## Optional manual spot-checks",
    "",
    "- 320px narrow-mobile visual scan across primary player, competition, admin and reference routes;",
    "- representative tablet visual scan, especially Houses, Seasons, Admin, Rulebook and Log Activity;",
    "- desktop scan at a typical 1366–1440px width;",
    "- keyboard-only traversal of shell navigation, WorkspaceTabs and ConfirmDialog;",
    "- screen-reader spot-check of landmarks, tab labels, Analytics data, form errors and dialogs;",
    "- light and dark visual contrast review beyond the token pairs verified automatically;",
    "- reduced-motion OS/browser preference spot-check;",
    "- loading, empty, error and destructive-action state spot-checks;",
    "- verify there is no unintended horizontal page scrolling at 320px.",
    "",
    "These spot-checks are recommended when a release changes interaction or layout; they are not a mandatory development gate.",
    "",
  ].join("\n");

  const fullReport = path.resolve(root, reportPath);
  fs.mkdirSync(path.dirname(fullReport), { recursive: true });
  fs.writeFileSync(fullReport, report, "utf8");
}

if (failures.length > 0) process.exitCode = 1;
