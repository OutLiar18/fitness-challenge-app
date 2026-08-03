import fs from "node:fs";
import path from "node:path";

const EXPECTED_VERSION = "0.14.0";
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
  "src/pages/Leagues.jsx",
  "src/pages/Teams.jsx",
  "src/pages/PocketWeek.jsx",
  "src/pages/Notifications.jsx",
  "src/services/seasons/seasonModel.js",
  "src/services/seasons/seasonService.js",
  "src/services/notifications/notificationService.js",
  "tests/rules-points-guide.test.mjs",
  "tests/season-systems.test.mjs",
];
const forbiddenUpdaterArtifacts = [
  "payload",
  "APPLY_UPDATE.ps1",
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
