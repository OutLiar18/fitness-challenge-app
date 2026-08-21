import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const testsDir = path.join(root, "tests");

const testFiles = fs
  .readdirSync(testsDir, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith(".test.mjs"))
  .map((entry) => `tests/${entry.name}`)
  .filter((relativePath) => relativePath !== "tests/firestore.rules.test.mjs")
  .sort();

if (testFiles.length === 0) {
  throw new Error("No application test files were discovered.");
}

const result = spawnSync(
  process.execPath,
  ["--import=./scripts/register-loader.mjs", "--test", ...testFiles],
  {
    cwd: root,
    stdio: "inherit",
    windowsHide: true,
  },
);

if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
