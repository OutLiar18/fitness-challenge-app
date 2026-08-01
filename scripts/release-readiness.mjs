import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const requiredFiles = [
  "dist/index.html",
  "firebase.json",
  "firestore.rules",
  ".env.example",
  "docs/01_CURRENT_DEVELOPMENT/RELEASE_CANDIDATE_CHECKLIST.md",
];

const missingFiles = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(projectRoot, file)),
);

if (missingFiles.length > 0) {
  console.error("Release-readiness files are missing:");
  missingFiles.forEach((file) => console.error(`- ${file}`));
  process.exitCode = 1;
} else {
  const packageData = JSON.parse(
    fs.readFileSync(path.join(projectRoot, "package.json"), "utf8"),
  );

  if (packageData.version !== "0.11.0") {
    console.error(`Expected package version 0.11.0, found ${packageData.version}.`);
    process.exitCode = 1;
  } else {
    console.log("Release-readiness structure verified for v0.11.0.");
  }
}
