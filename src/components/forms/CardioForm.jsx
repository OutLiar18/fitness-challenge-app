import DurationPicker from "../common/DurationPicker";
import SmartSelect from "../common/Selector/SmartSelect";

import {
  CARDIO_GROUP_OPTIONS,
  CARDIO_TYPE_OPTIONS,
  CARDIO_ENVIRONMENT_OPTIONS,
  CARDIO_EQUIPMENT_OPTIONS,
} from "../../constants/libraries/cardioMetaDataLibrary";

import {
  getCardioActivity,
  getGroupedCardioActivities,
} from "../../services/libraries/cardioLibraryService";

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

function isCustomActivity(formData = {}) {
  return formData.source === "custom";
}

export default function CardioForm({
  formData,
  setFormData,
  readOnly = false,
}) {
  const activityOptions = getGroupedCardioActivities();

  const updateActivity = (value, selectionDetails = {}) => {
    const customActivity = selectionDetails.isCustom === true;

    setFormData((currentData) => {
      if (customActivity) {
        return {
          ...currentData,
          activity: value,
          source: "custom",
          suggestionStatus: "pending",
          activityDefinition: createCustomActivityDefinition(value),
        };
      }

      const activityDefinition = getCardioActivity(value);

      return {
        ...currentData,
        activity: value,
        source: "library",
        suggestionStatus: "",
        activityDefinition,
      };
    });
  };

  const updateActivityDefinition = (field, value) => {
    setFormData((currentData) => ({
      ...currentData,

      activityDefinition: {
        ...(currentData.activityDefinition ||
          createCustomActivityDefinition(currentData.activity || "")),

        [field]: value,
      },
    }));
  };

  const updateField = (field, value) => {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
  };

  const customActivity = isCustomActivity(formData);

  return (
    <>
      <div style={{ marginBottom: "15px" }}>
        <label>
          <strong>Activity *</strong>
        </label>

        <SmartSelect
          label="Activity"
          value={formData.activity ?? ""}
          options={activityOptions}
          disabled={readOnly}
          allowCustom
          customOptionLabel="Suggest new activity"
          onChange={updateActivity}
        />
      </div>

      {customActivity && (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "15px",
          }}
        >
          <h4 style={{ marginTop: 0 }}>Suggest New Cardio Activity</h4>

          <p>
            This activity is not currently in the library. Add its details so it
            can be organised and reviewed later.
          </p>

          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="cardio-group">
              <strong>Group *</strong>
            </label>

            <select
              id="cardio-group"
              disabled={readOnly}
              value={formData.activityDefinition?.group || ""}
              onChange={(event) =>
                updateActivityDefinition("group", event.target.value)
              }
            >
              <option value="">Select activity group...</option>

              {CARDIO_GROUP_OPTIONS.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="cardio-type">
              <strong>Cardio Type *</strong>
            </label>

            <select
              id="cardio-type"
              disabled={readOnly}
              value={formData.activityDefinition?.cardioType || ""}
              onChange={(event) =>
                updateActivityDefinition("cardioType", event.target.value)
              }
            >
              <option value="">Select cardio type...</option>

              {CARDIO_TYPE_OPTIONS.map((cardioType) => (
                <option key={cardioType} value={cardioType}>
                  {cardioType}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="cardio-environment">
              <strong>Environment *</strong>
            </label>

            <select
              id="cardio-environment"
              disabled={readOnly}
              value={formData.activityDefinition?.environment || ""}
              onChange={(event) =>
                updateActivityDefinition("environment", event.target.value)
              }
            >
              <option value="">Select environment...</option>

              {CARDIO_ENVIRONMENT_OPTIONS.map((environment) => (
                <option key={environment} value={environment}>
                  {environment}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="cardio-equipment">
              <strong>Equipment *</strong>
            </label>

            <select
              id="cardio-equipment"
              disabled={readOnly}
              value={formData.activityDefinition?.equipment || ""}
              onChange={(event) =>
                updateActivityDefinition("equipment", event.target.value)
              }
            >
              <option value="">Select equipment...</option>

              {CARDIO_EQUIPMENT_OPTIONS.map((equipment) => (
                <option key={equipment} value={equipment}>
                  {equipment}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="cardio-tier">
              <strong>Difficulty Tier *</strong>
            </label>

            <select
              id="cardio-tier"
              disabled={readOnly}
              value={formData.activityDefinition?.proposedTier || ""}
              onChange={(event) =>
                updateActivityDefinition(
                  "proposedTier",
                  event.target.value === "" ? "" : Number(event.target.value),
                )
              }
            >
              <option value="">Select difficulty...</option>
              <option value={1}>Tier 1 - Beginner</option>
              <option value={2}>Tier 2 - Novice</option>
              <option value={3}>Tier 3 - Intermediate</option>
              <option value={4}>Tier 4 - Advanced</option>
              <option value={5}>Tier 5 - Elite</option>
            </select>
          </div>
        </div>
      )}

      <DurationPicker
        formData={formData}
        setFormData={setFormData}
        readOnly={readOnly}
      />

      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="cardio-distance">
          <strong>Distance (km) — Optional</strong>
        </label>

        <input
          id="cardio-distance"
          name="distance"
          type="number"
          min="0.01"
          step="0.01"
          disabled={readOnly}
          value={formData.distance ?? ""}
          placeholder="For example: 10.5"
          onWheel={(event) => event.currentTarget.blur()}
          onChange={(event) =>
            updateField(
              "distance",
              event.target.value === "" ? "" : Number(event.target.value),
            )
          }
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="cardio-notes">
          <strong>Notes — Optional</strong>
        </label>

        <textarea
          id="cardio-notes"
          name="notes"
          disabled={readOnly}
          value={formData.notes ?? ""}
          placeholder="Add anything useful about the session..."
          rows="4"
          onChange={(event) => updateField("notes", event.target.value)}
        />
      </div>
    </>
  );
}
