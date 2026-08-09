# Champions Legacy Challenge — External Evidence and Published Standings

Version: `whatsapp-proof-v1`  
Season ruleset: `season-houses-v2`  
Last updated: 4 August 2026

## Purpose

Evidence protects fairness without introducing a paid media-storage dependency. Players log factual activity in the app, send pictures or screenshots through the season WhatsApp group and include the verification ID shown by the app. The app stores no evidence media.

This system separates four things:

1. the player's factual activity entry;
2. an evidence claim linked to that entry or day;
3. an administrator's structured decision;
4. the immutable contribution released by that decision.

## Season configuration

Every new v2 season must explicitly confirm and freeze:

- evidence-policy version;
- proof deadline in hours;
- Running and Steps proof requirements;
- Water photographed-volume threshold and bonus;
- Fruit photographed-serving threshold and bonus;
- Fruit daily scored-serving cap;
- leaderboard timezone and publication time;

The current defaults are:

- timezone: `Africa/Johannesburg`;
- proof deadline: 24 hours from entry creation;
- Water threshold: 750 millilitres, maximum three bonus points per day;
- Fruit threshold: three photographed servings, maximum three bonus points per day;
- Fruit normal scoring cap: five servings per day;
- player leaderboard publication time: 10:00.

## Verification IDs

- Required-proof Running and Steps entries receive one claim each.
- Water and Fruit use one daily claim per category because their bonus accumulates across the day.
- IDs contain a category prefix and six characters chosen without ambiguous letters/numbers.
- IDs contain no player name or private information.
- The player copies the ID into the WhatsApp proof message.
- Administrators can search the evidence queue by ID or player name.

Examples:

- `RUN-7K4M9Q`
- `STEP-2D8R5N`
- `WATER-6P3X8C`
- `FRUIT-9T5J2L`

## Running proof

Valid proof must show:

- activity date;
- distance;
- duration.

Average pace is calculated by the app from distance and duration. It is not separately entered by the Platform Administrator.

Scoring behaviour:

- a run below three kilometres or slower than 11:00 per kilometre earns only its normal Cardio result and creates no Running proof claim;
- a qualifying run releases Cardio points and Cardio statistics immediately;
- qualifying Running points remain pending until proof is accepted;
- accepted proof releases the pending Running points to the individual and the House captured at activity time;
- rejected, expired or missing proof does not remove the run from personal history and does not remove its Cardio result.

## Steps proof

Valid proof must show:

- the relevant date;
- total daily steps;
- a recognisable fitness application or device screen.

The Steps entry appears in personal history immediately. Competitive Steps points remain pending until proof is accepted. Proof adds no bonus.

## Water proof bonus

- Normal Water activity points remain immediate.
- The player may send one or more pictures whose combined photographed quantity reaches the season threshold.
- Current default: 750 millilitres, whether shown as three 250-millilitre portions, one 750-millilitre portion or another valid combination.
- The daily bonus is awarded once only.
- Current default bonus: three Points.

## Fruit proof bonus and cap

- Normal Fruit activity points remain immediate, subject to the season's daily scored-serving cap.
- Current cap: five servings per day.
- Photographed servings may be part of those five servings; they are not additional fruit.
- Any valid combination totalling three recognised servings qualifies for the daily photo bonus.
- The daily bonus is awarded once only.
- Current default bonus: three Points.

## Evidence bonus accounting

Water and Fruit evidence bonuses:

- count toward the player's individual season total;
- count toward the House captured at activity time;
- are competitive Points, not Experience Points;
- are separate from normal category scoring;
- sit outside the ordinary daily activity cap;
- remain traceable to the claim and decision that created them.

## Deadline and statuses

Proof must be submitted in WhatsApp within 24 hours of the in-app entry being logged. The administrator records the WhatsApp submission timestamp.

Player-visible statuses include:

- Awaiting WhatsApp proof;
- Proof accepted;
- Proof rejected;
- Proof not submitted within the time limit;
- Previous proof decision reversed.

A late submission may be accepted only by a Platform Administrator and only with a required audit reason.

## Evidence decision permissions

- Platform Administrators are the only browser role allowed to accept, reject or reverse evidence decisions.
- Only Platform Administrators may accept late proof, with the required factual reason.
- League/Season Administrators retain read-only evidence visibility needed for season operations and may publish standings when otherwise authorised.
- League/Season Administrator authority does not grant proof-decision authority.

## Decision model

A Platform Administrator may:

- accept proof;
- reject proof with a reason;
- reverse a previous decision with a reason.

Decisions are immutable. A mistake is corrected by reversing the original decision and recording a new replacement decision. Released points are corrected through signed contribution records rather than silent mutation or deletion.

## Entry deletion and correction

Once an entry has an evidence verification ID, ordinary client deletion is blocked. This preserves the link between factual activity, WhatsApp ID, claim, decision and contribution. A future audited factual-correction workflow should replace direct deletion for these records.

## House attribution

Evidence decisions use the House captured when the activity was logged. If the player later moves Houses, accepted or corrected evidence remains allocated to the original House. Historical points are never moved with the player.

## Notifications

Private notifications cover:

- proof accepted;
- proof rejected;
- proof deadline missed;
- Water or Fruit evidence bonus awarded;
- evidence decision corrected.

The player may see their own current evidence state immediately.

## Published player standings

Administrators and authorised operators see live standings derived from the current immutable contribution stream.

Players see only a published snapshot containing:

- season and publication date;
- publication time and timezone;
- revision number;
- individual ranking rows;
- House ranking rows;
- season honours available at publication time;
- publisher and publication mode.

Snapshots are immutable. A corrected publication creates a later revision rather than overwriting history. Until the first snapshot exists, players see a clear not-yet-published state. If a day has no new publication, players continue seeing the previous snapshot.

## 10:00 fallback boundary

The current client/Firebase iteration has no trusted background scheduler. Therefore the 10:00 automatic behaviour is an **administrator-session fallback**:

- at or after 10:00 Africa/Johannesburg;
- when an authorised administrator opens Evidence Operations;
- if no snapshot has been published for that date;
- the app may publish the daily fallback snapshot.

This is not guaranteed to run without an administrator session. A future trusted scheduled function may replace this mechanism without changing old snapshot records.

## Pocket Week boundary

Running and Steps Pocket redemption is blocked in new v2 seasons. Whole-session Pocket reserves do not have a safe, unambiguous evidence-linking workflow in this no-media iteration. Water and Fruit remain governed by their normal daily claim rules when scored activity is created.

## Privacy boundary

The app must never imply that WhatsApp media is stored, encrypted, retained or deleted by Champions Legacy Challenge. Those media controls belong to the external WhatsApp group and its administrators. The app stores only structured metadata and decisions necessary for competition operation.

## v0.19 operational visibility

Authorised v2 season operators receive a derived command centre that summarises evidence workload, immutable decision history and leaderboard snapshot history. The command centre does not change evidence status or points by itself. Only Platform Administrators may make evidence decisions; League Administrators retain read-only evidence visibility for operations. Downloaded operations reports contain no WhatsApp media.

## Corrected evidence-linked entries

A required Running or Steps proof claim can be marked `superseded` only through an audited Platform Administrator correction. A qualifying replacement receives its own verification ID; a non-qualifying replacement run receives no Running claim. Earlier verified points are neutralised through immutable correction-reversal contributions. Water and Fruit keep one daily claim and append the replacement/correction link.

## Trusted reconciliation extension — v0.21.0

<!-- RELEASE_STATUS: DEPLOYED -->

Before a trusted publication, evidence claims, decisions and released contribution links are checked alongside correction records. Broken proof relationships block publication. Accepted evidence remains represented by immutable contributions; the trusted command does not rereview WhatsApp media or alter evidence decisions.
