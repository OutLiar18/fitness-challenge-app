import { getCategory } from "../../utils/categoryHelpers";

import WorkoutForm from "../forms/WorkoutForm";
import RunningForm from "../forms/RunningForm";
import CardioForm from "../forms/CardioForm";
import ReadingForm from "../forms/ReadingForm";
import SkillForm from "../forms/SkillForm";
import WaterForm from "../forms/WaterForm";
import FruitForm from "../forms/FruitForm";
import StepsForm from "../forms/StepsForm";

export default function EntryForm({
  type,
  formData,
  setFormData,
  onSave,
  readOnly = false,
}) {
  const category = getCategory(type);

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
        {category.emoji} {category.name}
      </h2>

      {readOnly && (
        <p>🔒 This day is locked. Older entries cannot be modified.</p>
      )}

      {[
        "upperBody",
        "lowerBody",
        "core",
        "fullBody",
      ].includes(type) ? (
        <WorkoutForm
          category={category}
          formData={formData}
          setFormData={setFormData}
          readOnly={readOnly}
        />
      ) : type === "running" ? (
        <RunningForm
          formData={formData}
          setFormData={setFormData}
          readOnly={readOnly}
        />
      ) : type === "cardio" ? (
        <CardioForm
          formData={formData}
          setFormData={setFormData}
          readOnly={readOnly}
        />
      ) : type === "reading" ? (
        <ReadingForm
          formData={formData}
          setFormData={setFormData}
          readOnly={readOnly}
        />
      ) : type === "skill" ? (
        <SkillForm
          formData={formData}
          setFormData={setFormData}
          readOnly={readOnly}
        />
      ) : type === "water" ? (
        <WaterForm
          formData={formData}
          setFormData={setFormData}
          readOnly={readOnly}
        />
      ) : type === "fruit" ? (
        <FruitForm
          formData={formData}
          setFormData={setFormData}
          readOnly={readOnly}
        />
      ) : type === "steps" ? (
        <StepsForm
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