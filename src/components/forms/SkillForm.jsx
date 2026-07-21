import DurationPicker from "../common/DurationPicker/DurationPicker";

import { OPTIONS } from "../../constants/options";
import SmartSelect from "../common/SmartSelect/SmartSelect";

export default function SkillForm({
  formData,
  setFormData,
  readOnly,
}) {
  return (
    <>
      <div style={{ marginBottom: "15px" }}>
        <label>
          <strong>Skill *</strong>
        </label>

        <SmartSelect
          label="Skill"
          value={formData.skill || ""}
          options={OPTIONS.skill || []}
          disabled={readOnly}
          onChange={(value) =>
            setFormData({
              ...formData,
              skill: value,
            })
          }
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