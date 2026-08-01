import { useCallback, useEffect, useRef, useState } from "react";

export default function useToast(defaultDuration = 3500) {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const dismissToast = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setToast(null);
  }, []);

  const showToast = useCallback(
    (message, type = "success", duration = defaultDuration) => {
      if (!message) {
        return;
      }

      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }

      setToast({ message, type });
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        setToast(null);
      }, duration);
    },
    [defaultDuration],
  );

  useEffect(() => dismissToast, [dismissToast]);

  return { toast, showToast, dismissToast };
}
