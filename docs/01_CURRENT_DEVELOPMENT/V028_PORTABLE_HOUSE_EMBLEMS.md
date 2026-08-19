# Champions Legacy Challenge — v0.28.0 Portable House Emblems

Checkpoint: 28D4A

## Problem

28D4 expanded the House emblem library to 56 identities but still used operating-system
emoji glyphs as the visible artwork. Emoji coverage and presentation vary by operating
system/font version, and dark glyphs can lose contrast on the application's dark House
surfaces.

## Resolution

28D4A keeps every existing House `emblemId` unchanged but moves presentation to a
new app-owned `HouseEmblem` component.

All 56 configured House identities now have deterministic inline SVG line artwork:

- the app no longer depends on Windows, browser or emoji-font glyph coverage;
- emblems use `currentColor` and therefore inherit the selected House palette;
- existing Firestore House documents require no migration;
- unknown/legacy IDs safely fall back to Springbok presentation;
- SVGs are decorative by default but support an accessible labelled mode;
- the legacy `symbol` metadata remains temporarily in the configuration for compatibility
  but is no longer rendered in Houses.

No competition mechanics, House rules, scoring, season lifecycle or Firestore Rules
change in 28D4A.
