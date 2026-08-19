import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { HOUSE_EMBLEMS } from "../src/constants/seasons.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assetDir = path.join(root, "src", "assets", "house-emblems");
const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

test("28D4C bundles one valid full-colour PNG for every House emblem ID", () => {
  const ids = HOUSE_EMBLEMS.map((item) => item.id).sort();
  const pngs = fs
    .readdirSync(assetDir)
    .filter((name) => name.endsWith(".png"))
    .sort();

  assert.deepEqual(pngs, ids.map((id) => `${id}.png`));

  for (const fileName of pngs) {
    const full = path.join(assetDir, fileName);
    const data = fs.readFileSync(full);
    assert.ok(data.length > 1024, `${fileName} should contain real image data`);
    assert.ok(
      data.subarray(0, 8).equals(pngSignature),
      `${fileName} should be a PNG`,
    );
  }
});

test("28D4C keeps third-party source and licence notices beside the assets", () => {
  assert.ok(fs.existsSync(path.join(assetDir, "SOURCE.json")));
  assert.ok(
    fs.existsSync(path.join(assetDir, "LICENSE-MICROSOFT-FLUENT-EMOJI.txt")),
  );
});
