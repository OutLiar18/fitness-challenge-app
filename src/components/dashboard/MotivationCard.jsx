import { useMemo, useState } from "react";

import { getDailyMotivation } from "../../constants/motivation";
import "./MotivationCard.css";

export default function MotivationCard({ playerSeed = "champion" }) {
  const [offset, setOffset] = useState(0);

  const motivation = useMemo(
    () => getDailyMotivation(new Date(), playerSeed, offset),
    [offset, playerSeed],
  );

  return (
    <section className="motivation-card card" aria-labelledby="motivation-title">
      <div className="motivation-card__header">
        <div>
          <p>Champion transmission</p>
          <h2 id="motivation-title">A useful interruption</h2>
        </div>

        <button
          className="button button--ghost button--icon"
          type="button"
          aria-label="Show another message"
          title="Shuffle message"
          onClick={() => setOffset((current) => current + 1)}
        >
          <span aria-hidden="true">↻</span>
        </button>
      </div>

      <blockquote>
        <p>“{motivation.quote}”</p>
        <cite>— {motivation.attribution}</cite>
      </blockquote>

      <div className="motivation-card__extras">
        <article>
          <span aria-hidden="true">🧭</span>
          <div>
            <strong>Today’s side quest</strong>
            <p>{motivation.sideQuest}</p>
          </div>
        </article>

        <article>
          <span aria-hidden="true">🤨</span>
          <div>
            <strong>Coach’s questionable wisdom</strong>
            <p>{motivation.coachNote}</p>
          </div>
        </article>
      </div>
    </section>
  );
}
