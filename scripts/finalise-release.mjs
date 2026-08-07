import fs from "node:fs";
import path from "node:path";

const VERSION = "0.23.5";
const PREVIOUS_PRODUCTION = "0.23.0";
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
  "docs/01_CURRENT_DEVELOPMENT/CURRENT_STATE.md",
  "docs/01_CURRENT_DEVELOPMENT/NEXT_SESSION.md",
  "docs/01_CURRENT_DEVELOPMENT/ROADMAP.md",
  "docs/01_CURRENT_DEVELOPMENT/RELEASE_CANDIDATE_CHECKLIST.md",
  "docs/01_CURRENT_DEVELOPMENT/SOURCE_AUDIT_V0235.md",
  "docs/07_HISTORY/CHANGELOG.md",
  "docs/07_HISTORY/RELEASE_NOTES.md",
  "docs/07_HISTORY/VERSION_HISTORY.md",
].map((relativePath) => path.join(root, relativePath));

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.error(`Required finalisation file is missing: ${path.relative(root, file)}`);
    process.exit(1);
  }
}

let changed = 0;
for (const file of files) {
  let text = fs.readFileSync(file, "utf8");
  const before = text;
  text = text.split(candidateMarker).join(deployedMarker);
  text = text.split("Production version: **0.23.0**").join("Production version: **0.23.5**");
  text = text.split("Production version: 0.23.0").join("Production version: 0.23.5");
  text = text.split("Current production: v0.23.0").join("Current production: v0.23.5");
  text = text.split("Current production: **v0.23.0**").join("Current production: **v0.23.5**");
  text = text.split("production deployment pending").join("verified production deployment complete");
  text = text.split("Production deployment pending").join("Verified production deployment complete");
  text = text.split("Stability release candidate; production deployment pending; pre-v1.0").join("Stability release verified and deployed; pre-v1.0");
  text = text.split("Stable v0.23 security/runtime checkpoint; candidate").join("Stable v0.23 security/runtime checkpoint; verified production deployment");
  if (text !== before) {
    fs.writeFileSync(file, text, "utf8");
    changed += 1;
  }
}

console.log(`Finalised v${VERSION} stabilization documentation in ${changed} files.`);
console.log(`Production advanced from v${PREVIOUS_PRODUCTION} to v${VERSION}. Keep the deferred v0.24 House Movement work out of this branch.`);
