import { getCategory } from "../../utils/categoryHelpers";
import CardioForm from "../forms/CardioForm";
import FruitForm from "../forms/FruitForm";
import ReadingForm from "../forms/ReadingForm";
import RunningForm from "../forms/RunningForm";
import SkillForm from "../forms/SkillForm";
import StepsForm from "../forms/StepsForm";
import WaterForm from "../forms/WaterForm";
import WorkoutForm from "../forms/WorkoutForm";
import "./EntryForm.css";

const FORM_COMPONENTS = {
  water: WaterForm,
  fruit: FruitForm,
  reading: ReadingForm,
  running: RunningForm,
  cardio: CardioForm,
  skill: SkillForm,
  steps: StepsForm,
  upperBody: WorkoutForm,
  lowerBody: WorkoutForm,
  core: WorkoutForm,
};

export default function EntryForm({
  userId,
  type,
  formData,
  setFormData,
  onSave,
  saving = false,
  readOnly = false,
  errors = [],
  eyebrow,
  title,
  description,
  notice,
  submitLabel = "Save entry",
  savingLabel = "Saving entry…",
}) {
  const category = getCategory(type);
  const FormComponent = FORM_COMPONENTS[type];
  const heading = title || category?.name || "Activity";

  return (
    <section className={`entry-form card${readOnly ? " entry-form--locked" : ""}`} aria-labelledby="entry-form-title">
      <div className="entry-form__header">
        <span className="entry-form__emoji" aria-hidden="true">{category?.emoji ?? "🏆"}</span>
        <div>
          <p>{eyebrow || (readOnly ? "History view" : "New entry")}</p>
          <h2 id="entry-form-title">{heading}</h2>
        </div>
      </div>

      {(description || category?.description) && (
        <p className="entry-form__description">{description || category.description}</p>
      )}

      {notice && <div className="inline-alert entry-form__notice">{notice}</div>}

      {readOnly && !notice && (
        <div className="inline-alert entry-form__notice">
          🔒 This day is locked. Entries can only be added or deleted for today and yesterday.
        </div>
      )}

      {errors.length > 0 && (
        <div className="entry-form__errors" role="alert" aria-labelledby="entry-errors-title">
          <strong id="entry-errors-title">Please check the following:</strong>
          <ul>
            {errors.map((error) => <li key={error}>{error}</li>)}
          </ul>
        </div>
      )}

      <div className="entry-form__body">
        {FormComponent ? (
          <FormComponent
            userId={userId}
            category={type}
            formData={formData}
            setFormData={setFormData}
            readOnly={readOnly}
          />
        ) : (
          <div className="empty-state">No form exists for this category.</div>
        )}
      </div>

      <button
        className="button button--primary button--large entry-form__submit"
        type="button"
        disabled={readOnly || saving || !FormComponent}
        onClick={onSave}
      >
        {saving ? savingLabel : submitLabel}
      </button>
    </section>
  );
}
