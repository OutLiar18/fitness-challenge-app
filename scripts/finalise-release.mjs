import fs from "node:fs";
import path from "node:path";

const VERSION = "0.20.0";
const PREVIOUS_PRODUCTION = "0.19.0";
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
  "docs/01_CURRENT_DEVELOPMENT/SOURCE_AUDIT_V0200.md",
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
    "Source version: **0.20.0**  \nProduction version: **0.19.0**  \nStatus: **v0.20.0 release candidate; Windows verification and production deployment pending; pre-v1.0**",
    "Source version: **0.20.0**  \nProduction version: **0.20.0**  \nStatus: **v0.20.0 verified, deployed and ready to commit; pre-v1.0**",
  ],
  [
    "Current source: **v0.20.0 — Audited Factual Corrections and History Resilience**  \nCurrent production: **v0.19.0**  \nStatus: **Release candidate; Windows verification and production deployment pending; pre-v1.0**",
    "Current source: **v0.20.0 — Audited Factual Corrections and History Resilience**  \nCurrent production: **v0.20.0**  \nStatus: **Verified and deployed; release commit pending; pre-v1.0**",
  ],
  ["Production version: **0.19.0**", "Production version: **0.20.0**"],
  ["Production version: 0.19.0", "Production version: 0.20.0"],
  [
    "Status: Release candidate; Windows verification and production deployment pending; pre-v1.0",
    "Status: Verified and deployed; release commit pending; pre-v1.0",
  ],
  [
    "Status: Source implementation and packaging tests complete; Windows verification and production deployment pending",
    "Status: Implementation, Windows verification and production deployment complete; release commit pending",
  ],
  [
    "**v0.20.0 — Audited Factual Corrections and History Resilience** is the current source candidate. Production remains v0.19.0.",
    "**v0.20.0 — Audited Factual Corrections and History Resilience** is verified and deployed to production.",
  ],
  [
    "Current source: v0.20.0 candidate  \nCurrent production: v0.19.0",
    "Current source: v0.20.0  \nCurrent production: v0.20.0",
  ],
  [
    "Status: Windows verification and production deployment pending; pre-v1.0",
    "Status: Verified and deployed; release commit pending; pre-v1.0",
  ],
  [
    "Status: Packaging audit complete; Windows release gates pending",
    "Status: Packaging and Windows release verification complete; production deployed",
  ],
  [
    "Status: Release candidate; Windows verification and production deployment pending",
    "Status: Verified and deployed; release commit pending",
  ],
  [
    "Status: Release candidate",
    "Status: Verified production deployment",
  ],
  [
    "Packaging verification passes 96 domain tests and static source audits. Windows lint/build, 44 Rules tests, release-readiness, npm audit review and production deployment remain pending.",
    "Windows verification passed clean ESLint, 96 domain tests, the Vite production build, 44 Firestore Rules tests and release-readiness. Firestore Rules and branded Hosting deployed successfully.",
  ],
  [
    "| 0.20.0 | 4 August 2026 | Audited factual corrections and active-history resilience; release candidate |",
    "| 0.20.0 | 4 August 2026 | Audited factual corrections and active-history resilience; verified production deployment |",
  ],
  ["v0.19.0 remains deployed at:", "v0.20.0 is deployed at:"],
  ["## Delivered in the v0.20.0 candidate", "## Delivered in v0.20.0"],
  ["## Current candidate — v0.20.0", "## Current production — v0.20.0"],
  ["## Candidate verification", "## Release verification"],
  ["# Recent Session Summary — v0.20.0 Candidate", "# Recent Session Summary — v0.20.0"],
  ["bringing expected totals to 96 and 44", "bringing verified totals to 96 and 44"],
  ["## Release-candidate verification", "## Verification environment"],
  [
    "- The Windows Vite build, ESLint and all 44 Firestore Rules tests remain authoritative release gates.",
    "- Authoritative Windows verification passed the Vite build, ESLint, all 44 Firestore Rules tests and release-readiness.",
  ],
  [
    "## Authoritative checks still required on Windows\n\n- npm installation;\n- ESLint;\n- Vite production build;\n- 44 Firestore Rules tests using Java 21;\n- release-readiness for v0.20.0 and Hosting target `app`;\n- npm audit review.",
    "## Authoritative Windows release checks\n\n- npm installation completed.\n- ESLint passed.\n- The Vite production build passed.\n- All 44 Firestore Rules tests passed using Java 21.\n- Release-readiness confirmed v0.20.0 and Hosting target `app`.\n- npm audit was reviewed without a forced breaking fix.",
  ],
  [
    "## Verification state\n\n- 96 of 96 domain tests pass in the packaging environment.\n- JavaScript syntax and local-import audits pass.\n- Firestore Rules and five new correction-specific Rules tests require authoritative Windows/Java 21 verification.\n- ESLint and the Vite production build require authoritative Windows verification because dependencies could not be installed in the Linux packaging environment.\n- Release readiness must confirm v0.20.0 and Hosting target `app`.",
    "## Verification state\n\n- 96 of 96 domain tests passed.\n- JavaScript syntax and local-import audits passed.\n- ESLint and the Vite production build passed on Windows.\n- All 44 Firestore Rules tests passed using Java 21.\n- Release-readiness confirmed v0.20.0 and Hosting target `app`.\n- Firestore Rules and branded Firebase Hosting deployed successfully.",
  ],
  [
    "Windows gates still required:\n\n```powershell\nnpm install\nnpm run check\nnpm run test:rules\nnpm run check:release\nnpm audit\n```\n\nExpected: 96 domain tests, 44 Rules tests, clean lint/build and v0.20.0 release-readiness on Hosting target `app`.",
    "Authoritative Windows verification passed:\n\n- npm installation;\n- 96 domain tests;\n- 44 Firestore Rules tests using Java 21;\n- clean ESLint and Vite production build;\n- v0.20.0 release-readiness on Hosting target `app`;\n- npm audit review without a forced breaking fix.",
  ],
  [
    "Review Windows release-gate output. Do not deploy, finalise or commit until every gate passes. Because Rules changed, approved deployment uses `npm run deploy:production`.",
    "Use v0.20.0 as the verified production baseline. Keep the project pre-v1.0 and plan the next trusted-operations phase without changing frozen competition rules.",
  ],
  [
    "## Required next commands\n\n```powershell\ncd C:\\Users\\Kylep\\fitness-tracker\nnpm install\nnpm run check\nnpm run test:rules\nnpm run check:release\nnpm audit\n```\n\nDo not deploy or run the finaliser until the output is reviewed. Do not run `npm audit fix --force`.",
    "## Release verification\n\nAuthoritative Windows verification passed 96 domain tests, 44 Firestore Rules tests, ESLint, the Vite production build and release-readiness for v0.20.0 on Hosting target `app`. Firestore Rules and branded Hosting deployed successfully. Do not run `npm audit fix --force` and do not create a v1.0 tag.",
  ],
  [
    "Current source is the v0.20.0 release candidate. Production is v0.19.0. The immediate job is to review the Windows release-gate output: 96 domain tests, 44 Firestore Rules tests, ESLint, Vite build, release-readiness and npm audit. Do not deploy until all gates pass. Because Rules changed, deploy with npm run deploy:production, then run the included FINALISE_RELEASE.ps1 and commit. Keep the project pre-v1.0 and do not run npm audit fix --force.",
    "Current source and production are v0.20.0. Windows verification passed 96 domain tests, 44 Firestore Rules tests, ESLint, the Vite build and release-readiness. Firestore Rules and branded Hosting deployed successfully. Treat v0.20.0 as the production baseline, keep the project pre-v1.0 and do not run npm audit fix --force.",
  ],
  [
    "Expected v0.20.0 targets are clean ESLint, **96 domain tests**, **44 Firestore Security Rules tests**, a successful Vite production build and release-readiness for Hosting target `app`.",
    "Verified v0.20.0 results are clean ESLint, **96 domain tests**, **44 Firestore Security Rules tests**, a successful Vite production build and release-readiness for Hosting target `app`.",
  ],
  [
    "Because v0.20.0 changes Firestore Security Rules, production deployment must use `npm run deploy:production` after all release gates pass.",
    "v0.20.0 changed Firestore Security Rules, so Rules and branded Hosting were deployed together with `npm run deploy:production`.",
  ],
];

const checkboxReplacements = [
  ["- [ ] `npm install` completes.", "- [x] `npm install` completes."],
  ["- [ ] ESLint passes without warnings.", "- [x] ESLint passes without warnings."],
  ["- [ ] 96 domain tests pass on Windows.", "- [x] 96 domain tests pass on Windows."],
  ["- [ ] Vite production build passes.", "- [x] Vite production build passes."],
  ["- [ ] 44 Firestore Security Rules tests pass using Java 21.", "- [x] 44 Firestore Security Rules tests pass using Java 21."],
  ["- [ ] Expected negative `PERMISSION_DENIED` logs are confirmed as passing assertions.", "- [x] Expected negative `PERMISSION_DENIED` logs are confirmed as passing assertions."],
  ["- [ ] `npm run check:release` confirms v0.20.0 and Hosting target `app`.", "- [x] `npm run check:release` confirms v0.20.0 and Hosting target `app`."],
  ["- [ ] `npm audit` reviewed; no forced breaking fix applied.", "- [x] `npm audit` reviewed; no forced breaking fix applied."],
  ["- [ ] Firestore Rules and Hosting deploy with `npm run deploy:production`.", "- [x] Firestore Rules and Hosting deploy with `npm run deploy:production`."],
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

const nextSession = `# Champions Legacy Challenge — Next Session\n\n${deployedMarker}\nCurrent source: v0.20.0  \nCurrent production: v0.20.0\n\n## First action\n\nCommit the verified and deployed release:\n\n\`\`\`powershell\ngit add -A\ngit commit -m "release: deploy v0.20.0 audited entry corrections"\ngit status\n\`\`\`\n\nVerified release evidence:\n\n- 96 domain tests passed.\n- 44 Firestore Rules tests passed using Java 21.\n- ESLint and Vite production build passed.\n- Release-readiness confirmed v0.20.0 on Hosting target \`app\`.\n- Firestore Rules and branded Firebase Hosting deployed successfully.\n\nDo not run \`npm audit fix --force\`. Do not create a v1.0 tag.\n\n## Recommended next phase\n\nPlan trusted competition operations: server/Admin SDK recalculation, reliable scheduled publication, trusted account deletion and whole-season reconciliation.\n`;
fs.writeFileSync(path.join(root, "docs/01_CURRENT_DEVELOPMENT/NEXT_SESSION.md"), nextSession, "utf8");

const remainingCandidates = files.filter((relativePath) =>
  fs.readFileSync(path.join(root, relativePath), "utf8").includes(candidateMarker),
);
if (remainingCandidates.length > 0) {
  console.error("Release finalisation left candidate markers in:");
  remainingCandidates.forEach((item) => console.error(`- ${item}`));
  process.exit(1);
}

const staleReleasePhrases = [
  "v0.19.0 remains deployed at:",
  "Current source: v0.20.0 candidate",
  "Current production: v0.19.0",
  "Production remains v0.19.0",
  "Windows gates still required:",
  "## Required next commands",
  "## Authoritative checks still required on Windows",
  "## Release-candidate verification",
  "## Delivered in the v0.20.0 candidate",
];
const staleReleaseFiles = files.filter((relativePath) => {
  const text = fs.readFileSync(path.join(root, relativePath), "utf8");
  return staleReleasePhrases.some((phrase) => text.includes(phrase));
});
if (staleReleaseFiles.length > 0) {
  console.error("Release finalisation left stale candidate wording in:");
  staleReleaseFiles.forEach((item) => console.error(`- ${item}`));
  process.exit(1);
}

console.log(
  `Finalised v${VERSION} release documentation in ${changedFiles} files. Production was advanced from v${PREVIOUS_PRODUCTION} to v${VERSION}.`,
);
console.log("Next: review git status, commit the release, and keep it pre-v1.0.");
