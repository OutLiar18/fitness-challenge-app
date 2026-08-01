import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  writeBatch,
} from "firebase/firestore";

import { db } from "../../firebase";
import { addAuditWrite } from "./auditService";

export async function getErrorReportPage({
  cursor = null,
  pageSize = 25,
} = {}) {
  const constraints = [orderBy("reportedAt", "desc"), limit(pageSize)];

  if (cursor) {
    constraints.splice(1, 0, startAfter(cursor));
  }

  const snapshot = await getDocs(
    query(collection(db, "clientErrorReports"), ...constraints),
  );

  return {
    items: snapshot.docs.map((reportDocument) => ({
      id: reportDocument.id,
      ...reportDocument.data(),
    })),
    cursor: snapshot.docs.at(-1) ?? null,
    hasMore: snapshot.docs.length === pageSize,
  };
}

export async function resolveErrorReport({
  report,
  resolutionNote,
  actorId,
}) {
  if (!report?.id || report.status !== "open") {
    throw new Error("Choose an open error report to resolve.");
  }

  const normalizedNote = String(resolutionNote ?? "").trim();

  if (normalizedNote.length < 4) {
    throw new Error("Add a brief resolution note.");
  }

  const batch = writeBatch(db);
  const reportReference = doc(db, "clientErrorReports", report.id);
  const auditReference = addAuditWrite(batch, {
    actorId,
    action: "error.report.resolved",
    entityType: "clientErrorReport",
    entityId: report.id,
    summary: `Resolved client error report: ${report.message}`.slice(0, 300),
    details: {
      fingerprint: report.fingerprint ?? "",
      source: report.source ?? "",
      resolutionNote: normalizedNote.slice(0, 500),
    },
  });

  batch.update(reportReference, {
    status: "resolved",
    resolvedAt: serverTimestamp(),
    resolvedBy: actorId,
    resolutionNote: normalizedNote.slice(0, 500),
    lastAuditId: auditReference.id,
  });

  await batch.commit();
}
