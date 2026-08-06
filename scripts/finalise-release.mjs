import fs from "node:fs";
import path from "node:path";

const VERSION = "0.23.0";
const PREVIOUS_PRODUCTION = "0.22.0";
const root = process.cwd();
const candidateMarker = "<!-- RELEASE_STATUS: CANDIDATE -->";
const deployedMarker = "<!-- RELEASE_STATUS: DEPLOYED -->";

const packageData = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
if (packageData.version !== VERSION) {
  console.error(`Release finalisation expected package version ${VERSION}, found ${packageData.version}.`);
  process.exit(1);
}

const requiredFiles = [
  "README.md",
  "docs/README.md",
  "docs/01_CURRENT_DEVELOPMENT/CURRENT_STATE.md",
  "docs/01_CURRENT_DEVELOPMENT/ACTIVE_MIGRATIONS.md",
  "docs/01_CURRENT_DEVELOPMENT/CURRENT_CONTEXT.md",
  "docs/01_CURRENT_DEVELOPMENT/NEXT_SESSION.md",
  "docs/01_CURRENT_DEVELOPMENT/KNOWN_ISSUES.md",
  "docs/01_CURRENT_DEVELOPMENT/ROADMAP.md",
  "docs/01_CURRENT_DEVELOPMENT/RELEASE_CANDIDATE_CHECKLIST.md",
  "docs/01_CURRENT_DEVELOPMENT/SOURCE_AUDIT_V0230.md",
  "docs/02_GAME_DESIGN/POWER_PLAYS.md",
  "docs/03_ARCHITECTURE/decisions/ADR-030-themed-no-repeat-power-plays.md",
  "docs/04_DEVELOPMENT/POWER_PLAY_OPERATIONS.md",
  "docs/06_CHAT_HANDOVER/CHAT_BRIEFING.md",
  "docs/06_CHAT_HANDOVER/RECENT_SESSION_SUMMARY.md",
  "docs/06_CHAT_HANDOVER/START_NEW_CHAT_PROMPT.txt",
  "docs/07_HISTORY/CHANGELOG.md",
  "docs/07_HISTORY/RELEASE_NOTES.md",
  "docs/07_HISTORY/VERSION_HISTORY.md",
];

requiredFiles.forEach((relativePath) => {
  if (!fs.existsSync(path.join(root, relativePath))) {
    console.error(`Required finalisation file is missing: ${relativePath}`);
    process.exit(1);
  }
});

function collectTextFiles(directory) {
  const results = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) results.push(...collectTextFiles(fullPath));
    else if (/\.(md|txt)$/i.test(entry.name)) results.push(fullPath);
  }
  return results;
}

const files = [path.join(root, "README.md"), ...collectTextFiles(path.join(root, "docs"))];
const candidateFiles = files.filter((file) => fs.readFileSync(file, "utf8").includes(candidateMarker));

if (candidateFiles.length === 0) {
  const state = fs.readFileSync(path.join(root, "docs/01_CURRENT_DEVELOPMENT/CURRENT_STATE.md"), "utf8");
  if (state.includes(deployedMarker) && state.includes(`Version: ${VERSION}`)) {
    console.log(`v${VERSION} release documentation is already finalised.`);
    process.exit(0);
  }
  console.error(`No v${VERSION} candidate markers were found. Refusing to guess release state.`);
  process.exit(1);
}

const replacements = [
  [candidateMarker, deployedMarker],
  ["Production version: **0.22.0**", "Production version: **0.23.0**"],
  ["Production version: 0.22.0", "Production version: 0.23.0"],
  ["Current production: **v0.22.0**", "Current production: **v0.23.0**"],
  ["Current production: v0.22.0", "Current production: v0.23.0"],
  ["Current production: 0.22.0", "Current production: 0.23.0"],
  ["v0.22.0 remains deployed at:", "v0.23.0 is deployed at:"],
  ["Production remains v0.22.0", "Production is v0.23.0"],
  ["production remains v0.22.0", "production is v0.23.0"],
  ["Status: **v0.23.0 Power Plays release candidate; Windows verification and production deployment pending; pre-v1.0**", "Status: **v0.23.0 verified and deployed; release commit pending; pre-v1.0**"],
  ["Status: **Release candidate; Windows verification and production deployment pending; pre-v1.0**", "Status: **Verified and deployed; release commit pending; pre-v1.0**"],
  ["Status: Release candidate; Windows verification and production deployment pending; pre-v1.0", "Status: Verified and deployed; release commit pending; pre-v1.0"],
  ["Status: Source implementation and packaging verification complete; Windows release gates and production deployment pending.", "Status: Implementation, Windows verification and production deployment complete; release commit pending."],
  ["Current source: v0.23.0 candidate", "Current source: v0.23.0"],
  ["## Current candidate — v0.23.0", "## Current production — v0.23.0"],
  ["# Recent Session Summary — v0.23.0 Candidate", "# Recent Session Summary — v0.23.0"],
  ["## [0.23.0] — 5 August 2026 — Release candidate", "## [0.23.0] — 5 August 2026 — Verified production deployment"],
  ["Status: Release candidate", "Status: Verified production deployment"],
  ["| 0.23.0 | 5 August 2026 | Themed no-repeat Power Plays; release candidate |", "| 0.23.0 | 5 August 2026 | Themed no-repeat Power Plays; verified production deployment |"],
];

const checks = [
  ["- [ ] `npm install` completes.", "- [x] `npm install` completes."],
  ["- [ ] ESLint passes without warnings.", "- [x] ESLint passes without warnings."],
  ["- [ ] 120 domain tests pass on Windows.", "- [x] 120 domain tests pass on Windows."],
  ["- [ ] Vite production build passes.", "- [x] Vite production build passes."],
  ["- [ ] 51 Firestore Security Rules tests pass using Java 21.", "- [x] 51 Firestore Security Rules tests pass using Java 21."],
  ["- [ ] Expected negative `PERMISSION_DENIED` logs are confirmed as passing assertions.", "- [x] Expected negative `PERMISSION_DENIED` logs are confirmed as passing assertions."],
  ["- [ ] `npm run check:release` confirms v0.23.0 and Hosting target `app`.", "- [x] `npm run check:release` confirms v0.23.0 and Hosting target `app`."],
  ["- [ ] `npm audit` reviewed; no automatic or forced breaking fix applied.", "- [x] `npm audit` reviewed; no automatic or forced breaking fix applied."],
  ["- [ ] Firestore Rules and Hosting deploy with `npm run deploy:production`.", "- [x] Firestore Rules and Hosting deploy with `npm run deploy:production`."],
  ["- [ ] Branded Hosting target releases successfully.", "- [x] Branded Hosting target releases successfully."],
  ["- [ ] Included `FINALISE_RELEASE.ps1` updates candidate documentation.", "- [x] Included `FINALISE_RELEASE.ps1` updates candidate documentation."],
];

let changed = 0;
for (const file of files) {
  let text = fs.readFileSync(file, "utf8");
  const before = text;
  for (const [from, to] of [...replacements, ...checks]) text = text.split(from).join(to);
  if (text !== before) {
    fs.writeFileSync(file, text, "utf8");
    changed += 1;
  }
}

const nextSession = `# Champions Legacy Challenge — Next Session\n\n${deployedMarker}\nCurrent source: v0.23.0  \nCurrent production: v0.23.0\n\n## First action\n\nCommit the verified and deployed release:\n\n\`\`\`powershell\ngit add -A\ngit commit -m "release: deploy v0.23.0 themed power plays"\ngit status\n\`\`\`\n\nVerified release evidence:\n\n- 120 domain tests passed.\n- 51 Firestore Rules tests passed using Java 21.\n- ESLint and Vite production build passed.\n- Release-readiness confirmed v0.23.0 on Hosting target \`app\`.\n- Firestore Rules and branded Firebase Hosting deployed successfully.\n\nAfter the commit, the next planned feature release is v0.24.0: one-week post-move roster stability and the weekly composition-balance foundation. Do not run either audit-fix command. Do not create a v1.0 tag.\n`;
fs.writeFileSync(path.join(root, "docs/01_CURRENT_DEVELOPMENT/NEXT_SESSION.md"), nextSession, "utf8");

const remaining = files.filter((file) => fs.readFileSync(file, "utf8").includes(candidateMarker));
if (remaining.length > 0) {
  console.error("Release finalisation left candidate markers in:");
  remaining.forEach((file) => console.error(`- ${path.relative(root, file)}`));
  process.exit(1);
}

console.log(`Finalised v${VERSION} release documentation in ${changed} files. Production was advanced from v${PREVIOUS_PRODUCTION} to v${VERSION}.`);
console.log("Next: review git status, commit the release, and keep it pre-v1.0.");
