import { CATEGORIES } from "../../constants/categories";
import "./CategoryGrid.css";

export default function CategoryGrid({ selected, onSelect }) {
  return (
    <section className="category-picker card" aria-labelledby="category-picker-title">
      <div className="category-picker__header">
        <p className="category-picker__eyebrow">Choose your focus</p>
        <h2 id="category-picker-title">Log an activity</h2>
        <p>Select a category, then record the work you completed.</p>
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
