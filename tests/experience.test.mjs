import assert from "node:assert/strict";
import test from "node:test";

import { getDailyMotivation, getMotivationCount } from "../src/constants/motivation.js";
import {
  ADMIN_NAV_ITEM,
  MOBILE_NAV_ITEMS,
  PRIMARY_NAV_ITEMS,
  REFERENCE_NAV_ITEMS,
  SECONDARY_NAV_ITEMS,
  getNavigationItemByPath,
} from "../src/constants/navigation.js";

test("Navigation paths and identifiers remain unique", () => {
  const items = [
    ...PRIMARY_NAV_ITEMS,
    ...SECONDARY_NAV_ITEMS,
    ...REFERENCE_NAV_ITEMS,
    ADMIN_NAV_ITEM,
  ];
  const ids = items.map((item) => item.id);
  const paths = items.map((item) => item.to);

  assert.equal(new Set(ids).size, ids.length);
  assert.equal(new Set(paths).size, paths.length);
  assert.equal(getNavigationItemByPath("/log?category=water")?.id, "log");
  assert.equal(getNavigationItemByPath("/progress")?.id, "progress");
  assert.equal(getNavigationItemByPath("/houses")?.id, "houses");
  assert.equal(getNavigationItemByPath("/seasons")?.id, "seasons");
  assert.equal(getNavigationItemByPath("/inbox")?.id, "inbox");
  assert.equal(getNavigationItemByPath("/analytics")?.id, "analytics");
});

test("Mobile navigation is a focused subset of primary navigation", () => {
  const primaryIds = new Set(PRIMARY_NAV_ITEMS.map((item) => item.id));

  assert.equal(MOBILE_NAV_ITEMS.length, 4);
  assert.ok(MOBILE_NAV_ITEMS.every((item) => primaryIds.has(item.id)));
  assert.ok(MOBILE_NAV_ITEMS.some((item) => item.id === "log"));
  assert.ok(MOBILE_NAV_ITEMS.some((item) => item.id === "inbox"));
  assert.equal(MOBILE_NAV_ITEMS.some((item) => item.id === "profile"), false);
});

test("Competition, communications and reflection destinations remain clear", () => {
  const focusedItems = [...PRIMARY_NAV_ITEMS, ...SECONDARY_NAV_ITEMS];
  focusedItems.forEach((item) => {
    assert.ok(item.label);
    assert.ok(item.description.length >= 20);
    assert.ok(item.to.startsWith("/"));
  });

  assert.ok(focusedItems.some((item) => item.id === "seasons"));
  assert.ok(focusedItems.some((item) => item.id === "houses"));
  assert.ok(focusedItems.some((item) => item.id === "inbox"));
  assert.ok(focusedItems.some((item) => item.id === "analytics"));
  assert.ok(focusedItems.some((item) => item.id === "pocket"));
});

test("Daily motivation is deterministic and can be shuffled", () => {
  const date = new Date(2026, 7, 1, 12);
  const first = getDailyMotivation(date, "player-1", 0);
  const repeated = getDailyMotivation(date, "player-1", 0);
  const shuffled = getDailyMotivation(date, "player-1", 1);

  assert.deepEqual(first, repeated);
  assert.equal(getMotivationCount() >= 8, true);
  assert.notEqual(first.index, shuffled.index);
});
