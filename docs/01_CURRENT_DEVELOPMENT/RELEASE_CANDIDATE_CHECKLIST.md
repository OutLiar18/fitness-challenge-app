# Champions Legacy Challenge — Release Candidate Checklist

Version: 0.13.1  
Purpose: Verify the official player-reference release without declaring v1.0

## Migration and automated verification

- [ ] Outstanding v0.12 league-capacity migration is complete when existing leagues are present.
- [ ] `npm install` completes.
- [ ] `npm run lint` passes.
- [ ] `npm test` passes 54 domain tests.
- [ ] `npm run build` succeeds.
- [ ] `npm run test:rules` passes 15 Emulator tests.
- [ ] `npm run check:release` confirms v0.13.1 and Hosting target `app`.
- [ ] `npm audit` is reviewed without forced breaking changes.

## Rulebook

- [ ] `/rules` is reachable through desktop and mobile More navigation.
- [ ] Current rules are shown by default.
- [ ] Search finds text and legacy rule numbers.
- [ ] Current, season and inactive filters are accurate.
- [ ] Accordions, jump links, expand all and collapse all are keyboard usable.
- [ ] Daily and weekly goals match the live goal configuration.
- [ ] Changed rules explain why the 2025 wording no longer applies.
- [ ] Inactive mechanics clearly state that they award no points.

## Points Guide

- [ ] `/points-guide` is reachable and cross-linked with the Rulebook.
- [ ] Water, Fruit, Reading, Skill, Cardio, Running, Steps and Workouts appear.
- [ ] Every table includes its zero-point range.
- [ ] Thresholds match the central scoring constants.
- [ ] Running qualification and Tier 3 Cardio contribution are accurate.
- [ ] Difficulty multipliers, goal bonuses and league-day score are accurate.
- [ ] Hidden streak/achievement progression rewards are omitted.

## Core regression

- [ ] Authentication, profiles and protected redirects work.
- [ ] Valid activity entries score correctly; malformed entries are rejected.
- [ ] Today/yesterday editability and local dates remain correct.
- [ ] Goals, progression, records and timeline agree.
- [ ] Announcements, moderation, audit history and library publication work.
- [ ] Teams, captain transfer, league registration/lifecycle and Legacy Coach work.
- [ ] Completed league history remains immutable.

## Accessibility and Hosting

- [ ] 320-pixel mobile, tablet and desktop layouts pass.
- [ ] Keyboard-only navigation, visible focus and reduced motion pass.
- [ ] Light and dark mode pass.
- [ ] Direct refreshes on `/rules` and `/points-guide` work.
- [ ] `npm run deploy:hosting` publishes to `champions-legacy-challenge.web.app`.
- [ ] No unexpected console errors remain.

## Review boundary

- [ ] User-requested corrections are recorded after verification.
- [ ] v1.0 remains unapproved until explicit confirmation.

Completing this checklist supports review; it does not create v1.0.
