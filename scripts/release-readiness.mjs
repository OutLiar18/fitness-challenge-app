import fs from "node:fs";
import path from "node:path";

const EXPECTED_VERSION = "0.18.0";
const EXPECTED_HOSTING_TARGET = "app";
const projectRoot = process.cwd();
const requiredFiles = [
  "dist/index.html",
  "firebase.json",
  ".firebaserc",
  "firestore.rules",
  ".env.example",
  "docs/01_CURRENT_DEVELOPMENT/RELEASE_CANDIDATE_CHECKLIST.md",
  "src/pages/Rulebook.jsx",
  "src/pages/PointsGuide.jsx",
  "src/pages/Seasons.jsx",
  "src/pages/Houses.jsx",
  "src/pages/Inbox.jsx",
  "src/pages/Analytics.jsx",
  "src/pages/PocketWeek.jsx",
  "src/services/seasons/seasonModel.js",
  "src/services/seasons/seasonService.js",
  "src/services/notifications/notificationService.js",
  "tests/rules-points-guide.test.mjs",
  "tests/season-systems.test.mjs",
  "tests/analytics.test.mjs",
  "tests/workspace-tabs.test.mjs",
  "src/components/common/WorkspaceTabs.jsx",
  "src/components/common/WorkspaceTabs.css",
  "src/services/ui/workspaceModel.js",
  "src/pages/Help.jsx",
  "src/pages/Help.css",
  "src/components/onboarding/OnboardingGate.jsx",
  "src/components/onboarding/OnboardingGate.css",
  "src/services/account/accountModel.js",
  "src/services/account/accountRequestService.js",
  "src/services/account/dataExportModel.js",
  "src/services/account/dataExportService.js",
  "src/services/account/onboardingService.js",
  "src/services/admin/accountRequestService.js",
  "src/components/admin/AccountDeletionRequests.jsx",
  "tests/account-foundations.test.mjs",
  "docs/02_GAME_DESIGN/ACCOUNT_AND_PRIVACY.md",
  "docs/03_ARCHITECTURE/decisions/ADR-024-guided-onboarding-and-trusted-account-requests.md",
  "src/services/auth/authService.js",
  "src/constants/evidence.js",
  "src/services/evidence/evidenceModel.js",
  "src/services/evidence/evidenceService.js",
  "src/components/seasons/EvidenceWorkspace.jsx",
  "src/components/seasons/EvidenceWorkspace.css",
  "tests/evidence-system.test.mjs",
  "docs/02_GAME_DESIGN/EVIDENCE_AND_PUBLISHED_STANDINGS.md",
  "docs/03_ARCHITECTURE/decisions/ADR-025-external-evidence-and-published-standings.md",
  "docs/01_CURRENT_DEVELOPMENT/SOURCE_AUDIT_V0180.md",
  "scripts/finalise-release.mjs",
];
const forbiddenUpdaterArtifacts = [
  "payload",
  "APPLY_UPDATE.ps1",
  "FINALISE_RELEASE.ps1",
  "README_UPDATE.md",
  "src/src",
  "tests/tests",
  "docs/docs",
  "public/public",
  "scripts/scripts",
  "src/context/TeamProvider.jsx",
  "src/context/TeamContext.js",
  "src/hooks/useTeam.js",
  "src/constants/teams.js",
  "src/services/teams",
];
const failures = [];

function readJson(relativePath) {
  return JSON.parse(
    fs.readFileSync(path.join(projectRoot, relativePath), "utf8"),
  );
}

requiredFiles.forEach((relativePath) => {
  if (!fs.existsSync(path.join(projectRoot, relativePath))) {
    failures.push(`Required release file is missing: ${relativePath}`);
  }
});

forbiddenUpdaterArtifacts.forEach((relativePath) => {
  if (fs.existsSync(path.join(projectRoot, relativePath))) {
    failures.push(
      `Local updater artifact must remain outside the repository: ${relativePath}`,
    );
  }
});

if (failures.length === 0) {
  const packageData = readJson("package.json");
  const firebaseConfig = readJson("firebase.json");
  const firebaseAliases = readJson(".firebaserc");
  const defaultProject = firebaseAliases.projects?.default;
  const hostingSites =
    firebaseAliases.targets?.[defaultProject]?.hosting?.[
      EXPECTED_HOSTING_TARGET
    ] ?? [];

  if (packageData.version !== EXPECTED_VERSION) {
    failures.push(
      `Expected package version ${EXPECTED_VERSION}, found ${packageData.version}.`,
    );
  }

  if (firebaseConfig.hosting?.target !== EXPECTED_HOSTING_TARGET) {
    failures.push(
      `Firebase Hosting must target ${EXPECTED_HOSTING_TARGET}.`,
    );
  }

  if (!hostingSites.includes("champions-legacy-challenge")) {
    failures.push(
      "The app Hosting target is not mapped to champions-legacy-challenge.",
    );
  }

  if (packageData.scripts?.["finalise:release"] !== "node scripts/finalise-release.mjs") {
    failures.push("finalise:release must run the in-repository release finaliser.");
  }

  if (!packageData.scripts?.["deploy:hosting"]?.includes("hosting:app")) {
    failures.push("deploy:hosting must deploy only the branded app target.");
  }

  if (!packageData.scripts?.["deploy:production"]?.includes("hosting:app")) {
    failures.push("deploy:production must deploy the branded app target.");
  }

  const announcements = fs.readFileSync(
    path.join(projectRoot, "src/constants/announcements.js"),
    "utf8",
  );
  if (!announcements.includes(`version: "${EXPECTED_VERSION}"`)) {
    failures.push(`Bundled announcements do not include v${EXPECTED_VERSION}.`);
  }
}

if (failures.length > 0) {
  console.error("Release-readiness verification failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(
    `Release-readiness structure verified for v${EXPECTED_VERSION} on the branded Firebase Hosting target.`,
  );
}
