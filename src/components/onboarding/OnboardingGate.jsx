import { useEffect, useRef, useState } from "react";

import usePlayerData from "../../hooks/usePlayerData";
import { shouldShowOnboarding } from "../../services/account/accountModel";
import { completeOnboarding } from "../../services/account/onboardingService";
import "./OnboardingGate.css";

const ONBOARDING_STEPS = Object.freeze([
  {
    id: "welcome",
    eyebrow: "Welcome, Champion",
    title: "Build a legacy one honest action at a time",
    icon: "🏆",
    description:
      "Champions Legacy Challenge rewards consistency, growth and truthful effort. You do not need to be the strongest player to make meaningful progress.",
    points: [
      "Record what actually happened.",
      "Improve against your own previous effort.",
      "Use the challenge as encouragement—not punishment.",
    ],
  },
  {
    id: "log",
    eyebrow: "Your daily rhythm",
    title: "Log activity, then let the app do the calculations",
    icon: "➕",
    description:
      "Choose a category, enter the factual details and save. Points, goals, streaks, Experience Points and analytics are derived from those entries.",
    points: [
      "Running must meet the distance and pace rule for Running points.",
      "Ineligible runs still contribute their duration to Cardio.",
      "Journal notes stay connected to the day you selected.",
    ],
  },
  {
    id: "progress",
    eyebrow: "Your journey",
    title: "Points compete; Experience Points reflect personal growth",
    icon: "⚡",
    description:
      "Competitive points and personal progression remain separate. Streaks, achievements and levels encourage consistency without secretly changing season standings.",
    points: [
      "Daily and weekly goals use the shared challenge rules.",
      "Analytics explain trends without creating another score.",
      "Missed days are information—not a reason for shame.",
    ],
  },
  {
    id: "season",
    eyebrow: "Season competition",
    title: "Join a season when your organiser opens registration",
    icon: "🛡️",
    description:
      "Houses exist only inside a season. C.H.A.O.S. balances registered players, and every contribution remembers the House represented when it was earned.",
    points: [
      "Pocket Week is the seven days immediately before a season.",
      "Private notifications appear in your Inbox.",
      "Help & Privacy explains stored data and account controls.",
    ],
  },
]);

function StepIndicator({ activeIndex }) {
  return (
    <ol className="onboarding-progress" aria-label="Onboarding progress">
      {ONBOARDING_STEPS.map((step, index) => (
        <li
          className={index === activeIndex ? "onboarding-progress__item--active" : ""}
          aria-current={index === activeIndex ? "step" : undefined}
          key={step.id}
        >
          <span>{index + 1}</span>
          <small>{step.eyebrow}</small>
        </li>
      ))}
    </ol>
  );
}

export default function OnboardingGate({ children }) {
  const { profile, user, loading } = usePlayerData();
  const [activeIndex, setActiveIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const dialogRef = useRef(null);
  const showOnboarding = !loading && shouldShowOnboarding(profile);
  const step = ONBOARDING_STEPS[activeIndex];
  const finalStep = activeIndex === ONBOARDING_STEPS.length - 1;

  useEffect(() => {
    if (!showOnboarding) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key !== "Tab" || !dialogRef.current) return;

      const selector =
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
      const focusable = [...dialogRef.current.querySelectorAll(selector)];
      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showOnboarding]);

  async function finishOnboarding() {
    setSaving(true);
    setStatus("");

    try {
      await completeOnboarding(user?.uid);
    } catch (error) {
      console.error(error);
      setStatus(
        error?.message
          || "The tour could not be completed. Check your connection and try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {children}

      {showOnboarding && (
        <div className="onboarding-backdrop">
          <section
            ref={dialogRef}
            className="onboarding-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="onboarding-title"
            aria-describedby="onboarding-description"
            tabIndex={-1}
          >
            <div className="onboarding-dialog__aside" aria-hidden="true">
              <span>{step.icon}</span>
              <strong>Champions Legacy</strong>
              <small>Challenge</small>
            </div>

            <div className="onboarding-dialog__main">
              <StepIndicator activeIndex={activeIndex} />

              <div className="onboarding-copy" key={step.id}>
                <p className="section-kicker">{step.eyebrow}</p>
                <h1 id="onboarding-title">{step.title}</h1>
                <p id="onboarding-description">{step.description}</p>

                <ul>
                  {step.points.map((point) => (
                    <li key={point}>
                      <span aria-hidden="true">✓</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {status && (
                <div className="inline-alert inline-alert--danger" role="alert">
                  {status}
                </div>
              )}

              <div className="onboarding-actions">
                <button
                  className="button button--ghost"
                  type="button"
                  disabled={saving}
                  onClick={finishOnboarding}
                >
                  Skip tour
                </button>

                <div>
                  {activeIndex > 0 && (
                    <button
                      className="button button--secondary"
                      type="button"
                      disabled={saving}
                      onClick={() => {
                        setStatus("");
                        setActiveIndex((current) => Math.max(0, current - 1));
                      }}
                    >
                      Back
                    </button>
                  )}

                  <button
                    className="button button--primary button--large"
                    type="button"
                    disabled={saving}
                    onClick={
                      finalStep
                        ? finishOnboarding
                        : () => {
                            setStatus("");
                            setActiveIndex((current) =>
                              Math.min(ONBOARDING_STEPS.length - 1, current + 1),
                            );
                          }
                    }
                  >
                    {saving
                      ? "Saving…"
                      : finalStep
                        ? "Enter the challenge"
                        : "Continue"}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
