import fs from "node:fs";
import path from "node:path";

const VERSION = "0.19.0";
const PREVIOUS_PRODUCTION = "0.18.0";
const root = process.cwd();
const candidateMarker = "<!-- RELEASE_STATUS: CANDIDATE -->";
const deployedMarker = "<!-- RELEASE_STATUS: DEPLOYED -->";

const packageData = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
if (packageData.version !== VERSION) {
  console.error(`Release finalisation expected package version ${VERSION}, found ${packageData.version}.`);
  process.exit(1);
}

const files = [
  "README.md",
  "docs/README.md",
  "docs/01_CURRENT_DEVELOPMENT/CURRENT_STATE.md",
  "docs/01_CURRENT_DEVELOPMENT/ACTIVE_MIGRATIONS.md",
  "docs/01_CURRENT_DEVELOPMENT/CURRENT_CONTEXT.md",
  "docs/01_CURRENT_DEVELOPMENT/NEXT_SESSION.md",
  "docs/01_CURRENT_DEVELOPMENT/KNOWN_ISSUES.md",
  "docs/01_CURRENT_DEVELOPMENT/RELEASE_CANDIDATE_CHECKLIST.md",
  "docs/06_CHAT_HANDOVER/CHAT_BRIEFING.md",
  "docs/06_CHAT_HANDOVER/RECENT_SESSION_SUMMARY.md",
  "docs/06_CHAT_HANDOVER/START_NEW_CHAT_PROMPT.txt",
  "docs/07_HISTORY/CHANGELOG.md",
  "docs/07_HISTORY/RELEASE_NOTES.md",
  "docs/07_HISTORY/VERSION_HISTORY.md",
];

for (const relativePath of files) {
  if (!fs.existsSync(path.join(root, relativePath))) {
    console.error(`Required finalisation file is missing: ${relativePath}`);
    process.exit(1);
  }
}

const candidateCount = files.reduce((count, relativePath) => {
  const text = fs.readFileSync(path.join(root, relativePath), "utf8");
  return count + (text.includes(candidateMarker) ? 1 : 0);
}, 0);

if (candidateCount === 0) {
  const alreadyDeployed = files.some((relativePath) =>
    fs.readFileSync(path.join(root, relativePath), "utf8").includes(deployedMarker),
  );
  if (alreadyDeployed) {
    console.log(`v${VERSION} release documentation is already finalised.`);
    process.exit(0);
  }
  console.error(`No v${VERSION} candidate markers were found. Refusing to guess release state.`);
  process.exit(1);
}

const replacements = [
  [candidateMarker, deployedMarker],
  [
    "Source version: **0.19.0**  \nProduction version: **0.18.0**  \nStatus: **v0.19.0 release candidate; Windows verification and Hosting deployment pending; pre-v1.0**",
    "Source version: **0.19.0**  \nProduction version: **0.19.0**  \nStatus: **v0.19.0 verified, deployed and ready to commit; pre-v1.0**",
  ],
  [
    "Current source: **v0.19.0 — Season Command Centre**  \nCurrent production: **v0.18.0**  \nStatus: **Release candidate; Windows verification and Hosting deployment pending; pre-v1.0**",
    "Current source: **v0.19.0 — Season Command Centre**  \nCurrent production: **v0.19.0**  \nStatus: **Verified and deployed; release commit pending; pre-v1.0**",
  ],
  ["Production version: 0.18.0", "Production version: 0.19.0"],
  [
    "Status: Release candidate; Windows verification and Hosting deployment pending; pre-v1.0",
    "Status: Verified and deployed; release commit pending; pre-v1.0",
  ],
  [
    "**v0.19.0 — Season Command Centre** is the current source candidate. Production remains v0.18.0.",
    "**v0.19.0 — Season Command Centre** is verified and deployed to production.",
  ],
  [
    "Status: Source implementation and packaging tests complete; Windows verification and Hosting deployment pending",
    "Status: Implementation, Windows verification and Hosting deployment complete; release commit pending",
  ],
  [
    "Current source: v0.19.0 candidate  \nCurrent production: v0.18.0",
    "Current source: v0.19.0  \nCurrent production: v0.19.0",
  ],
  [
    "- Current source candidate: v0.19.0 — Season Command Centre.\n- Current production: v0.18.0.\n- Packaging ESLint and 85 domain tests pass.\n- Vite build, unchanged 39 Rules tests, release-readiness and Hosting deployment must be confirmed on Windows.",
    "- Current source and production: v0.19.0 — Season Command Centre.\n- Windows verification passed 85 domain tests, 39 Rules tests, clean lint/build and release-readiness.\n- Branded Firebase Hosting deployed successfully.\n- Release commit remains pending.",
  ],
  [
    "Packaging ESLint and 85 domain tests pass. The Windows Vite build, unchanged 39 Rules tests, release-readiness and Hosting deployment remain pending.",
    "Windows verification passed clean ESLint, 85 domain tests, the Vite production build, 39 Rules tests and release-readiness. Branded Firebase Hosting deployed successfully.",
  ],
  [
    "Current source is the v0.19.0 Season Command Centre candidate. Production remains v0.18.0.",
    "Current source and production are v0.19.0 Season Command Centre.",
  ],
  [
    "Expected release gates are 85 domain tests, 39 unchanged Firestore Rules tests, clean lint/build and v0.19.0 release-readiness on Hosting target app. Do not use npm audit fix --force. Deploy Hosting only after gates pass.",
    "Release evidence: 85 domain tests, 39 Firestore Rules tests, clean lint/build, v0.19.0 release-readiness and successful branded Hosting deployment. Do not use npm audit fix --force.",
  ],
  [
    "Status: Release candidate; Windows verification and Hosting deployment pending",
    "Status: Verified and deployed; release commit pending",
  ],
  [
    "- Windows Vite build, unchanged 39 Rules tests, release-readiness and Hosting deployment remain pending.",
    "- Windows Vite build, 39 Rules tests and release-readiness passed.\n- Branded Firebase Hosting deployed successfully.",
  ],
  [
    "This release changes no scoring rule, Firestore collection or Security Rule. Packaging verification passes clean ESLint and 85 domain tests. The Windows Vite build, unchanged 39 Rules tests, release-readiness and Hosting deployment remain pending. v0.19.0 remains pre-v1.0.",
    "This release changes no scoring rule, Firestore collection or Security Rule. Windows verification passed clean ESLint, 85 domain tests, the Vite build, all 39 Rules tests and release-readiness. Branded Firebase Hosting deployed successfully. v0.19.0 remains pre-v1.0.",
  ],
  [
    "| 0.19.0 | 4 August 2026 | Season Command Centre and role-scoped operations reports; release candidate |",
    "| 0.19.0 | 4 August 2026 | Season Command Centre and role-scoped operations reports; verified production deployment |",
  ],
];

const checkboxReplacements = [
  ["- [ ] `npm install` completes.", "- [x] `npm install` completes."],
  ["- [ ] ESLint passes without warnings.", "- [x] ESLint passes without warnings."],
  ["- [ ] 85 domain tests pass on Windows.", "- [x] 85 domain tests pass on Windows."],
  ["- [ ] Vite production build passes.", "- [x] Vite production build passes."],
  ["- [ ] 39 Firestore Security Rules tests pass using Java 21.", "- [x] 39 Firestore Security Rules tests pass using Java 21."],
  ["- [ ] Expected negative `PERMISSION_DENIED` logs are confirmed as passing assertions.", "- [x] Expected negative `PERMISSION_DENIED` logs are confirmed as passing assertions."],
  ["- [ ] `npm run check:release` confirms v0.19.0 and Hosting target `app`.", "- [x] `npm run check:release` confirms v0.19.0 and Hosting target `app`."],
  ["- [ ] `npm audit` reviewed; no forced breaking fix applied.", "- [x] `npm audit` reviewed; no forced breaking fix applied."],
  ["- [ ] Hosting deploys with `npm run deploy:hosting`.", "- [x] Hosting deploys with `npm run deploy:hosting`."],
  ["- [ ] Branded Hosting target releases successfully.", "- [x] Branded Hosting target releases successfully."],
  ["- [ ] Included `FINALISE_RELEASE.ps1` updates candidate documentation.", "- [x] Included `FINALISE_RELEASE.ps1` updates candidate documentation."],
];

let changedFiles = 0;
for (const relativePath of files) {
  const fullPath = path.join(root, relativePath);
  let text = fs.readFileSync(fullPath, "utf8");
  const before = text;
  for (const [from, to] of [...replacements, ...checkboxReplacements]) {
    text = text.split(from).join(to);
  }
  if (text !== before) {
    fs.writeFileSync(fullPath, text, "utf8");
    changedFiles += 1;
  }
}

const nextSession = `# Champions Legacy Challenge — Next Session\n\n${deployedMarker}\nCurrent source: v0.19.0  \nCurrent production: v0.19.0\n\n## First action\n\nCommit the verified and deployed release:\n\n\`\`\`powershell\ngit add -A\ngit commit -m "release: deploy v0.19.0 season command centre"\ngit status\n\`\`\`\n\nVerified release evidence:\n\n- 85 domain tests passed.\n- 39 Firestore Rules tests passed using Java 21.\n- ESLint and Vite production build passed.\n- Release-readiness confirmed v0.19.0 on Hosting target \`app\`.\n- Branded Firebase Hosting deployed successfully.\n\nDo not run \`npm audit fix --force\`. Do not create a v1.0 tag.\n\n## Recommended next phase\n\nDesign the audited factual correction and reconciliation workflow before implementing direct entry changes.\n`;
fs.writeFileSync(path.join(root, "docs/01_CURRENT_DEVELOPMENT/NEXT_SESSION.md"), nextSession, "utf8");

const remainingCandidates = files.filter((relativePath) =>
  fs.readFileSync(path.join(root, relativePath), "utf8").includes(candidateMarker),
);
if (remainingCandidates.length > 0) {
  console.error("Release finalisation left candidate markers in:");
  remainingCandidates.forEach((item) => console.error(`- ${item}`));
  process.exit(1);
}

console.log(
  `Finalised v${VERSION} release documentation in ${changedFiles} files. Production was advanced from v${PREVIOUS_PRODUCTION} to v${VERSION}.`,
);
console.log("Next: review git status, commit the release, and keep it pre-v1.0.");
