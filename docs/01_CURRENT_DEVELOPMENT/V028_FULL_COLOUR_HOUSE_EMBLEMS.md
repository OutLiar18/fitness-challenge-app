# Champions Legacy Challenge — v0.28.0 Full-Colour House Emblems

Checkpoint: 28D4C

## Owner direction

The monochrome/vector approach is intentionally retired for House identity. House
emblems should read as recognisable objects, creatures and symbols with their own
natural colour and material treatment.

## Implementation

- Ordinary application UI icons remain on Phosphor through `ThemeIcon`.
- House emblems are now a separate visual system using locally bundled Microsoft
  Fluent Emoji 3D PNG artwork.
- 56 stable House `emblemId` values remain unchanged.
- Each House emblem ID has one local PNG asset under `src/assets/house-emblems`.
- The image itself keeps its native colour; House palette colour moves to the
  surrounding crest/frame/halo rather than recolouring the artwork.
- Images use lazy loading and async decoding.
- Unknown IDs still fall back to the Springbok presentation.
- Microsoft Fluent Emoji source and MIT licence notices are stored beside the assets.

## Curated substitutions

The source pack does not provide every Champions Legacy concept as a literal image.
A small number therefore use the nearest coherent visual from the same pack, including:

- Springbok → Deer
- Leopard → Tiger face
- Phoenix → Fire
- Orca → Whale
- Mask → Performing arts
- Raven → Bird
- Kraken → Octopus
- Bull → Ox
- Stallion → Horse face

These are presentation-only mappings. Stored IDs and House rules do not change.

## Safety boundary

28D4C does not change:

- House identity IDs;
- House colour palettes;
- global theme state;
- season or House competition mechanics;
- scoring;
- C.H.A.O.S.;
- leadership or roster movement;
- Firestore Rules;
- Firebase deployment state.
