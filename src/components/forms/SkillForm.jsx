import { useMemo } from "react";
import {
  SKILL_AREA_OPTIONS,
  SKILL_TAG_OPTIONS,
} from "../../constants/libraries/skillMetaDataLibrary";
import { getSkillNames } from "../../services/libraries/skillLibraryService";
import useGlobalLibrary from "../../hooks/useGlobalLibrary";
import { mergeLibraryNames } from "../../services/libraries/globalLibraryModel";
import DurationPicker from "../common/DurationPicker";
import MultiSelect from "../common/Selector/MultiSelect";
import SmartSelect from "../common/Selector/SmartSelect";
import "./FormSections.css";


function createCustomSkillDefinition(name) {
  return { name, area: "", tags: [] };
}

export default function SkillForm({ formData, setFormData, readOnly = false }) {
  const { skills, findItem } = useGlobalLibrary();
  const skillOptions = useMemo(
    () => mergeLibraryNames(getSkillNames(), skills),
    [skills],
  );

  function updateSkill(value, selectionDetails = {}) {
    const customSkill = selectionDetails.isCustom === true;

    const publishedItem = customSkill
      ? null
      : findItem("skill", value);

    setFormData((currentData) => ({
      ...currentData,
      skill: value,
      source: customSkill
        ? "custom"
        : publishedItem
          ? "published"
          : "library",
      suggestionStatus: customSkill ? "pending" : "",
      skillDefinition: customSkill
        ? createCustomSkillDefinition(value)
        : publishedItem?.definition ?? null,
    }));
  }

  function updateDefinition(field, value) {
    setFormData((currentData) => ({
      ...currentData,
      skillDefinition: {
        ...(currentData.skillDefinition ??
          createCustomSkillDefinition(currentData.skill || "")),
        [field]: value,
      },
    }));
  }

  return (
    <>
      <SmartSelect
        label="Skill"
        required
        value={formData.skill ?? ""}
        options={skillOptions}
        disabled={readOnly}
        allowCustom
        customOptionLabel="Suggest new skill"
        onChange={updateSkill}
      />

      {formData.source === "custom" && (
        <section className="form-section" aria-labelledby="skill-suggestion-title">
          <div className="form-section__header">
            <h3 id="skill-suggestion-title">Suggest a new skill</h3>
            <p>Add a category and useful tags so the skill can be reviewed later.</p>
          </div>

          <label className="form-section__field" htmlFor="skill-area">
            Skill area <span className="form-required">*</span>
            <select
              id="skill-area"
              disabled={readOnly}
              value={formData.skillDefinition?.area ?? ""}
              onChange={(event) => updateDefinition("area", event.target.value)}
            >
              <option value="">Select a skill area…</option>
              {SKILL_AREA_OPTIONS.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </label>

          <MultiSelect
            label="Tags"
            options={SKILL_TAG_OPTIONS}
            value={formData.skillDefinition?.tags ?? []}
            disabled={readOnly}
            placeholder="Select relevant tags…"
            onChange={(value) => updateDefinition("tags", value)}
          />
        </section>
      )}

      <DurationPicker
        formData={formData}
        setFormData={setFormData}
        readOnly={readOnly}
      />
    </>
  );
}
