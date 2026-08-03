import assert from "node:assert/strict";
import test from "node:test";

import {
  getAdjacentWorkspaceTabId,
  resolveWorkspaceTab,
} from "../src/services/ui/workspaceModel.js";

const TABS = Object.freeze([
  { id: "overview", label: "Overview" },
  { id: "records", label: "Records" },
  { id: "timeline", label: "Timeline" },
]);

test("workspace tabs preserve valid choices and fall back to the first section", () => {
  assert.equal(resolveWorkspaceTab(TABS, "records")?.id, "records");
  assert.equal(resolveWorkspaceTab(TABS, "missing")?.id, "overview");
  assert.equal(resolveWorkspaceTab([], "overview"), null);
});

test("workspace tab keyboard movement wraps and supports Home and End", () => {
  assert.equal(getAdjacentWorkspaceTabId(TABS, "overview", "ArrowLeft"), "timeline");
  assert.equal(getAdjacentWorkspaceTabId(TABS, "timeline", "ArrowRight"), "overview");
  assert.equal(getAdjacentWorkspaceTabId(TABS, "records", "Home"), "overview");
  assert.equal(getAdjacentWorkspaceTabId(TABS, "records", "End"), "timeline");
  assert.equal(getAdjacentWorkspaceTabId(TABS, "records", "Enter"), "records");
});
