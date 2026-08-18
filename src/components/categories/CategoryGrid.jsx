import { CATEGORIES } from "../../constants/categories";
import "./CategoryGrid.css";

export default function CategoryGrid({
  selected,
  onSelect,
  eyebrow = "Choose your focus",
  title = "Log an activity",
  description = "Select a category, then record the work you completed.",
  headerActions = null,
}) {
  return (
    <section className="category-picker card" aria-labelledby="category-picker-title">
      <div className="category-picker__topline">
        <div className="category-picker__header">
          <p className="category-picker__eyebrow">{eyebrow}</p>
          <h2 id="category-picker-title">{title}</h2>
          {description && <p>{description}</p>}
        </div>
        {headerActions && (
          <div className="category-picker__actions">{headerActions}</div>
        )}
      </div>

      <div className="category-grid">
        {CATEGORIES.map((category) => {
          const active = selected === category.id;

          return (
            <button
              key={category.id}
              type="button"
              className={`category-tile${active ? " category-tile--active" : ""}`}
              aria-pressed={active}
              onClick={() => onSelect(category.id)}
            >
              <span className="category-tile__emoji" aria-hidden="true">
                {category.emoji}
              </span>
              <span className="category-tile__name">
                {category.shortName ?? category.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
