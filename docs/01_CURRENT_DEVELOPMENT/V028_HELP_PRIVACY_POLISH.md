# Champions Legacy Challenge — v0.28.0 Help & Privacy Polish

Checkpoint: 28D11

## Review outcome

Help & Privacy already had strong functional foundations: URL-backed sections,
new-player-guide replay, personal-data export, a trusted account-deletion request
workflow, seven-day cancellation timing, busy states and focused action errors.

The main v0.28 gaps were presentation consistency and privacy clarity. Several raw
emoji remained, the privacy copy used an unnecessary ownership claim, current
evidence-delivery privacy was not explained, and an account-request subscription
error could appear without receiving focus.

## Changes

- Points Guide is recorded as owner-accepted;
- ordinary Help/Privacy chrome now uses the shared Phosphor-backed ThemeIcon system;
- numbered Getting Started steps remain numbers because they communicate sequence;
- tab descriptions are tightened;
- the data section distinguishes player-only records from season-scoped operational
  access instead of calling all such settings simply private;
- `account-owned data` is replaced with neutral wording about personal data tied to
  the signed-in account;
- privacy boundaries now explain League Administrator season-scoped access and
  Platform Administrator evidence/moderation/support/deletion authority;
- current evidence privacy is explicit: proof is delivered through the approved
  external evidence channel, currently WhatsApp; the app stores claim/decision
  metadata but the current client does not upload the proof image into Cloud
  Firestore;
- Firebase Authentication, Cloud Firestore and Firebase Hosting remain clearly
  disclosed, together with the current absence of advertising, payment and
  social-tracking SDKs;
- the pre-v1.0 notice is reframed as a product-status disclosure rather than a
  developer note;
- personal export copy now names the main account-readable record families;
- partial-export messaging handles `section` / `sections` correctly;
- account-request loading errors gain a dedicated focus target;
- account deletion wording better explains why trusted processing is required.

## Access model represented in the page

- player profile: player + Platform Administrator;
- Coach preferences and announcement read state: player-only;
- account deletion request: player + Platform Administrator;
- Pocket activity/redemptions: player + relevant league administrators + Platform
  Administrator;
- evidence claims/decisions: player + relevant league administrators + Platform
  Administrator;
- evidence decisions themselves: Platform Administrator only;
- completed shared season history may remain after deletion in anonymised form.

## Safety boundary

28D11 does not change:

- Firestore Rules;
- export service query scope;
- account-deletion policy or seven-day waiting period;
- trusted deletion processing;
- onboarding behavior;
- evidence handling;
- league visibility;
- Firebase deployment state.

A final legal/privacy review and confirmed support contact remain pre-v1.0 launch
requirements; this page is not presented as a substitute for that formal review.
