import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebase";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [state, setState] = useState({
    user: null,
    claims: {},
    loading: true,
  });

  useEffect(
    () =>
      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          setState({ user: null, claims: {}, loading: false });
          return;
        }

        try {
          const tokenResult = await user.getIdTokenResult();
          setState({
            user,
            claims: tokenResult.claims ?? {},
            loading: false,
          });
        } catch (error) {
          console.error(error);
          setState({ user, claims: {}, loading: false });
        }
      }),
    [],
  );

  const value = useMemo(() => state, [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
