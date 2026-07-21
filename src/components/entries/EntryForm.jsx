import { getCategory } from "../../utils/categoryHelpers";

import WorkoutForm from "../forms/WorkoutForm";
import RunningForm from "../forms/RunningForm";
import CardioForm from "../forms/CardioForm";
import ReadingForm from "../forms/ReadingForm";
import SkillForm from "../forms/SkillForm";
import WaterForm from "../forms/WaterForm";
import FruitForm from "../forms/FruitForm";
import StepsForm from "../forms/StepsForm";

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
  readOnly = false,
}) {
  const category = getCategory(type);

  const FormComponent = FORM_COMPONENTS[type];

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "20px",
        marginBottom: "20px",
        opacity: readOnly ? 0.6 : 1,
      }}
    >
      <h2>
        {category?.emoji} {category?.name}
      </h2>

      {readOnly && (
        <p>🔒 This day is locked. Older entries cannot be modified.</p>
      )}

      {FormComponent ? (
        <FormComponent
          userId={userId}
          category={type}
          formData={formData}
          setFormData={setFormData}
          readOnly={readOnly}
        />
      ) : (
        <p>No form exists for this category.</p>
      )}

      <button
        type="button"
        disabled={readOnly}
        onClick={onSave}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          cursor: readOnly ? "not-allowed" : "pointer",
        }}
      >
        Save Entry
      </button>
    </div>
  );
}
