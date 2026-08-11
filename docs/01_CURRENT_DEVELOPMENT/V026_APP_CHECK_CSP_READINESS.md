# Champions Legacy Challenge — v0.26 App Check and CSP Readiness

Date: 11 August 2026
Checkpoint: 26E
Production baseline: v0.25.0
Development branch: `development/v0.26.0`

## Purpose

26E converts the App Check and Hosting Content Security Policy findings from 26A
into an implementation-ready rollout plan without enabling either control.

This checkpoint is intentionally **readiness-only**:

- no App Check SDK import;
- no reCAPTCHA Enterprise site key;
- no App Check debug token;
- no App Check enforcement;
- no Content-Security-Policy header;
- no Content-Security-Policy-Report-Only header;
- no Firebase deployment.

## Current verified client posture

`src/firebase.js` currently initializes:

- Firebase app;
- Firebase Authentication;
- Cloud Firestore.

It does not initialize Firebase App Check.

`.env.example` contains only the existing Firebase web configuration and error
reporting setting. There is no App Check site-key/debug configuration.

`index.html` contains one external Vite module script and no inline application
script content.

## Current verified Hosting posture

Firebase Hosting already sets:

- `X-Content-Type-Options: nosniff`;
- `X-Frame-Options: DENY`;
- `Referrer-Policy: strict-origin-when-cross-origin`;
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`.

There is no explicit CSP yet.

Firebase Hosting supports custom response headers through the `headers` array in
`firebase.json`, so a future CSP can be introduced there through a dedicated
preview/test/deployment checkpoint.

## App Check provider decision

For a new web integration, use **Firebase App Check with the reCAPTCHA Enterprise
provider** unless a later requirement justifies a custom provider.

Firebase's current web setup requires:

1. a Website-type reCAPTCHA Enterprise key with the real hosted domains;
2. registration of the Firebase web app in Security > App Check;
3. importing `firebase/app-check`;
4. initializing `initializeAppCheck()` with `ReCaptchaEnterpriseProvider`;
5. explicitly enabling token auto-refresh if desired.

The default App Check token TTL is one hour and the SDK refreshes at approximately
half the TTL. Shorter TTLs increase attestation frequency, latency and potential
reCAPTCHA Enterprise assessment cost.

## Required rollout order

### Stage A — console registration, no enforcement

- Create the Website-type reCAPTCHA Enterprise key.
- Restrict it to the actual Champions Legacy Challenge hosted domains.
- Register the existing Firebase web app with App Check.
- Do **not** enable enforcement.

This is a Firebase-console configuration stage and should be separately recorded.

### Stage B — client integration in development

Add a public site-key environment setting such as:

`VITE_FIREBASE_APP_CHECK_SITE_KEY`

Then initialize App Check immediately after `initializeApp()` and before normal
Firebase service use.

The reCAPTCHA Enterprise **site key is client configuration**, not a secret.
However, no actual key should be committed into `.env.example`; only the empty
variable name belongs there.

### Stage C — localhost / test handling

After App Check is integrated, local development must use Firebase's documented
debug-provider workflow.

Important controls:

- never commit a debug token;
- never put a debug token in `.env.example`;
- never ship a debug build/token to production;
- register local/CI debug tokens in the Firebase console;
- keep CI tokens in the CI secret store;
- do not weaken reCAPTCHA domain restrictions by treating localhost as a normal
  production domain merely to make development convenient.

### Stage D — monitoring build

Deploy the App Check-enabled client **without enforcement**.

Firebase documents that registered clients begin sending App Check tokens while
backend services continue accepting unverified requests until enforcement is
enabled.

Monitor App Check metrics for the actual services in use, especially Cloud
Firestore and Authentication, and verify legitimate browser/device coverage.

### Stage E — enforcement

Only after monitoring proves legitimate traffic is verified should enforcement
be considered.

Recommended release strategy for this project:

1. enforce Cloud Firestore first in a dedicated reviewed activation;
2. verify production login/activity/season/admin flows;
3. consider Authentication enforcement separately after its own monitoring and
   compatibility review.

Do not combine App Check enforcement with unrelated Rules or Hosting changes.

## CSP readiness

The current app has no inline application script in `index.html`, which supports
a future restrictive script policy.

A future CSP must account for all browser network/script/frame origins actually
required by:

- the built application;
- Firebase Authentication;
- Cloud Firestore;
- reCAPTCHA Enterprise App Check.

### Baseline policy shape to test, not deploy

The exact production CSP must be generated/tested after App Check client
integration. Its likely structure is:

- `default-src 'self'`;
- `base-uri 'self'`;
- `object-src 'none'`;
- `frame-ancestors 'none'`;
- `img-src 'self' data:`;
- `font-src 'self'`;
- `style-src 'self'` plus only any style exception proven necessary by the built app;
- `script-src 'self'` plus reCAPTCHA Enterprise script origins;
- `frame-src` limited to reCAPTCHA Enterprise frame origins if required;
- `connect-src 'self'` plus the Firebase/Google API endpoints proven by the
  application and App Check traffic.

Cloud Firestore's standard web endpoint is `firestore.googleapis.com`. Firebase
Authentication uses Google API endpoints such as `identitytoolkit.googleapis.com`
and Secure Token endpoints. reCAPTCHA documentation additionally requires its
script, frame and connection origins when CSP is used.

### reCAPTCHA Enterprise CSP requirements

Google's current reCAPTCHA documentation recommends CSP3/nonce handling where
possible. Its documented origin-based fallback includes:

- script: `https://www.google.com/recaptcha/`
- script: `https://www.gstatic.com/recaptcha/`
- frame: `https://www.google.com/recaptcha/`
- frame: `https://recaptcha.google.com/recaptcha/`
- connect: `https://www.google.com/recaptcha/`

The exact CSP must be validated against the production build and App Check
provider behavior before deployment. Do not copy this list into Hosting blindly.

## CSP rollout order

1. integrate App Check first, with enforcement still off;
2. capture browser network/resource origins on the built preview;
3. generate the minimal candidate CSP;
4. test locally/preview with browser console inspection;
5. use a separately reviewed Hosting checkpoint for CSP deployment;
6. run login, Firestore reads/writes, navigation and reCAPTCHA/App Check smoke;
7. only then consider tightening further.

A CSP change and an App Check enforcement change must not be activated in the
same production step because failure attribution would be unnecessarily difficult.

## Exit criteria for 26E

- current App Check absence is explicitly guarded;
- current CSP absence is explicitly guarded;
- existing Hosting security headers remain present;
- inline-script assumption is verified;
- provider, debug-token handling and rollout order are documented;
- CSP dependency/origin categories are documented;
- full application and Firestore Rules gates pass;
- Firestore Rules remain unchanged from 26B;
- no Firebase deployment occurs.

## Primary documentation used

- Firebase App Check: reCAPTCHA Enterprise provider for web apps.
- Firebase App Check: debug provider for web apps.
- Firebase Hosting: custom Hosting headers.
- Cloud Firestore: standard service endpoint documentation.
- Firebase Authentication REST API endpoint documentation.
- Google Cloud reCAPTCHA FAQ: CSP requirements.
