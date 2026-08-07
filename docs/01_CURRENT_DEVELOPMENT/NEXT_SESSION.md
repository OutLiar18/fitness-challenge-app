# Champions Legacy Challenge — Next Session

<!-- RELEASE_STATUS: DEPLOYED -->
Current source: v0.23.5 stability candidate  
Current production: v0.23.5

## First action

Run the complete release gate from the one restored `fitness-tracker` folder:

```powershell
npm install
npm run check:release
```

Expected: 120 domain tests, 51 Firestore Rules tests, clean lint/build, and successful v0.23.5 release-readiness.

If it passes, run `npm run deploy:production`. That command deploys Rules first and only deploys Hosting if Rules succeed. Verify the production site, then run `npm run finalise:release`.

Do not reintroduce the v0.24 House Movement files or Rules until that feature receives a new Rules architecture.
