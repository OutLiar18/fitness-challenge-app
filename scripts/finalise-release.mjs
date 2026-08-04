import fs from "node:fs";
import path from "node:path";

const VERSION = "0.18.0";
const PREVIOUS_PRODUCTION = "0.17.0";
const root = process.cwd();
const candidateMarker = "<!-- RELEASE_STATUS: CANDIDATE -->";
const deployedMarker = "<!-- RELEASE_STATUS: DEPLOYED -->";

const packageData = JSON.parse(
  fs.readFileSync(path.join(root, "package.json"), "utf8"),
);

if (packageData.version !== VERSION) {
  console.error(
    `Release finalisation expected package version ${VERSION}, found ${packageData.version}.`,
  );
  process.exit(1);
}

const replacements = [
  [candidateMarker, deployedMarker],
  [
    "Source version: **0.18.0**  \nProduction version: **0.17.0**  \nStatus: **v0.18.0 release candidate; Windows verification and production deployment pending; pre-v1.0**",
    "Source version: **0.18.0**  \nProduction version: **0.18.0**  \nStatus: **v0.18.0 verified, deployed and ready to commit; pre-v1.0**",
  ],
  [
    "Current source: **v0.18.0 — External Evidence and Published Standings**  \nCurrent production: **v0.17.0**  \nStatus: **Release candidate; Windows verification and production deployment pending; pre-v1.0**",
    "Current source: **v0.18.0 — External Evidence and Published Standings**  \nCurrent production: **v0.18.0**  \nStatus: **Verified and deployed; release commit pending; pre-v1.0**",
  ],
  ["Production version: 0.17.0", "Production version: 0.18.0"],
  [
    "Status: Release candidate; Windows verification and production deployment pending; pre-v1.0",
    "Status: Verified and deployed; release commit pending; pre-v1.0",
  ],
  [
    "The currently deployed production release is v0.17.0 at:",
    "v0.18.0 is deployed at:",
  ],
  [
    "Expected v0.18.0 release targets are clean ESLint, **80 domain tests**, **39 Firestore Security Rules tests**, a successful Vite production build and release-readiness for Hosting target `app`.",
    "Authoritative Windows verification passed clean ESLint, **80 domain tests**, **39 Firestore Security Rules tests**, the Vite production build and release-readiness for Hosting target `app`. Firestore Rules and branded Firebase Hosting deployed together successfully.",
  ],
  [
    "Status: Source implementation and packaging tests complete; Windows build, Rules verification and production deployment pending",
    "Status: Implementation, Windows verification and production deployment complete; release commit pending",
  ],
  [
    "- Current source candidate: v0.18.0 — External Evidence and Published Standings.\n- Current production: v0.17.0.\n- Packaging lint and 80 domain tests pass.\n- Windows build, 39 Firestore Rules tests, release-readiness and deployment are pending.",
    "- Current source and production: v0.18.0 — External Evidence and Published Standings.\n- Windows verification passed 80 domain tests, 39 Firestore Rules tests, clean lint/build and release-readiness.\n- Firestore Rules and branded Hosting deployed together successfully.\n- Release commit remains pending.",
  ],
  [
    "**v0.18.0 — External Evidence and Published Standings** is the current source candidate. Production remains v0.17.0.",
    "**v0.18.0 — External Evidence and Published Standings** is verified and deployed to production.",
  ],
  [
    "- Clean ESLint passed in the packaging environment.\n- 80 of 80 domain tests passed in the packaging environment.\n- Static syntax, import and reachability audits are part of the package audit.\n- The Vite build and all 39 Firestore Security Rules tests must be confirmed on Windows before deployment.\n- `npm run check:release` must verify v0.18.0 and Hosting target `app`.",
    "- Clean ESLint passed on Windows.\n- 80 of 80 domain tests passed on Windows.\n- The Vite production build passed.\n- 39 of 39 Firestore Security Rules tests passed using Java 21.\n- Expected negative `PERMISSION_DENIED` logs were passing assertions.\n- `npm run check:release` verified v0.18.0 and Hosting target `app`.\n- Firestore Rules and branded Firebase Hosting deployed together successfully.",
  ],
  [
    "Apply the v0.18.0 package and run the Windows release gates. Do not deploy, commit or create a v1.0 tag until those gates pass. After a successful later production deployment, run the included `FINALISE_RELEASE.ps1`, then commit the release.",
    "Commit v0.18.0 with a clean working tree. Do not create a v1.0 tag or declaration without explicit approval.",
  ],
  [
    "Current source: v0.18.0 candidate  \nCurrent production: v0.17.0",
    "Current source: v0.18.0  \nCurrent production: v0.18.0",
  ],
  [
    "## First action\n\nRun the Windows release gates:",
    "## First action\n\nCommit the verified and deployed release after this finalisation:",
  ],
  [
    "Expected targets:\n\n- 80 domain tests.\n- 39 Firestore Rules tests using Java 21.\n- Clean ESLint.\n- Successful Vite build.\n- Release-readiness v0.18.0 on Hosting target `app`.\n\nDo not run `npm audit fix --force`.\n\n## After verification\n\nDeploy Rules and Hosting together with `npm run deploy:production`. After successful deployment, run the `FINALISE_RELEASE.ps1` included in the main updater, then commit with:",
    "Verified release evidence:\n\n- 80 domain tests passed.\n- 39 Firestore Rules tests passed using Java 21.\n- ESLint and Vite production build passed.\n- Release-readiness confirmed v0.18.0 on Hosting target `app`.\n- Firestore Rules and branded Hosting deployed together successfully.\n\nDo not run `npm audit fix --force`.\n\nCommit with:",
  ],
  [
    "Packaging-environment lint and 80 domain tests pass. Windows Vite build, 39 Firestore Rules tests, release-readiness and production deployment remain pending.",
    "Windows verification and production deployment succeeded: clean ESLint, 80 domain tests, Vite build, 39 Firestore Rules tests and release-readiness passed. Firestore Rules and branded Hosting deployed together successfully. Full manual integrated review remains deferred.",
  ],
  [
    "Date: 4 August 2026  \nStatus: Release candidate; Windows verification and production deployment pending",
    "Date: 4 August 2026  \nStatus: Verified and deployed; release commit pending",
  ],
  [
    "- Windows Vite build, 39 Rules tests, release-readiness and production deployment remain pending.",
    "- Windows Vite build, 39 Rules tests and release-readiness passed.\n- Firestore Rules and branded Hosting deployed together successfully.",
  ],
  [
    "The candidate passes clean packaging lint and 80 domain tests. Windows build, 39 Firestore Rules tests, release-readiness and combined Rules/Hosting deployment remain pending.",
    "Authoritative Windows verification passed clean lint, 80 domain tests, the Vite production build, 39 Firestore Rules tests and release-readiness. Firestore Rules and branded Hosting deployed together successfully.",
  ],
  [
    "External WhatsApp evidence, scoped reviewers, audited proof decisions and immutable published player standings. Release candidate; Windows verification and deployment pending.",
    "External WhatsApp evidence, scoped reviewers, audited proof decisions and immutable published player standings. Verified and deployed to production.",
  ],
  [
    "| 0.18.0 | 4 August 2026 | External evidence and published standings; release candidate |",
    "| 0.18.0 | 4 August 2026 | External evidence and published standings; verified production deployment |",
  ],
  [
    "v0.18.0 source, UI, services, tests and Firestore Rules implement the above. Packaging lint and 80 domain tests pass. Windows build, 39 Rules tests, release-readiness and deployment remain pending.",
    "v0.18.0 source, UI, services, tests and Firestore Rules implement the above. Windows verification passed 80 domain tests, 39 Rules tests, clean lint/build and release-readiness. Firestore Rules and branded Hosting deployed together successfully.",
  ],
  [
    "Current source is the v0.18.0 External Evidence and Published Standings candidate. Production remains v0.17.0 until Windows verification and combined Rules/Hosting deployment succeed.",
    "Current source and production are v0.18.0 External Evidence and Published Standings. Windows verification and combined Rules/Hosting deployment succeeded.",
  ],
  [
    "Expected release gates are 80 domain tests, 39 Firestore Rules tests, clean lint/build and v0.18.0 release-readiness on Hosting target app. Do not use npm audit fix --force. Do not deploy before gates pass. After successful deployment, use the FINALISE_RELEASE.ps1 included in the main updater; do not create a separate documentation sync.",
    "Release evidence: 80 domain tests, 39 Firestore Rules tests, clean lint/build, v0.18.0 release-readiness and successful combined Rules/Hosting deployment. Do not use npm audit fix --force. Commit v0.18.0 cleanly; do not create a separate documentation sync.",
  ],
];

const checkboxReplacements = [
  ["- [ ] `npm install` completes.", "- [x] `npm install` completes."],
  ["- [ ] ESLint passes without warnings.", "- [x] ESLint passes without warnings."],
  ["- [ ] 80 domain tests pass on Windows.", "- [x] 80 domain tests pass on Windows."],
  ["- [ ] Vite production build passes.", "- [x] Vite production build passes."],
  ["- [ ] 39 Firestore Security Rules tests pass using Java 21.", "- [x] 39 Firestore Security Rules tests pass using Java 21."],
  ["- [ ] Expected negative `PERMISSION_DENIED` logs are confirmed as passing assertions.", "- [x] Expected negative `PERMISSION_DENIED` logs are confirmed as passing assertions."],
  ["- [ ] `npm run check:release` confirms v0.18.0 and Hosting target `app`.", "- [x] `npm run check:release` confirms v0.18.0 and Hosting target `app`."],
  ["- [ ] `npm audit` reviewed; no forced breaking fix applied.", "- [x] `npm audit` reviewed; no forced breaking fix applied."],
  ["- [ ] Firestore Rules compile successfully.", "- [x] Firestore Rules compile successfully."],
  ["- [ ] Rules and Hosting deploy together with `npm run deploy:production`.", "- [x] Rules and Hosting deploy together with `npm run deploy:production`."],
  ["- [ ] Branded Hosting target releases successfully.", "- [x] Branded Hosting target releases successfully."],
  ["- [ ] Included `FINALISE_RELEASE.ps1` updates candidate documentation.", "- [x] Included `FINALISE_RELEASE.ps1` updates candidate documentation."],
];

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

let candidateCount = 0;
let deployedCount = 0;
for (const relativePath of files) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    console.error(`Required finalisation file is missing: ${relativePath}`);
    process.exit(1);
  }
  const text = fs.readFileSync(fullPath, "utf8");
  candidateCount += text.includes(candidateMarker) ? 1 : 0;
  deployedCount += text.includes(deployedMarker) ? 1 : 0;
}

if (candidateCount === 0 && deployedCount > 0) {
  console.log(`v${VERSION} release documentation is already finalised.`);
  process.exit(0);
}

if (candidateCount === 0) {
  console.error(
    `No v${VERSION} candidate markers were found. Refusing to guess release state.`,
  );
  process.exit(1);
}

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

const deployedNextSession = `# Champions Legacy Challenge — Next Session

${deployedMarker}
Current source: v0.18.0  
Current production: v0.18.0

## First action

Commit the verified and deployed release:

\`\`\`powershell
git add -A
git commit -m "release: deploy v0.18.0 external evidence and published standings"
git status
\`\`\`

Verified release evidence:

- 80 domain tests passed.
- 39 Firestore Rules tests passed using Java 21.
- ESLint and Vite production build passed.
- Release-readiness confirmed v0.18.0 on Hosting target \`app\`.
- Firestore Rules and branded Hosting deployed together successfully.

Do not run \`npm audit fix --force\`.

## Deferred

- True background scheduled publication.
- Trusted server recalculation.
- Audited factual entry correction.
- Media upload/storage.
- Full final cross-device and accessibility review.
- Undefined Power Plays, Diamonds, Transfer Market and late-season twists.
`;
fs.writeFileSync(
  path.join(root, "docs/01_CURRENT_DEVELOPMENT/NEXT_SESSION.md"),
  deployedNextSession,
  "utf8",
);

const checklist = path.join(
  root,
  "docs/01_CURRENT_DEVELOPMENT/RELEASE_CANDIDATE_CHECKLIST.md",
);
let checklistText = fs.readFileSync(checklist, "utf8");
checklistText = checklistText.replace(
  "- [ ] v0.18.0 is committed with a clean working tree.",
  "- [ ] v0.18.0 committed with a clean working tree (complete after the next Git commit).",
);
fs.writeFileSync(checklist, checklistText, "utf8");

const remainingCandidates = files.filter((relativePath) =>
  fs
    .readFileSync(path.join(root, relativePath), "utf8")
    .includes(candidateMarker),
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
