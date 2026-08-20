# Champions Legacy Challenge — v0.28 Profile & Legacy Identity

Checkpoint: 28D13
Status: Implemented; owner visual review pending

## Purpose

28D13 completes the final page implementation pass in the v0.28 owner-led inspection by turning Profile into a stronger player-identity experience while preserving the existing profile, scoring, security and competition contracts.

## Identity model

The persisted identity field remains the optional four-letter `mbtiType`. No new Firestore fields are required.

Each of the 16 local Legacy Profile definitions now contains:

- the official current 16Personalities role title (for example Architect, Logistician, Commander or Entertainer);
- a distinct Champions Legacy mythic identity;
- a defining quality;
- a two-colour identity palette;
- core personality wording;
- mythic symbolism;
- strengths;
- watch-outs;
- Challenge-specific approaches;
- growth advice;
- an “at your best” description;
- an archetypal line;
- a motivation-style hint reserved for the next personalisation checkpoint.

The content remains reflective guidance. It is not a diagnosis, compatibility prediction or deterministic statement about a player.

## Mythic identities

- INTJ — Obsidian Dragon
- INTP — Astral Sphinx
- ENTJ — Crimson Griffin
- ENTP — Prismatic Kitsune
- INFJ — Eclipsed Oracle
- INFP — Ethereal World Tree
- ENFJ — Solar Phoenix
- ENFP — Aurora Pegasus
- ISTJ — Ironbound Citadel
- ISFJ — Amber Aegis
- ESTJ — Scarlet War Marshal
- ESFJ — Harvest-Crowned Demeter
- ISTP — Runeforged Titan Hammer
- ISFP — Moonveil Stag
- ESTP — Stormforged Gungnir
- ESFP — Carnival-Crowned Dionysus

## Emblem system

The previous emoji + four-letter MBTI avatar treatment is retired.

Each Legacy Profile has one locally bundled, full-colour SVG emblem. The four-letter type remains readable application metadata beside the emblem but is not drawn into the emblem artwork.

The source silhouettes are modified Game-icons.net assets used under CC BY 3.0. Attribution and modification notes are stored beside the assets in `src/assets/mbti/THIRD_PARTY_NOTICES.md`.

Ordinary Profile UI chrome uses the existing Phosphor-backed `ThemeIcon` system. Identity artwork remains separate from ordinary UI iconography, matching the House-emblem architecture.

## Profile presentation

Profile now prioritises the selected mythic identity in the hero and expands reflective guidance into:

- core personality;
- mythic symbolism;
- natural advantages;
- watch-outs;
- Challenge approaches;
- type-sensitive growth advice;
- “at your best” framing;
- archetypal identity;
- existing complementary-profile conversation starters.

The selector shows the mythic identity first and the MBTI code + official role title as supporting metadata.

The 12-question quick estimate and external 16Personalities route remain available and continue to require the player to make the final choice.

## Preserved boundaries

28D13 does not change:

- Firestore Rules;
- the stored `mbtiType` contract;
- scoring;
- XP or achievements;
- season or House membership;
- evidence;
- trusted roles or permissions;
- competitive history;
- profile URL-backed tabs;
- profile save validation;
- focused error handling;
- saving/`aria-busy` semantics.

## Deferred follow-up — 28D14

App-wide MBTI themes and genuinely type-aware Champion Transmission message banks are intentionally separated into 28D14.

That checkpoint will use the 16 identity palettes and motivation-style hints as configuration inputs while maintaining contrast/accessibility and keeping the system preference-based rather than deterministic.
