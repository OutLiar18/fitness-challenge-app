import { OPTIONS } from "../../constants/options";
import SmartSelect from "../common/SmartSelect/SmartSelect";
import DurationPicker from "../common/DurationPicker";

export default function CardioForm({
  formData,
  setFormData,
  readOnly = false,
}) {
  const updateActivity = (value) => {
    setFormData((currentData) => ({
      ...currentData,
      activity: value,
    }));
  };

  return (
    <>
      <div style={{ marginBottom: "15px" }}>
        <SmartSelect
          label="Activity *"
          value={formData.activity ?? ""}
          options={OPTIONS.cardio ?? []}
          disabled={readOnly}
          onChange={updateActivity}
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
