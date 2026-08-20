# Champions Legacy Challenge — Current Context

<!-- RELEASE_STATUS: VERIFIED_PRODUCTION -->
Current source: v0.28.0 development
Current production: v0.27.0
Last updated: 18 August 2026

v0.27.0 is the verified production baseline and is frozen. Exact deployed/tagged source is `701b58df40eedab39c8f7fe5d4b2ea95efd11ba5`; live/local `index.html` SHA-256 is `37d1dcf890f8836b17cfe128219fe8313ff0e15520d43547379cfe61007fac38`; Firestore Rules were not redeployed and remain SHA-256 `35d12a285436b420a13ec3cfaac0b9cd93a9c4a2a2d38735e92a7c0b950cef6e`.

v0.25.0 has four controlled work areas:
1. 25A — basic existing-app correctness fixes — complete;
2. 25B — 16-profile MBTI identity system with a 12-question rough-estimate flow and external 16Personalities link — complete;
3. 25C — safe Platform Administrator draft deletion/recovery semantics — complete;
4. 25D — League Season bonus points with Platform Administrator direct awards and Platform-reviewed League Administrator requests — complete.

Five Fires and Buddy Bonuses remain removed from the roadmap. Broad v0.27 visual polish is complete through 27F; 27G is the dedicated multi-viewport, keyboard, screen-reader, theme, reduced-motion and state acceptance stage. Manual review plus direct source audit exposed five bounded acceptance defects: the palette felt too muted, the Dashboard Welcome Card retained legacy blue styling, same-page URL-backed tab changes incorrectly reset page scroll, the authentication hero still used the retired blue brand gradient, and Daily Progress still faded from red into legacy blue. All five findings were remediated and the authenticated visual recheck was accepted on 11 August 2026. 27G and 27R are complete. Hosting preview/live integrity verification passed, the authenticated production smoke was accepted on 12 August 2026, and v0.27.0 is now the verified production baseline.

v0.28 is now the owner-led page inspection and change pass. The earlier 28A rehearsal planning work remains useful, but the actual complete season rehearsal is deferred to v0.30.0 so it does not get invalidated by ongoing product changes. The active v0.28 working checklist is `V028_PAGE_INSPECTION_PLAN.md`; v0.29.0 is reserved for friend/external feedback changes, v0.30.0 for the full season rehearsal, and v0.31.0 for cleanup/polish/hardening after rehearsal.

28C captures the first owner inspection findings and intentionally pauses further review after Global/Home/Navigation/Log Activity/Progress. The detailed requirements are in `V028_INSPECTION_FINDINGS.md`. Implementation is split into 28D1 (shared interactions + Home + Navigation + Log Activity) and 28D2 (Progress cleanup + achievements + long-term XP/levels) before the remaining page inspection resumes. Final logo/favicon artwork remains deferred.

28D1 is implemented and its Log Activity owner refinement is accepted. 28D2 plus 28D2A/28D2B is also owner-accepted: Progress now has the expanded 86-achievement system, long-term level curve, hidden cap, unlocked-title journey and responsive current-level ring. 28D3 applies the remaining source-review polish across Dashboard, Navigation, Log Activity and Progress, and completes the first Seasons implementation pass with competition-focused wording, cleaner workspace chrome, a richer Season roster, role-aware season context and player-facing rule cleanup. Broad layered-CSS consolidation stays deferred to v0.31.0. Firestore Rules remain unchanged; no production deployment. If 28D3 visual review is accepted, the remaining page inspection continues with Houses.

## 28D3A Seasons workspace cleanup
28D3 remains technically complete and pushed, but the deeper Seasons owner review reopened the page after a real draft season was created. 28D3A restructures Browse and every created-season workspace for clearer hierarchy while preserving all competition logic and Firestore Rules. Seasons must receive explicit owner acceptance before the v0.28 inspection continues to Houses.

## 28D4 Houses identity and workspace polish
Seasons is owner-accepted at 28D3A with minor desktop spacing deferred to v0.31. 28D4 applies the high-value Houses pass: a 24-palette House-only theme system, 56 emblems, stronger current-House identity, concise workspace tabs, deliberate icons and spacing/responsive cleanup. House mechanics and Firestore Rules are unchanged. After a fast owner visual check, continue directly to Inbox to maintain the accelerated v0.28 page-inspection pace.

## 28D4A portable House emblems
The 28D4 owner check exposed operating-system-dependent emoji rendering in the 56-item House emblem library. 28D4A keeps all stored emblem IDs but replaces visible emoji with app-owned currentColor inline SVG artwork for every configured emblem. After a fast all-emblems visual check, accept Houses and continue to Inbox.

## 28D4B professional icon system
After the owner rejected the temporary hand-drawn House emblems, 28D4B standardises the application on Phosphor React 2.1.10. ThemeIcon now uses professional pack icons across existing UI callers, and all 56 House emblem IDs map to curated duotone Phosphor symbols while retaining House-local currentColor theming. After a fast visual scan, close Houses and move directly to Inbox.

## 28D4C full-colour House emblems
Owner review rejected monochrome House emblems. House identity is now deliberately separated from ordinary UI iconography: Phosphor remains for standard application controls, while all 56 House emblem IDs use locally bundled Microsoft Fluent Emoji 3D PNG artwork in natural colour. House palette colour is retained on the emblem frame/halo rather than recolouring the image. After a fast visual check, close Houses and move directly to Inbox.

## 28D5 Inbox focus
Houses is owner-accepted after 28D4C. 28D5 is the next accelerated page-inspection pass: Inbox retains its existing URL-backed Updates/Private behaviour, read state and Platform bonus-review queue, while duplicate summary chrome and remaining emoji presentation are removed. Shared ThemeIcon presentation, concise read actions and clearer private links make the page faster to scan. After owner review, continue directly to Analytics.

## 28D6 Analytics focus
Inbox is owner-accepted after 28D5. 28D6 keeps the existing analytics model and accessible URL-backed workspaces intact while cleaning the page hierarchy: professional ThemeIcon chrome replaces page-level emoji, the redundant Progress return action is removed, tab labels are tightened, and Trends shows either recovery or chart content rather than both when the range is empty. After owner review, continue directly to Pocket Week.

## 28D7 Pocket Week focus
Analytics is owner-accepted after 28D6. 28D7 keeps the Pocket domain and URL-backed presentation state intact while tightening the page: shared ThemeIcon presentation replaces ordinary emoji/text glyphs, labels are shorter, the unrelated Houses action and zebra easter egg are removed, and the three integrity principles become easier to scan. After owner review, continue directly to Legacy Coach.

## 28D8 Legacy Coach focus
Pocket Week is owner-accepted after 28D7. 28D8 keeps Legacy Coach optional, factual and explainable while aligning its page-level presentation with the shared ThemeIcon system, shortening workspace descriptions and correcting singular/plural recommendation count copy. Recommendation logic, seven-day comparisons, preferences and scoring remain unchanged. After owner review, continue directly to Challenge Rulebook.

## 28D9 Challenge Rulebook reconciliation
Legacy Coach is owner-accepted after 28D8, with minor padding deferred to v0.31. 28D9 is a full mechanics reconciliation rather than a cosmetic-only Rulebook pass. It numbers rules hierarchically, removes migration/provenance commentary, restores the requested Prison Zebra cheating consequence, aligns evidence/season scoring/bonus/roster-rest wording with the implemented app, removes unsupported learning exceptions and false inactive-photo-bonus wording, and slightly tightens long-form presentation without shrinking touch controls. After owner review, continue directly to Points Guide.
