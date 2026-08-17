# Champions Legacy Challenge — Current Context

<!-- RELEASE_STATUS: VERIFIED_PRODUCTION -->
Current source: v0.28.0 development
Current production: v0.27.0
Last updated: 12 August 2026

v0.27.0 is the verified production baseline and is frozen. Exact deployed/tagged source is `701b58df40eedab39c8f7fe5d4b2ea95efd11ba5`; live/local `index.html` SHA-256 is `37d1dcf890f8836b17cfe128219fe8313ff0e15520d43547379cfe61007fac38`; Firestore Rules were not redeployed and remain SHA-256 `35d12a285436b420a13ec3cfaac0b9cd93a9c4a2a2d38735e92a7c0b950cef6e`.

v0.25.0 has four controlled work areas:
1. 25A — basic existing-app correctness fixes — complete;
2. 25B — 16-profile MBTI identity system with a 12-question rough-estimate flow and external 16Personalities link — complete;
3. 25C — safe Platform Administrator draft deletion/recovery semantics — complete;
4. 25D — League Season bonus points with Platform Administrator direct awards and Platform-reviewed League Administrator requests — complete.

Five Fires and Buddy Bonuses remain removed from the roadmap. Broad v0.27 visual polish is complete through 27F; 27G is the dedicated multi-viewport, keyboard, screen-reader, theme, reduced-motion and state acceptance stage. Manual review plus direct source audit exposed five bounded acceptance defects: the palette felt too muted, the Dashboard Welcome Card retained legacy blue styling, same-page URL-backed tab changes incorrectly reset page scroll, the authentication hero still used the retired blue brand gradient, and Daily Progress still faded from red into legacy blue. All five findings were remediated and the authenticated visual recheck was accepted on 11 August 2026. 27G and 27R are complete. Hosting preview/live integrity verification passed, the authenticated production smoke was accepted on 12 August 2026, and v0.27.0 is now the verified production baseline.

v0.28 is now the owner-led page inspection and change pass. The earlier 28A rehearsal planning work remains useful, but the actual complete season rehearsal is deferred to v0.30.0 so it does not get invalidated by ongoing product changes. The active v0.28 working checklist is `V028_PAGE_INSPECTION_PLAN.md`; v0.29.0 is reserved for friend/external feedback changes, v0.30.0 for the full season rehearsal, and v0.31.0 for cleanup/polish/hardening after rehearsal.

28C captures the first owner inspection findings and intentionally pauses further review after Global/Home/Navigation/Log Activity/Progress. The detailed requirements are in `V028_INSPECTION_FINDINGS.md`. Implementation is split into 28D1 (shared interactions + Home + Navigation + Log Activity) and 28D2 (Progress cleanup + achievements + long-term XP/levels) before the remaining page inspection resumes. Final logo/favicon artwork remains deferred.