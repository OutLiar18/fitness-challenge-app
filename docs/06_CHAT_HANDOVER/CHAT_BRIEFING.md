# Champions Legacy Challenge — Chat Briefing

<!-- RELEASE_STATUS: DEPLOYED -->
Current source: v0.22.0  
Current production: v0.22.0  
Last updated: 5 August 2026

## Product and workflow

- React + Vite + Firebase Authentication/Firestore/Hosting.
- Production: `https://champions-legacy-challenge.web.app`.
- User is learning; give concise copy/paste instructions and complete replacement packages.
- Workflow: apply one main updater, verify, deploy, run included finaliser, commit.
- Never declare or tag v1.0 without explicit approval.
- Do not run `npm audit fix` or `npm audit fix --force` during current releases.

## v0.22.0 candidate

Trusted Account Deletion and Anonymised Shared History:

- request acknowledgement starts a seven-day cancellation window;
- player may cancel only before processing;
- local Admin SDK dry audit is the default;
- process command requires explicit confirmation and a final live refresh;
- Firebase Authentication and eligible private records are removed;
- shared season/House history is preserved under a deterministic Former Player alias;
- final Platform Administrator deletion is blocked;
- failed operations are resumable;
- completion creates administrator-only execution, receipt and audit records;
- fresh registration is allowed with no restored/reconnected history.

Expected release gates: 108 domain tests and 47 Firestore Rules tests.

## Private operations

The service-account JSON and trusted reports stay outside the repository. Do not process a real deletion during release verification.

## Roadmap decisions

- v0.23: Power Plays confirmed — ten built-in categories, weekly random x2/x3, custom one/multi-category plays.
- v0.24: one-week post-move lock and weekly House gender-composition balance.
- v0.25: Five Fires and remaining competition design; Buddy Bonuses and late twists undecided.
- Diamonds/player prices/transfer market rejected/inactive.
- v0.26 security hardening, v0.27 full polish, v0.28 full season rehearsal.
