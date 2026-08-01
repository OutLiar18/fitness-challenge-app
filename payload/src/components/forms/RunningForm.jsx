import DurationPicker from "../common/DurationPicker";
import FormField from "../common/Form/FormField";
import NumberInput from "../common/Form/NumberInput";

export default function RunningForm({
  formData,
  setFormData,
  readOnly = false,
}) {
  return (
    <>
      <FormField label="Distance (km)" htmlFor="running-distance" required>
        <NumberInput
          id="running-distance"
          name="distance"
          step={0.01}
          min={0.01}
          inputMode="decimal"
          readOnly={readOnly}
          placeholder="5"
          value={formData.distance}
          required
          onChange={(distance) =>
            setFormData((current) => ({
              ...current,
              distance,
            }))
          }
        />
      </FormField>

      <DurationPicker
        formData={formData}
        setFormData={setFormData}
        readOnly={readOnly}
      />

      <p className="form-note">
        Running points require at least 3 km at 11:00/km or faster. Every saved
        run still contributes its duration to Cardio.
      </p>
    </>
  );
}
