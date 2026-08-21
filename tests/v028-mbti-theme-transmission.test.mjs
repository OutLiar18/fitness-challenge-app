import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import { MBTI_TYPES, getMbtiProfileByType } from "../src/constants/mbtiProfiles.js";
import {
  MBTI_THEME_PALETTES,
  getMbtiThemeByType,
} from "../src/constants/mbtiThemes.js";
import {
  MBTI_TRANSMISSIONS,
  getMbtiTransmissionLibrary,
} from "../src/constants/mbtiTransmissions.js";
import {
  getDailyMotivation,
  getMotivationCount,
} from "../src/constants/motivation.js";

const read = (relative) =>
  fs.readFileSync(new URL(`../${relative}`, import.meta.url), "utf8");

const HEX = /^#[0-9a-f]{6}$/i;

function channelToLinear(value) {
  const channel = value / 255;
  return channel <= 0.04045
    ? channel / 12.92
    : ((channel + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const value = hex.slice(1);
  const red = channelToLinear(Number.parseInt(value.slice(0, 2), 16));
  const green = channelToLinear(Number.parseInt(value.slice(2, 4), 16));
  const blue = channelToLinear(Number.parseInt(value.slice(4, 6), 16));
  return (0.2126 * red) + (0.7152 * green) + (0.0722 * blue);
}

function contrast(first, second) {
  const firstLum = luminance(first);
  const secondLum = luminance(second);
  const lighter = Math.max(firstLum, secondLum);
  const darker = Math.min(firstLum, secondLum);
  return (lighter + 0.05) / (darker + 0.05);
}

test("28D14 defines one unique global presentation palette per MBTI type", () => {
  assert.equal(MBTI_THEME_PALETTES.length, 16);
  assert.deepEqual(
    [...MBTI_THEME_PALETTES.map((theme) => theme.type)].sort(),
    [...MBTI_TYPES].sort(),
  );
  assert.equal(new Set(MBTI_THEME_PALETTES.map((theme) => theme.label)).size, 16);
  assert.equal(
    new Set(
      MBTI_THEME_PALETTES.map((theme) =>
        [theme.primaryControl, theme.primaryBright, theme.secondary, theme.secondaryBright].join(":"),
      ),
    ).size,
    16,
  );
  assert.equal(
    MBTI_THEME_PALETTES.every((theme) =>
      [theme.primaryControl, theme.primaryBright, theme.secondary, theme.secondaryBright]
        .every((value) => HEX.test(value)),
    ),
    true,
  );
});

test("28D14 keeps every MBTI primary control and dark accent contrast-safe", () => {
  for (const theme of MBTI_THEME_PALETTES) {
    assert.ok(
      contrast(theme.primaryControl, "#ffffff") >= 4.5,
      `${theme.type} primary control must keep white text readable`,
    );
    assert.ok(
      contrast(theme.primaryBright, "#151517") >= 4.5,
      `${theme.type} dark accent must remain readable on raised dark surfaces`,
    );
  }
});

test("28D14 normalises theme lookup without changing the persisted MBTI contract", () => {
  assert.equal(getMbtiThemeByType(" intj ")?.type, "INTJ");
  assert.equal(getMbtiThemeByType("unknown"), null);
  const profile = getMbtiProfileByType("INTJ");
  assert.equal(profile?.mbtiType, undefined);
  assert.equal(profile?.type, "INTJ");
});

test("28D14 gives every MBTI four distinct Champion Transmission messages", () => {
  assert.deepEqual(
    Object.keys(MBTI_TRANSMISSIONS).sort(),
    [...MBTI_TYPES].sort(),
  );
  assert.equal(
    MBTI_TYPES.every((type) => getMbtiTransmissionLibrary(type).length === 4),
    true,
  );
  const quotes = MBTI_TYPES.flatMap((type) =>
    getMbtiTransmissionLibrary(type).map((entry) => entry.quote),
  );
  assert.equal(quotes.length, 64);
  assert.equal(new Set(quotes).size, 64);
  assert.equal(
    MBTI_TYPES.every((type) =>
      getMbtiTransmissionLibrary(type).every(
        (entry) => entry.quote.length >= 45 && entry.coachNote.length >= 20,
      ),
    ),
    true,
  );
});

test("28D14 makes Champion Transmission deterministic and genuinely profile-specific", () => {
  const date = new Date("2026-08-20T12:00:00");
  const first = getDailyMotivation(date, "player-28d14", 0, "INTJ");
  const repeat = getDailyMotivation(date, "player-28d14", 0, "INTJ");
  const next = getDailyMotivation(date, "player-28d14", 1, "INTJ");
  const profile = getMbtiProfileByType("INTJ");
  const library = getMbtiTransmissionLibrary("INTJ");

  assert.deepEqual(first, repeat);
  assert.ok(library.some((entry) => entry.quote === first.quote));
  assert.ok(profile.thrive.includes(first.sideQuest));
  assert.equal(first.profileTitle, "Architect");
  assert.equal(first.mythicName, "Obsidian Dragon");
  assert.equal(first.definingQuality, "Mastery");
  assert.equal(first.total, 4);
  assert.equal(getMotivationCount("INTJ"), 4);
  assert.notEqual(first.quote, next.quote);
});

test("28D14 preserves the neutral transmission fallback for players without MBTI", () => {
  const general = getDailyMotivation(
    new Date("2026-08-20T12:00:00"),
    "player-28d14",
    0,
    "",
  );

  assert.equal(general.profileType, "");
  assert.equal(general.profileTitle, "");
  assert.equal(general.mythicName, "");
  assert.ok(getMotivationCount() >= 20);
  assert.ok(general.sideQuest.length > 0);
});

test("28D14 mounts one global MBTI theme bridge and keeps semantic status colours outside it", () => {
  const protectedApp = read("src/routes/ProtectedApp.jsx");
  const bridge = read("src/components/common/MbtiThemeBridge.jsx");
  const styles = read("src/index.css");
  const marker = styles.indexOf(":root[data-mbti-theme]");

  assert.match(protectedApp, /<PlayerDataProvider>[\s\S]*<MbtiThemeBridge \/>[\s\S]*<GlobalLibraryProvider>/);
  assert.match(bridge, /document\.documentElement/);
  assert.match(bridge, /root\.dataset\.mbtiTheme = theme\.type/);
  assert.ok(marker >= 0);
  const themedStyles = styles.slice(marker);
  assert.match(themedStyles, /:root\[data-mbti-theme\]/);
  assert.match(themedStyles, /--primary-control: var\(--mbti-primary-control\)/);
  assert.match(themedStyles, /--accent: var\(--mbti-secondary\)/);
  assert.doesNotMatch(themedStyles, /--danger:/);
  assert.doesNotMatch(themedStyles, /--success:/);
  assert.doesNotMatch(themedStyles, /--warning:/);
});

test("28D14 makes the Dashboard hero visibly theme-aware and labels the tailored transmission", () => {
  const card = read("src/components/dashboard/WelcomeCard.jsx");
  const css = read("src/components/dashboard/WelcomeCard.css");

  assert.match(card, /motivation\.profileTitle/);
  assert.match(card, /motivation\.mythicName/);
  assert.match(card, /<ThemeIcon name="power" size=\{16\} \/>/);
  assert.doesNotMatch(card, /⚡/);
  assert.match(css, /--mbti-primary-bright/);
  assert.match(css, /--mbti-secondary-bright/);
  assert.match(css, /var\(--primary-control\)/);
  assert.doesNotMatch(css, /#c20e0d/);
});
