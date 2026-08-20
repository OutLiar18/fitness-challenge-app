import { useState } from "react";
import ThemeIcon from "../common/ThemeIcon";
import { MBTI_PROFILES, getMbtiProfileByType } from "../../constants/mbtiProfiles";
import { MBTI_QUICK_QUESTIONS, scoreMbtiQuickTest } from "../../services/profile/mbtiProfileModel";
import MbtiProfileAvatar from "./MbtiProfileAvatar";
import "./MbtiProfileChooser.css";

const EXTERNAL_TEST_URL = "https://www.16personalities.com/free-personality-test";

function TypeGrid({ value, onSelect, disabled }) {
  return (
    <div className="mbti-type-grid" role="radiogroup" aria-label="MBTI type">
      {MBTI_PROFILES.map((profile) => {
        const selected = profile.type === value;
        return (
          <button
            key={profile.type}
            className={`mbti-type-card${selected ? " mbti-type-card--selected" : ""}`}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onSelect(profile.type)}
          >
            <MbtiProfileAvatar type={profile.type} size="medium" decorative />
            <span>
              <strong>{profile.mythicName}</strong>
              <small>{profile.type} · {profile.title}</small>
            </span>
            <span className="mbti-type-card__check" aria-hidden="true">{selected ? "✓" : ""}</span>
          </button>
        );
      })}
    </div>
  );
}

function QuickTest({ onUseResult, onExit }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const question = MBTI_QUICK_QUESTIONS[index];

  function answer(choice) {
    const nextAnswers = { ...answers, [question.id]: choice };
    setAnswers(nextAnswers);
    if (index === MBTI_QUICK_QUESTIONS.length - 1) {
      setFinished(true);
      return;
    }
    setIndex((current) => current + 1);
  }

  function restart() {
    setAnswers({});
    setIndex(0);
    setFinished(false);
  }

  if (finished) {
    const completedResult = scoreMbtiQuickTest(answers);
    const profile = getMbtiProfileByType(completedResult.type);
    return (
      <div className="mbti-quick-result">
        <p className="section-kicker">Quick estimate complete</p>
        <div className="mbti-quick-result__identity">
          <MbtiProfileAvatar type={completedResult.type} size="large" />
          <div>
            <h3>{profile?.mythicName}</h3>
            <p>{completedResult.type} · {profile?.title}. This is a rough 12-question estimate, not a definitive personality assessment. Review it before choosing your profile.</p>
          </div>
        </div>
        <div className="mbti-dimensions" aria-label="Quick estimate response lean">
          {completedResult.dimensions.map((dimension) => (
            <div key={dimension.id}>
              <span>{dimension.first} {dimension.firstPercent}%</span>
              <div aria-hidden="true"><span style={{ width: `${dimension.firstPercent}%` }} /></div>
              <span>{dimension.secondPercent}% {dimension.second}</span>
            </div>
          ))}
        </div>
        <p className="mbti-quick-result__note">Percentages show how your three answers in each dimension leaned; they are not clinical confidence scores.</p>
        <div className="mbti-chooser__actions">
          <button className="button button--primary" type="button" onClick={() => onUseResult(completedResult.type)}>
            Use {completedResult.type}
          </button>
          <button className="button button--secondary" type="button" onClick={restart}>Retake 12 questions</button>
          <button className="button button--ghost" type="button" onClick={onExit}>Choose a type myself</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mbti-quick-test">
      <div className="mbti-quick-test__topline">
        <span>Question {index + 1} of {MBTI_QUICK_QUESTIONS.length}</span>
        <button className="button button--ghost" type="button" onClick={onExit}>Exit quick test</button>
      </div>
      <div className="mbti-quick-test__progress" aria-hidden="true">
        <span style={{ width: `${((index + 1) / MBTI_QUICK_QUESTIONS.length) * 100}%` }} />
      </div>
      <h3>{question.prompt}</h3>
      <p>Pick the option that sounds more like you most of the time. Neither choice is better.</p>
      <div className="mbti-quick-test__choices">
        <button type="button" onClick={() => answer("a")}><span>A</span>{question.a.label}</button>
        <button type="button" onClick={() => answer("b")}><span>B</span>{question.b.label}</button>
      </div>
      {index > 0 && (
        <button
          className="button button--secondary"
          type="button"
          onClick={() => {
            const previousQuestion = MBTI_QUICK_QUESTIONS[index - 1];
            setAnswers((current) => {
              const next = { ...current };
              delete next[previousQuestion.id];
              return next;
            });
            setIndex((current) => current - 1);
          }}
        >
          Back
        </button>
      )}
    </div>
  );
}

export default function MbtiProfileChooser({ value, onChange, disabled = false }) {
  const [mode, setMode] = useState("select");
  const selectedProfile = getMbtiProfileByType(value);

  if (mode === "quick") {
    return <QuickTest onUseResult={(type) => { onChange(type); setMode("select"); }} onExit={() => setMode("select")} />;
  }

  return (
    <fieldset className="mbti-chooser" disabled={disabled}>
      <legend>Your Legacy Profile</legend>
      <p className="mbti-chooser__intro">
        Choose the Legacy identity that matches your MBTI type. If you are unsure, use the 12-question quick estimate or take a longer external test.
      </p>

      <div className="mbti-chooser__routes">
        <button type="button" onClick={() => setMode("quick")}>
          <span aria-hidden="true"><ThemeIcon name="compass" size={24} /></span>
          <strong>I’m not sure</strong>
          <small>Take the 12-question quick estimate</small>
        </button>
        <a href={EXTERNAL_TEST_URL} target="_blank" rel="noreferrer">
          <span aria-hidden="true"><ThemeIcon name="profile" size={24} /></span>
          <strong>Take a longer test</strong>
          <small>Open 16Personalities, then return and select the first four letters</small>
        </a>
      </div>

      <div className="mbti-chooser__known">
        <div>
          <p className="section-kicker">I know my type</p>
          <h3>Select one of the 16 profiles</h3>
        </div>
        {selectedProfile && <span className="mbti-chooser__selected">Selected: {selectedProfile.mythicName}</span>}
      </div>
      <TypeGrid value={value} onSelect={onChange} disabled={disabled} />
      <p className="mbti-chooser__disclaimer">
        Personality profiles are reflective guidance, not diagnoses or guarantees. People can behave differently across situations and can change over time.
      </p>
    </fieldset>
  );
}
