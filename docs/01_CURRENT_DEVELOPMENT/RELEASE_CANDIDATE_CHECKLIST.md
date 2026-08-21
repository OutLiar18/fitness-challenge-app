# Champions Legacy Challenge — Release Checklist

Use this only for a real release candidate. Keep it proportional to the risk of the changes.

## Source

- Working tree contains only intended changes.
- Version and release notes are accurate.
- No `.env`, Admin SDK credential, Firebase cache, debug log or generated `dist/` output is committed.

## Automated checks

- `npm run lint`
- `npm test`
- `npm run build`
- `npm run quality:ui`
- Firestore Rules emulator tests only when Rules or their security contract changed.

## Release integrity

- Production deployment is explicit and scoped.
- Firestore Rules are not bundled into a Hosting-only release.
- Release tag points to the intended deployed source.
- Live application is smoke-checked after production activation.

External tester rounds and full-season rehearsal are optional, not mandatory gates.
