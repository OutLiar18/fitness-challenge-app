import "./PageHeader.css";

export default function PageHeader({
  eyebrow,
  title,
  description,
  icon = "🏆",
  actions = null,
}) {
  return (
    <header className="page-header card">
      <div className="page-header__identity">
        {icon ? (
          <span className="page-header__icon" aria-hidden="true">
            {icon}
          </span>
        ) : null}

        <div>
          {eyebrow && <p className="page-header__eyebrow">{eyebrow}</p>}
          <h1>{title}</h1>
          {description && <p className="page-header__description">{description}</p>}
        </div>
      </div>

      {actions && <div className="page-header__actions">{actions}</div>}
    </header>
  );
}
