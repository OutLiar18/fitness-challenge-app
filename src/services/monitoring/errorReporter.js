import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../../firebase";
import { sanitizeErrorReport } from "./errorReportModel";

const reportedFingerprints = new Set();
const MONITORING_KEY = "__championsLegacyErrorMonitoring";
const PRELOAD_RELOAD_KEY = "champions-legacy:preload-recovery";

function getReportingMode() {
  const configuredMode = String(
    import.meta.env.VITE_ERROR_REPORTING_MODE ?? "console",
  ).toLowerCase();

  return ["off", "console", "firestore"].includes(configuredMode)
    ? configuredMode
    : "console";
}

export async function reportClientError({
  error,
  source = "application",
  context = {},
}) {
  const mode = getReportingMode();
  const report = sanitizeErrorReport({
    error,
    source,
    context,
    route:
      typeof window === "undefined"
        ? ""
        : `${window.location.pathname}${window.location.search}`,
    userAgent:
      typeof navigator === "undefined" ? "" : navigator.userAgent,
  });

  if (mode !== "off") {
    console.error(`[${source}]`, error, context);
  }

  if (mode !== "firestore" || !auth.currentUser) {
    return { reported: false, mode };
  }

  if (reportedFingerprints.has(report.fingerprint)) {
    return { reported: false, mode, duplicate: true };
  }

  reportedFingerprints.add(report.fingerprint);

  try {
    const reference = await addDoc(collection(db, "clientErrorReports"), {
      ...report,
      userId: auth.currentUser.uid,
      status: "open",
      reportedAt: serverTimestamp(),
      resolvedAt: null,
      resolvedBy: "",
      resolutionNote: "",
      lastAuditId: "",
    });

    return { reported: true, mode, id: reference.id };
  } catch (reportingError) {
    reportedFingerprints.delete(report.fingerprint);
    console.error("Error reporting failed:", reportingError);
    return { reported: false, mode, reportingError };
  }
}

export function installGlobalErrorMonitoring() {
  if (typeof window === "undefined") {
    return () => {};
  }

  if (window[MONITORING_KEY]?.cleanup) {
    return window[MONITORING_KEY].cleanup;
  }

  function handleWindowError(event) {
    void reportClientError({
      error: event.error ?? event.message,
      source: "window.error",
      context: {
        filename: event.filename ?? "",
        line: event.lineno ?? 0,
        column: event.colno ?? 0,
      },
    });
  }

  function handleUnhandledRejection(event) {
    void reportClientError({
      error: event.reason,
      source: "unhandledrejection",
    });
  }

  function handlePreloadError(event) {
    event.preventDefault();

    void reportClientError({
      error: event.payload ?? "A deployed application chunk could not be loaded.",
      source: "vite.preload-error",
    });

    if (!import.meta.env.PROD) {
      return;
    }

    const alreadyRetried = window.sessionStorage.getItem(PRELOAD_RELOAD_KEY);

    if (!alreadyRetried) {
      window.sessionStorage.setItem(PRELOAD_RELOAD_KEY, "1");
      window.location.reload();
    }
  }

  window.addEventListener("error", handleWindowError);
  window.addEventListener("unhandledrejection", handleUnhandledRejection);
  window.addEventListener("vite:preloadError", handlePreloadError);

  const recoveryTimeout = window.setTimeout(() => {
    window.sessionStorage.removeItem(PRELOAD_RELOAD_KEY);
  }, 5000);

  const cleanup = () => {
    window.clearTimeout(recoveryTimeout);
    window.removeEventListener("error", handleWindowError);
    window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    window.removeEventListener("vite:preloadError", handlePreloadError);
    delete window[MONITORING_KEY];
  };

  window[MONITORING_KEY] = { cleanup };
  return cleanup;
}
