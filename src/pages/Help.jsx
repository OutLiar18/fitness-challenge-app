import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import WorkspaceTabs, {
  WorkspacePanel,
} from "../components/common/WorkspaceTabs";
import ThemeIcon from "../components/common/ThemeIcon";
import PageHeader from "../components/layout/PageHeader";
import usePlayerData from "../hooks/usePlayerData";
import {
  ACCOUNT_REQUEST_REASON_OPTIONS,
  canCancelAccountRequest,
  getAccountDeletionTiming,
  getAccountRequestReasonLabel,
  getAccountRequestStatus,
  isActiveAccountRequest,
} from "../services/account/accountModel";
import {
  cancelAccountDeletionRequest,
  submitAccountDeletionRequest,
  subscribeToAccountDeletionRequest,
} from "../services/account/accountRequestService";
import {
  buildPersonalDataExport,
  downloadPersonalDataExport,
} from "../services/account/dataExportService";
import { restartOnboarding } from "../services/account/onboardingService";
import "./Help.css";

const HELP_TABS = Object.freeze([
  {
    id: "getting-started",
    label: "Getting started",
    icon: <ThemeIcon name="compass" size={18} />,
    description: "First-week essentials",
  },
  {
    id: "data",
    label: "How data works",
    icon: <ThemeIcon name="journal" size={18} />,
    description: "Stored facts and derived results",
  },
  {
    id: "privacy",
    label: "Privacy and safety",
    icon: <ThemeIcon name="evidence" size={18} />,
    description: "Access, evidence and account boundaries",
  },
  {
    id: "account",
    label: "Account tools",
    icon: <ThemeIcon name="profile" size={18} />,
    description: "Export and deletion requests",
  },
]);

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatDate(value) {
  const date = value?.toDate?.() ?? value;
  return date instanceof Date && !Number.isNaN(date.getTime())
    ? dateFormatter.format(date)
    : "Not available";
}

function GettingStarted({ onRestart, busy }) {
  return (
    <div className="help-grid help-grid--two">
      <section className="help-card card">
        <span className="help-card__icon" aria-hidden="true">1</span>
        <div>
          <p className="section-kicker">Start with today</p>
          <h2>Record one honest action</h2>
          <p>
            Open <strong>Log activity</strong>, choose the category and enter what
            actually happened. The app calculates points, goals, streaks,
            progression and analytics from the same factual entry.
          </p>
          <Link className="button button--primary" to="/log">
            Log an activity
          </Link>
        </div>
      </section>

      <section className="help-card card">
        <span className="help-card__icon" aria-hidden="true">2</span>
        <div>
          <p className="section-kicker">Understand the rules</p>
          <h2>Use the references when something feels unclear</h2>
          <p>
            The Rulebook explains current challenge behaviour. The Points Guide
            presents the public scoring ladders generated from the live constants.
          </p>
          <div className="help-action-row">
            <Link className="button button--secondary" to="/rules">Rulebook</Link>
            <Link className="button button--secondary" to="/points-guide">
              Points Guide
            </Link>
          </div>
        </div>
      </section>

      <section className="help-card card">
        <span className="help-card__icon" aria-hidden="true">3</span>
        <div>
          <p className="section-kicker">Review your patterns</p>
          <h2>Look for direction—not perfection</h2>
          <p>
            Progress shows levels, records and achievements. Analytics shows recent
            consistency and category balance without creating another competitive
            score.
          </p>
          <div className="help-action-row">
            <Link className="button button--secondary" to="/progress">Progress</Link>
            <Link className="button button--secondary" to="/analytics">Analytics</Link>
          </div>
        </div>
      </section>

      <section className="help-card card">
        <span className="help-card__icon" aria-hidden="true">4</span>
        <div>
          <p className="section-kicker">Replay the introduction</p>
          <h2>Return to the guided tour at any time</h2>
          <p>
            Restarting the tour does not change your entries, points, profile,
            season membership or competitive history.
          </p>
          <button
            className="button button--secondary"
            type="button"
            disabled={busy}
            onClick={onRestart}
          >
            {busy ? "Preparing guide…" : "Replay new-player guide"}
          </button>
        </div>
      </section>
    </div>
  );
}

function DataExplainer() {
  const rows = [
    {
      title: "Stored facts",
      iconName: "journal",
      body: "Activity category, measurements, selected challenge date and creation time are stored so your history can be reconstructed.",
    },
    {
      title: "Derived results",
      iconName: "points",
      body: "Points, goals, streaks, Experience Points, records and analytics are calculated from factual entries rather than stored as competing versions of the truth.",
    },
    {
      title: "Season snapshots",
      iconName: "seasons",
      body: "When an entry counts in a season, its contribution remembers the House represented at that moment. The activity date also determines any weekly Power Play. Later roster movement or proof review does not rewrite those historical facts.",
    },
    {
      title: "Private and scoped records",
      iconName: "profile",
      body: "Access depends on the record type. Coach preferences and announcement read state are player-only; Pocket, evidence and account-request records allow only the additional operational access required by their season or trusted workflow.",
    },
  ];

  return (
    <div className="help-data-stack">
      <section className="help-callout card">
        <span aria-hidden="true"><ThemeIcon name="check" size={30} /></span>
        <div>
          <p className="section-kicker">One source of truth</p>
          <h2>Store what happened. Derive what it means.</h2>
          <p>
            This principle prevents a page, chart or leaderboard from inventing its
            own scoring logic. Running, Cardio and season contributions all consume
            the shared Points Engine.
          </p>
        </div>
      </section>

      <div className="help-grid help-grid--two">
        {rows.map((row) => (
          <article className="help-card card" key={row.title}>
            <span className="help-card__symbol" aria-hidden="true"><ThemeIcon name={row.iconName} size={23} /></span>
            <div>
              <h2>{row.title}</h2>
              <p>{row.body}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function PrivacyExplainer() {
  return (
    <div className="help-privacy-stack">
      <section className="help-callout card">
        <span aria-hidden="true"><ThemeIcon name="evidence" size={30} /></span>
        <div>
          <p className="section-kicker">Plain-language privacy</p>
          <h2>Your personal activity history stays tied to your account</h2>
          <p>
            You can read your own personal entries and account records. Season
            members can see the shared competition facts required for standings,
            House rosters, leadership and season history.
          </p>
        </div>
      </section>

      <div className="help-boundary-list">
        <article className="card">
          <strong>Authentication and hosting</strong>
          <p>
            Firebase Authentication provides sign-in. Cloud Firestore stores app
            records. Firebase Hosting serves the website. The current client does not
            include advertising, payment or social-tracking SDKs.
          </p>
        </article>
        <article className="card">
          <strong>Trusted roles cannot be self-assigned</strong>
          <p>
            Changing a display name or avatar cannot change administrator access,
            season membership or contribution history. Trusted role changes require
            authorised administrative action and an audit record.
          </p>
        </article>
        <article className="card">
          <strong>Season administration is scoped</strong>
          <p>
            League Administrators can access the season records needed to operate
            leagues they manage, including membership, Pocket and evidence records.
            Only Platform Administrators can make evidence decisions. Platform
            Administrators may access additional records required for moderation,
            security, support and trusted deletion.
          </p>
        </article>
        <article className="card">
          <strong>Evidence media stays outside the app</strong>
          <p>
            The current evidence flow sends proof through the approved delivery
            channel, currently WhatsApp. Champions Legacy stores the claim,
            verification code, submission time, reviewed quantity, status and
            decision metadata; the proof image itself is not uploaded to Cloud
            Firestore by the current client.
          </p>
        </article>
        <article className="card">
          <strong>Shared season history remains truthful</strong>
          <p>
            Deleting or closing an account must not silently rewrite completed House
            results. Trusted processing removes eligible private records while
            preserving legitimate shared competition history in anonymised form.
          </p>
        </article>
      </div>
      <div className="inline-alert inline-alert--info">
        Pre-v1.0 notice: this page explains current product behaviour; it is not a
        final legal privacy notice. A formal privacy review and confirmed support
        contact are still required before v1.0.
      </div>
    </div>
  );
}

function AccountTools({ profile, user }) {
  const [request, setRequest] = useState(null);
  const [requestLoaded, setRequestLoaded] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [reasonCode, setReasonCode] = useState("prefer-not-to-say");
  const [understood, setUnderstood] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [requestBusy, setRequestBusy] = useState(false);
  const [status, setStatus] = useState(null);
  const statusRef = useRef(null);
  const requestErrorRef = useRef(null);

  useEffect(() => {
    if (status?.type === "error") statusRef.current?.focus();
  }, [status]);

  useEffect(() => {
    if (requestError) requestErrorRef.current?.focus();
  }, [requestError]);

  useEffect(
    () =>
      subscribeToAccountDeletionRequest(
        user?.uid,
        (nextRequest) => {
          setRequest(nextRequest);
          setRequestLoaded(true);
          setRequestError("");
        },
        (error) => {
          console.error(error);
          setRequestLoaded(true);
          setRequestError(
            error?.message || "Your account request could not be loaded.",
          );
        },
      ),
    [user?.uid],
  );

  const activeRequest = isActiveAccountRequest(request);
  const canCancelRequest = canCancelAccountRequest(request);
  const deletionTiming = getAccountDeletionTiming(request);
  const requestStatus = useMemo(
    () => (request ? getAccountRequestStatus(request.status) : null),
    [request],
  );
  const displayName =
    profile?.displayName || profile?.fullName || user?.displayName || "Champion";

  async function handleExport() {
    setExporting(true);
    setStatus(null);

    try {
      const exportData = await buildPersonalDataExport(user?.uid);
      downloadPersonalDataExport(exportData);
      const unavailable = exportData.metadata?.unavailableSections?.length || 0;
      setStatus({
        type: unavailable > 0 ? "info" : "success",
        message:
          unavailable > 0
            ? `Your export was created. ${unavailable} ${unavailable === 1 ? "section" : "sections"} could not be read and are listed inside the file.`
            : "Your personal data export was created successfully.",
      });
    } catch (error) {
      console.error(error);
      setStatus({
        type: "error",
        message: error?.message || "Your personal data export could not be created.",
      });
    } finally {
      setExporting(false);
    }
  }

  async function handleRequest() {
    setRequestBusy(true);
    setStatus(null);

    try {
      await submitAccountDeletionRequest({
        userId: user?.uid,
        email: profile?.email || user?.email,
        displayName,
        reasonCode,
      });
      setUnderstood(false);
      setStatus({
        type: "success",
        message: "Your account deletion request was submitted.",
      });
    } catch (error) {
      console.error(error);
      setStatus({
        type: "error",
        message: error?.message || "The request could not be submitted.",
      });
    } finally {
      setRequestBusy(false);
    }
  }

  async function handleCancel() {
    setRequestBusy(true);
    setStatus(null);

    try {
      await cancelAccountDeletionRequest(user?.uid);
      setStatus({
        type: "success",
        message: "Your account deletion request was cancelled.",
      });
    } catch (error) {
      console.error(error);
      setStatus({
        type: "error",
        message: error?.message || "The request could not be cancelled.",
      });
    } finally {
      setRequestBusy(false);
    }
  }

  return (
    <div
      className="account-tools"
      aria-busy={exporting || requestBusy || undefined}
    >
      <section className="account-tool card">
        <div className="account-tool__heading">
          <span aria-hidden="true"><ThemeIcon name="journal" size={24} /></span>
          <div>
            <p className="section-kicker">Personal data export</p>
            <h2>Download an account-readable JSON copy</h2>
          </div>
        </div>
        <p>
          The export includes your profile, entries and correction history,
          season memberships, contributions and evidence, Pocket activity,
          notifications, leadership votes, suggestions, personal library, private
          preferences and your deletion request when readable. Shared public
          documents and administrator-only audits are not copied.
        </p>
        <button
          className="button button--primary"
          type="button"
          disabled={exporting}
          onClick={handleExport}
        >
          {exporting ? "Preparing export…" : "Download my personal data"}
        </button>
      </section>

      <section className="account-tool account-tool--danger card">
        <div className="account-tool__heading">
          <span aria-hidden="true"><ThemeIcon name="admin" size={24} /></span>
          <div>
            <p className="section-kicker">Account closure</p>
            <h2>Request trusted account deletion</h2>
          </div>
        </div>

        {!requestLoaded ? (
          <p>Loading your current request status…</p>
        ) : requestError ? (
          <div
            className="inline-alert inline-alert--danger"
            ref={requestErrorRef}
            role="alert"
            tabIndex="-1"
          >
            {requestError}
          </div>
        ) : activeRequest ? (
          <div className="account-request-status">
            <div>
              <span className={`status-pill status-pill--${request.status}`}>
                {requestStatus.label}
              </span>
              <h3>{requestStatus.description}</h3>
              <p>
                Requested {formatDate(request.requestedAt)} · Reason: {" "}
                {getAccountRequestReasonLabel(request.reasonCode)}
              </p>
              {request.status === "acknowledged" && (
                <p>
                  Acknowledged {formatDate(request.acknowledgedAt)}. You may cancel until
                  trusted processing begins. Processing becomes eligible {formatDate(deletionTiming.eligibleAt)}.
                </p>
              )}
            </div>
            {canCancelRequest && (
              <button
                className="button button--secondary"
                type="button"
                disabled={requestBusy}
                onClick={handleCancel}
              >
                {requestBusy ? "Cancelling…" : "Cancel request"}
              </button>
            )}
          </div>
        ) : (
          <>
            <p>
              Account deletion requires trusted processing because the signed-in
              browser cannot safely remove Firebase Authentication plus every related
              private and shared record. This request creates a reviewable task for a
              Platform Administrator. After acknowledgement, a seven-day cancellation
              window applies; trusted processing then removes eligible private records
              and anonymises shared season history.
            </p>

            <label htmlFor="account-deletion-reason">Reason</label>
            <select
              id="account-deletion-reason"
              value={reasonCode}
              disabled={requestBusy}
              onChange={(event) => setReasonCode(event.target.value)}
            >
              {ACCOUNT_REQUEST_REASON_OPTIONS.map((option) => (
                <option value={option.id} key={option.id}>{option.label}</option>
              ))}
            </select>

            <label className="account-confirmation">
              <input
                type="checkbox"
                checked={understood}
                disabled={requestBusy}
                onChange={(event) => setUnderstood(event.target.checked)}
              />
              <span>
                I understand that this submits a deletion request; it does not
                instantly erase my account. I will have seven days after acknowledgement
                to cancel, and completed shared season history will be anonymised rather than removed.
              </span>
            </label>

            <button
              className="button button--danger"
              type="button"
              disabled={!understood || requestBusy}
              onClick={handleRequest}
            >
              {requestBusy
                ? "Submitting request…"
                : request?.status === "cancelled"
                  ? "Submit deletion request again"
                  : "Request account deletion"}
            </button>
          </>
        )}
      </section>

      {status && (
        <div
          className={`inline-alert inline-alert--${
            status.type === "error"
              ? "danger"
              : status.type === "success"
                ? "success"
                : "info"
          }`}
          ref={statusRef}
          role={status.type === "error" ? "alert" : "status"}
          tabIndex={status.type === "error" ? -1 : undefined}
        >
          {status.message}
        </div>
      )}
    </div>
  );
}

export default function Help() {
  const { profile, user } = usePlayerData();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const activeTab = HELP_TABS.some((tab) => tab.id === requestedTab)
    ? requestedTab
    : "getting-started";
  const [restarting, setRestarting] = useState(false);
  const [restartError, setRestartError] = useState("");
  const restartErrorRef = useRef(null);

  useEffect(() => {
    if (restartError) restartErrorRef.current?.focus();
  }, [restartError]);

  function setActiveTab(tabId) {
    const next = new URLSearchParams(searchParams);
    if (tabId === "getting-started") next.delete("tab");
    else next.set("tab", tabId);
    setSearchParams(next, { replace: true });
  }

  async function handleRestart() {
    setRestarting(true);
    setRestartError("");

    try {
      await restartOnboarding(user?.uid);
      setRestarting(false);
    } catch (error) {
      console.error(error);
      setRestartError(error?.message || "The guide could not be restarted.");
      setRestarting(false);
    }
  }

  return (
    <div className="help-page page-stack">
      <PageHeader
        eyebrow="Support and account control"
        title="Help & Privacy"
        description="Understand the challenge, see how your data is handled and use clear account controls without searching through technical documentation."
        icon={<ThemeIcon name="help" size={28} strokeWidth={2.2} />}
      />

      <WorkspaceTabs
        idPrefix="help"
        label="Help and privacy sections"
        tabs={HELP_TABS}
        activeId={activeTab}
        onChange={setActiveTab}
      />

      {restartError && (
        <div
          className="inline-alert inline-alert--danger"
          ref={restartErrorRef}
          role="alert"
          tabIndex="-1"
        >
          {restartError}
        </div>
      )}

      <WorkspacePanel id="getting-started" activeId={activeTab} idPrefix="help">
        <GettingStarted onRestart={handleRestart} busy={restarting} />
      </WorkspacePanel>

      <WorkspacePanel id="data" activeId={activeTab} idPrefix="help">
        <DataExplainer />
      </WorkspacePanel>

      <WorkspacePanel id="privacy" activeId={activeTab} idPrefix="help">
        <PrivacyExplainer />
      </WorkspacePanel>

      <WorkspacePanel id="account" activeId={activeTab} idPrefix="help">
        <AccountTools profile={profile} user={user} />
      </WorkspacePanel>
    </div>
  );
}
