import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { MBTI_PROFILES } from "../src/constants/mbtiProfiles.js";

const ROOT = process.cwd();
const read = (relative) => fs.readFileSync(path.join(ROOT, relative), "utf8");

const OFFICIAL_TITLES = Object.freeze({
  INTJ: "Architect",
  INTP: "Logician",
  ENTJ: "Commander",
  ENTP: "Debater",
  INFJ: "Advocate",
  INFP: "Mediator",
  ENFJ: "Protagonist",
  ENFP: "Campaigner",
  ISTJ: "Logistician",
  ISFJ: "Defender",
  ESTJ: "Executive",
  ESFJ: "Consul",
  ISTP: "Virtuoso",
  ISFP: "Adventurer",
  ESTP: "Entrepreneur",
  ESFP: "Entertainer",
});

const MYTHIC_IDENTITIES = Object.freeze({
  INTJ: "Obsidian Dragon",
  INTP: "Astral Sphinx",
  ENTJ: "Crimson Griffin",
  ENTP: "Prismatic Kitsune",
  INFJ: "Eclipsed Oracle",
  INFP: "Ethereal World Tree",
  ENFJ: "Solar Phoenix",
  ENFP: "Aurora Pegasus",
  ISTJ: "Ironbound Citadel",
  ISFJ: "Amber Aegis",
  ESTJ: "Scarlet War Marshal",
  ESFJ: "Harvest-Crowned Demeter",
  ISTP: "Runeforged Titan Hammer",
  ISFP: "Moonveil Stag",
  ESTP: "Stormforged Gungnir",
  ESFP: "Carnival-Crowned Dionysus",
});

test("28D13 uses all 16 official 16Personalities role titles", () => {
  assert.equal(MBTI_PROFILES.length, 16);
  for (const profile of MBTI_PROFILES) {
    assert.equal(profile.title, OFFICIAL_TITLES[profile.type]);
  }
});

test("28D13 uses the accepted unique Champions Legacy mythic identities", () => {
  const mythicNames = MBTI_PROFILES.map((profile) => profile.mythicName);
  assert.equal(new Set(mythicNames).size, 16);
  for (const profile of MBTI_PROFILES) {
    assert.equal(profile.mythicName, MYTHIC_IDENTITIES[profile.type]);
  }
});

test("28D13 gives every Legacy Profile substantial reflective guidance", () => {
  for (const profile of MBTI_PROFILES) {
    assert.ok(profile.definingQuality.length > 2);
    assert.ok(profile.corePersonality.length > 35);
    assert.ok(profile.symbolism.length > 70);
    assert.ok(profile.strengths.length >= 6);
    assert.ok(profile.watchouts.length >= 4);
    assert.ok(profile.thrive.length >= 3);
    assert.ok(profile.growthAdvice.length > 50);
    assert.ok(profile.atBest.length > 40);
    assert.ok(profile.archetype.length > 25);
    assert.ok(profile.motivationStyle.length > 45);
  }
});

test("28D13 bundles one coloured app-owned emblem SVG per MBTI without letter artwork", () => {
  const assetDir = path.join(ROOT, "src/assets/mbti");
  for (const type of Object.keys(OFFICIAL_TITLES)) {
    const svg = fs.readFileSync(path.join(assetDir, `${type.toLowerCase()}.svg`), "utf8");
    assert.match(svg, /viewBox="0 0 512 512"/);
    assert.match(svg, /linearGradient/);
    assert.doesNotMatch(svg, /<text\b/i);
    assert.doesNotMatch(svg, new RegExp(`>${type}<`, "i"));
  }
  assert.ok(fs.existsSync(path.join(assetDir, "THIRD_PARTY_NOTICES.md")));
});

test("28D13 renders MBTI identity through image emblems instead of emoji or four-letter badges", () => {
  const avatar = read("src/components/profile/MbtiProfileAvatar.jsx");
  const avatarCss = read("src/components/profile/MbtiProfileAvatar.css");
  assert.match(avatar, /getMbtiEmblem/);
  assert.match(avatar, /<img src=\{emblem\}/);
  assert.doesNotMatch(avatar, /profile\.symbol/);
  assert.doesNotMatch(avatar, /mbti-avatar__type/);
  assert.doesNotMatch(avatarCss, /mbti-avatar__type/);
});

test("28D13 makes the selector identity-first while preserving both type-discovery routes", () => {
  const chooser = read("src/components/profile/MbtiProfileChooser.jsx");
  assert.match(chooser, /profile\.mythicName/);
  assert.match(chooser, /profile\.type.*profile\.title/s);
  assert.match(chooser, /12-question quick estimate/);
  assert.match(chooser, /16Personalities/);
  assert.match(chooser, /free-personality-test/);
});

test("28D13 makes Profile a mythic identity page and removes ordinary emoji chrome", () => {
  const profile = read("src/pages/Profile.jsx");
  assert.match(profile, /ThemeIcon/);
  assert.match(profile, /personality\.mythicName/);
  assert.match(profile, /personality\.symbolism/);
  assert.match(profile, /personality\.growthAdvice/);
  assert.match(profile, /personality\.atBest/);
  assert.doesNotMatch(profile, /🪪|⚡|🧭|🔐/u);
});

test("28D13 preserves Profile persistence, URL state and accessibility contracts", () => {
  const profile = read("src/pages/Profile.jsx");
  assert.match(profile, /useSearchParams/);
  assert.match(profile, /setSearchParams\(next, \{ replace: true \}\)/);
  assert.match(profile, /updateUserProfile\(user\.uid, result\.value\)/);
  assert.match(profile, /aria-busy=\{saving \|\| undefined\}/);
  assert.match(profile, /statusRef\.current\?\.focus\(\)/);
  assert.match(profile, /Personality is a lens, not a limit/);
});
