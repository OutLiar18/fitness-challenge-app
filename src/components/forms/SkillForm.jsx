import DurationPicker from "../common/DurationPicker";
import { OPTIONS } from "../../constants/options";
import SmartSelect from "../common/SmartSelect/SmartSelect";

export default function SkillForm({ formData, setFormData, readOnly = false }) {
  const updateSkill = (value) => {
    setFormData((currentData) => ({
      ...currentData,
      skill: value,
    }));
  };

  return (
    <>
      <div style={{ marginBottom: "15px" }}>
        <SmartSelect
          label="Skill *"
          value={formData.skill ?? ""}
          options={OPTIONS.skill ?? []}
          disabled={readOnly}
          onChange={updateSkill}
        />
      </div>

      <DurationPicker
        formData={formData}
        setFormData={setFormData}
        readOnly={readOnly}
      />
    </>
  );
}
