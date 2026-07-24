import DurationPicker from "../common/DurationPicker";
import MultiSelect from "../common/MultiSelect/MultiSelect";
import SmartSelect from "../common/SmartSelect/SmartSelect";

import {
  SKILL_AREA_OPTIONS,
  SKILL_TAG_OPTIONS,
} from "../../constants/libraries/skillMetaDataLibrary";

import { getSkillNames } from "../../services/skillLibraryService";

function createCustomSkillDefinition(name) {
  return {
    name,
    area: "",
    tags: [],
  };
}

function isCustomSkill(formData) {
  return formData.source === "custom" || Boolean(formData.skillDefinition);
}

export default function SkillForm({ formData, setFormData, readOnly = false }) {
  const skillOptions = getSkillNames();

  const updateSkill = (value, selectionDetails = {}) => {
    const customSkill = selectionDetails.isCustom === true;

    setFormData((currentData) => {
      if (customSkill) {
        return {
          ...currentData,
          skill: value,
          source: "custom",
          suggestionStatus: "pending",
          skillDefinition: createCustomSkillDefinition(value),
        };
      }

      return {
        ...currentData,
        skill: value,
        source: "library",
        suggestionStatus: "",
        skillDefinition: null,
      };
    });
  };

  const updateSkillDefinition = (field, value) => {
    setFormData((currentData) => ({
      ...currentData,

      skillDefinition: {
        ...(currentData.skillDefinition ||
          createCustomSkillDefinition(currentData.skill || "")),

        [field]: value,
      },
    }));
  };

  const customSkill = isCustomSkill(formData);

  return (
    <>
      <div style={{ marginBottom: "15px" }}>
        <label>
          <strong>Skill *</strong>
        </label>

        <SmartSelect
          label="Skill"
          value={formData.skill ?? ""}
          options={skillOptions}
          disabled={readOnly}
          allowCustom
          customOptionLabel="Suggest new skill"
          onChange={updateSkill}
        />
      </div>

      {customSkill && (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "15px",
          }}
        >
          <h4 style={{ marginTop: 0 }}>Suggest New Skill</h4>

          <p>
            This skill is not currently in the library. Add a few details so it
            can be organised and reviewed later.
          </p>

          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="skill-area">
              <strong>Skill Area *</strong>
            </label>

            <select
              id="skill-area"
              disabled={readOnly}
              value={formData.skillDefinition?.area || ""}
              onChange={(event) =>
                updateSkillDefinition("area", event.target.value)
              }
            >
              <option value="">Select skill area...</option>

              {SKILL_AREA_OPTIONS.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          <MultiSelect
            label="Tags"
            options={SKILL_TAG_OPTIONS}
            value={formData.skillDefinition?.tags || []}
            disabled={readOnly}
            placeholder="Select relevant tags..."
            onChange={(value) => updateSkillDefinition("tags", value)}
          />
        </div>
      )}

      <DurationPicker
        formData={formData}
        setFormData={setFormData}
        readOnly={readOnly}
      />
    </>
  );
}
