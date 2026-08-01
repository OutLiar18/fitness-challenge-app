const MAX_MESSAGE_LENGTH = 600;
const MAX_STACK_LENGTH = 4000;
const MAX_CONTEXT_LENGTH = 1000;

function truncate(value, maximum) {
  return String(value ?? "").slice(0, maximum);
}

function serializeContext(context) {
  try {
    return JSON.stringify(context ?? {});
  } catch {
    return JSON.stringify({
      message: "Context could not be serialised safely.",
    });
  }
}

export function createErrorFingerprint(error, source = "application") {
  return [
    source,
    error?.name ?? "Error",
    error?.message ?? String(error ?? "Unknown error"),
    error?.stack?.split("\n")?.[1] ?? "",
  ]
    .join("|")
    .slice(0, 500);
}

export function sanitizeErrorReport({
  error,
  source = "application",
  context = {},
  route = "",
  userAgent = "",
}) {
  const normalizedError =
    error instanceof Error ? error : new Error(String(error ?? "Unknown error"));

  return {
    name: truncate(normalizedError.name || "Error", 100),
    message: truncate(
      normalizedError.message || "Unknown application error",
      MAX_MESSAGE_LENGTH,
    ),
    stack: truncate(normalizedError.stack, MAX_STACK_LENGTH),
    source: truncate(source, 120),
    route: truncate(route, 300),
    releaseVersion: "0.10.0",
    context: {
      summary: truncate(serializeContext(context), MAX_CONTEXT_LENGTH),
    },
    userAgent: truncate(userAgent, 500),
    occurredAt: new Date(),
    fingerprint: createErrorFingerprint(normalizedError, source),
  };
}
