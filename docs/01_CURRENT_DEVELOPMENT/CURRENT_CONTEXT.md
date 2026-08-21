# Champions Legacy Challenge — Current Context

## Focus

Perform a broad v0.29 source-cleanup and visual-polish pass while preserving accepted product behavior.

Priorities:

1. Remove generated/local debris and proven dead source.
2. Remove obsolete release/checkpoint machinery.
3. Keep tests that protect current behavior; remove or modernize release-specific harnesses that no longer match the workflow.
4. Keep `01_CURRENT_DEVELOPMENT` genuinely current instead of using it as an archive.
5. Consolidate CSS where practical and prefer shared theme tokens over page-specific hard-coded accents.
6. Improve small-screen spacing, wrapping, touch targets and overflow resilience.
7. Make MBTI theme palettes more visible through headings, links, section kickers, surfaces and controlled accent glows while retaining semantic success/warning/danger colours.

## Release-process simplification

External tester rounds and a full season rehearsal are no longer mandatory pre-v1.0 gates. Automated checks/builds remain useful safeguards at meaningful change points, but process should stay proportional to risk.

## Safety

Do not deploy during ordinary cleanup. Do not change Firestore Rules as part of CSS/documentation maintenance. Do not alter scoring, evidence authority or league mechanics unless explicitly requested.
