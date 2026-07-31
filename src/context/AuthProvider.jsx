import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [state, setState] = useState({
    user: null,
    loading: true,
  });

  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        setState({ user, loading: false });
      }),
    [],
  );

  const value = useMemo(() => state, [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
