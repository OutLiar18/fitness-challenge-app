import { OPTIONS } from "../../constants/options";
import SmartSelect from "../common/SmartSelect/SmartSelect";
import DurationPicker from "../common/DurationPicker/DurationPicker";

export default function CardioForm({
  formData,
  setFormData,
  readOnly,
}) {
  return (
    <>
      <div style={{ marginBottom: "15px" }}>
        <label>
          <strong>Activity *</strong>
        </label>

        <SmartSelect
          label="Activity"
          value={formData.activity || ""}
          options={OPTIONS.activity || []}
          disabled={readOnly}
          onChange={(value) =>
            setFormData({
              ...formData,
              activity: value,
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