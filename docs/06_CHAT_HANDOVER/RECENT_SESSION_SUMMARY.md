# Recent Session Summary — v0.23.0

<!-- RELEASE_STATUS: DEPLOYED -->
Date: 5 August 2026

The user approved the full Power Play policy and added two non-negotiable rules:

1. Every name must be unique and written for that season's theme.
2. Once selected, a Power Play may not be used again for the remainder of the season.

The candidate now provides ten base category plays, controlled custom 2×/3× plays, random selection without replacement, pre-week redraw, locked audited correction, activity-date scoring and trusted reconciliation. Selected, redrawn and corrected-away plays all remain consumed.

Existing v1/v2 seasons remain unchanged; new seasons use v3. The packaging environment passes 120 domain tests. Windows must still run installation, lint, build, 51 Firestore Rules tests, release-readiness and npm audit before deployment.

The next planned release after v0.23 is weekly roster stability and the weekly composition-balance foundation.
