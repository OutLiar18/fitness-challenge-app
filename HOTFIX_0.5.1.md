# Champions Legacy v0.5.1 Hotfix

## Fixed

- Removed a Windows case-insensitive filename collision between:
  - `src/context/AuthContext.jsx`
  - `src/context/authContext.js`
- Split the files into unambiguous names:
  - `src/context/AuthProvider.jsx`
  - `src/context/AuthContext.js`
- Updated imports in `src/main.jsx`, `src/hooks/useAuth.js`, and `src/context/AuthProvider.jsx`.

This resolves the Vite production-build error stating that `AuthProvider` is not exported by `src/context/AuthContext.js`.
