import { Link } from "react-router-dom";

import "./QuickActions.css";

const ACTIONS = [
  {
    id: "log",
    icon: "＋",
    title: "Log activity",
    description: "Record the work while it is still fresh.",
    to: "/log",
    primary: true,
  },
  {
    id: "progress",
    icon: "↗",
    title: "Open progress",
    description: "Review records, experience points and achievements.",
    to: "/progress",
  },
  {
    id: "inbox",
    icon: "◉",
    title: "Open inbox",
    description: "Read challenge updates and private season messages.",
    to: "/inbox",
  },
];

export default function QuickActions() {
  return (
    <section className="quick-actions card" aria-labelledby="quick-actions-title">
      <div className="quick-actions__header">
        <div>
          <p>Choose your next move</p>
          <h2 id="quick-actions-title">Quick actions</h2>
        </div>

        <span aria-hidden="true">⚡</span>
      </div>

      <div className="quick-actions__grid">
        {ACTIONS.map((action) => (
          <Link
            key={action.id}
            className={`quick-action${
              action.primary ? " quick-action--primary" : ""
            }`}
            to={action.to}
          >
            <span className="quick-action__icon" aria-hidden="true">
              {action.icon}
            </span>

            <span>
              <strong>{action.title}</strong>
              <small>{action.description}</small>
            </span>

            <span className="quick-action__arrow" aria-hidden="true">
              →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
