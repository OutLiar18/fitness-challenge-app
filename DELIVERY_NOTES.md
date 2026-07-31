# Champions Legacy v0.5 Delivery Notes

This package is a cleaned source-code delivery. It intentionally excludes `.env`, `.git`, `node_modules` and generated build files.

## Replace the current project safely

1. Keep a backup of the current project folder.
2. Copy the current project's `.env` file somewhere safe.
3. Extract this package into a new folder.
4. Copy the saved `.env` into the new project root. If no `.env` exists, copy `.env.example` to `.env` and add the Firebase values.
5. Open a terminal in the new project folder and run:

```bash
npm install
npm run check
npm run dev
```

A fresh `npm install` is important because native Vite/Rolldown packages differ between Windows and Linux.

## Firebase rules

Review and deploy the included owner-based Firestore rules before using production accounts:

```bash
firebase deploy --only firestore:rules
```

## Manual checks after starting the app

- Sign up, sign in and sign out.
- Add and delete one entry in every category.
- Confirm a Running entry shows separate Running and Cardio Bonus points.
- Confirm Running duration advances both Running and Cardio statistics.
- Check today's journal and a locked older date.
- Test the app at desktop and mobile widths.

See `OPTIMIZATION_SUMMARY.md` for the complete refactor summary and `docs/01_CURRENT_DEVELOPMENT/ROADMAP.md` for the next planned work.
