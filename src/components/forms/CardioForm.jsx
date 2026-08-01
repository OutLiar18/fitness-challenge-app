import { useMemo } from "react";
import {
  CARDIO_ENVIRONMENT_OPTIONS,
  CARDIO_EQUIPMENT_OPTIONS,
  CARDIO_GROUP_OPTIONS,
  CARDIO_TYPE_OPTIONS,
} from "../../constants/libraries/cardioMetaDataLibrary";
import {
  getCardioActivity,
  getGroupedCardioActivities,
} from "../../services/libraries/cardioLibraryService";
import useGlobalLibrary from "../../hooks/useGlobalLibrary";
import { groupCardioLibraryItems } from "../../services/libraries/globalLibraryModel";
import DurationPicker from "../common/DurationPicker";
import FormField from "../common/Form/FormField";
import NumberInput from "../common/Form/NumberInput";
import TextArea from "../common/Form/TextArea";
import SmartSelect from "../common/Selector/SmartSelect";
import "./FormSections.css";


function createCustomActivityDefinition(name) {
  return {
    name,
    group: "",
    cardioType: "",
    environment: "",
    equipment: "",
    proposedTier: "",
  };
}

export default function CardioForm({ formData, setFormData, readOnly = false }) {
  const { cardioActivities, findItem } = useGlobalLibrary();
  const activityOptions = useMemo(
    () =>
      groupCardioLibraryItems(
        getGroupedCardioActivities(),
        cardioActivities,
      ),
    [cardioActivities],
  );

  function updateActivity(value, selectionDetails = {}) {
    const customActivity = selectionDetails.isCustom === true;

    const publishedItem = customActivity
      ? null
      : findItem("cardio", value);

    setFormData((currentData) => ({
      ...currentData,
      activity: value,
      source: customActivity
        ? "custom"
        : publishedItem
          ? "published"
          : "library",
      suggestionStatus: customActivity ? "pending" : "",
      activityDefinition: customActivity
        ? createCustomActivityDefinition(value)
        : publishedItem?.definition ?? getCardioActivity(value),
    }));
  }

  function updateDefinition(field, value) {
    setFormData((currentData) => ({
      ...currentData,
      activityDefinition: {
        ...(currentData.activityDefinition ??
          createCustomActivityDefinition(currentData.activity || "")),
        [field]: value,
      },
    }));
  }

  function updateField(field, value) {
    setFormData((currentData) => ({ ...currentData, [field]: value }));
  }

  const customActivity = formData.source === "custom";

  return (
    <>
      <SmartSelect
        label="Activity"
        required
        value={formData.activity ?? ""}
        options={activityOptions}
        disabled={readOnly}
        allowCustom
        customOptionLabel="Suggest new activity"
        onChange={updateActivity}
      />

      {customActivity && (
        <section className="form-section" aria-labelledby="cardio-suggestion-title">
          <div className="form-section__header">
            <h3 id="cardio-suggestion-title">Suggest a new cardio activity</h3>
            <p>
              Add enough detail for the activity to be scored now and reviewed
              for the shared library later.
            </p>
          </div>

          <div className="form-section__grid">
            <label className="form-section__field" htmlFor="cardio-group">
              Group <span className="form-required">*</span>
              <select
                id="cardio-group"
                disabled={readOnly}
                value={formData.activityDefinition?.group ?? ""}
                onChange={(event) => updateDefinition("group", event.target.value)}
              >
                <option value="">Select a group…</option>
                {CARDIO_GROUP_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>

            <label className="form-section__field" htmlFor="cardio-type">
              Cardio type <span className="form-required">*</span>
              <select
                id="cardio-type"
                disabled={readOnly}
                value={formData.activityDefinition?.cardioType ?? ""}
                onChange={(event) => updateDefinition("cardioType", event.target.value)}
              >
                <option value="">Select a type…</option>
                {CARDIO_TYPE_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>

            <label className="form-section__field" htmlFor="cardio-environment">
              Environment <span className="form-required">*</span>
              <select
                id="cardio-environment"
                disabled={readOnly}
                value={formData.activityDefinition?.environment ?? ""}
                onChange={(event) => updateDefinition("environment", event.target.value)}
              >
                <option value="">Select an environment…</option>
                {CARDIO_ENVIRONMENT_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>

            <label className="form-section__field" htmlFor="cardio-equipment">
              Equipment <span className="form-required">*</span>
              <select
                id="cardio-equipment"
                disabled={readOnly}
                value={formData.activityDefinition?.equipment ?? ""}
                onChange={(event) => updateDefinition("equipment", event.target.value)}
              >
                <option value="">Select equipment…</option>
                {CARDIO_EQUIPMENT_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>

            <label className="form-section__field" htmlFor="cardio-tier">
              Difficulty <span className="form-required">*</span>
              <select
                id="cardio-tier"
                disabled={readOnly}
                value={formData.activityDefinition?.proposedTier ?? ""}
                onChange={(event) =>
                  updateDefinition(
                    "proposedTier",
                    event.target.value === "" ? "" : Number(event.target.value),
                  )
                }
              >
                <option value="">Select difficulty…</option>
                <option value="1">Tier 1 — Beginner</option>
                <option value="2">Tier 2 — Novice</option>
                <option value="3">Tier 3 — Intermediate</option>
                <option value="4">Tier 4 — Advanced</option>
                <option value="5">Tier 5 — Elite</option>
              </select>
            </label>
          </div>
        </section>
      )}

      <DurationPicker
        formData={formData}
        setFormData={setFormData}
        readOnly={readOnly}
      />

      <FormField label="Distance (kilometres)" htmlFor="cardio-distance" help="Optional">
        <NumberInput
          id="cardio-distance"
          name="distance"
          min={0.01}
          step={0.01}
          readOnly={readOnly}
          value={formData.distance ?? ""}
          placeholder="For example: 10.5"
          onChange={(value) => updateField("distance", value)}
        />
      </FormField>

      <FormField label="Notes" htmlFor="cardio-notes" help="Optional">
        <TextArea
          id="cardio-notes"
          name="notes"
          readOnly={readOnly}
          value={formData.notes ?? ""}
          placeholder="Add anything useful about the session…"
          rows={4}
          onChange={(value) => updateField("notes", value)}
        />
      </FormField>
    </>
  );
}
