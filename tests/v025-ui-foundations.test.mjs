import assert from "node:assert/strict";
import test from "node:test";

import { CORE_NAV_ITEMS, getNavigationItemByPath } from "../src/constants/navigation.js";
import { getMotivationCount } from "../src/constants/motivation.js";

test("Log Activity uses its green tone only through active navigation state", () => {
  const logItem = CORE_NAV_ITEMS.find((item) => item.id === "log");
  assert.ok(logItem);
  assert.equal(logItem.tone, "green");
  assert.equal(logItem.accent, undefined);
  assert.equal(getNavigationItemByPath("/log")?.id, "log");
  assert.equal(getNavigationItemByPath("/dashboard")?.id, "dashboard");
});

test("Champion Transmission has an expanded motivation library", () => {
  assert.ok(getMotivationCount() >= 24);
});
