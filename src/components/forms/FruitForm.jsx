import { OPTIONS } from "../../constants/options";
import SmartSelect from "../common/SmartSelect/SmartSelect";

export default function FruitForm({ formData, setFormData, readOnly = false }) {
  const fruitType = formData.fruitType ?? "";
  const servings = formData.servings ?? "";

  const updateField = (field, value) => {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
  };

  return (
    <>
      <div style={{ marginBottom: "15px" }}>
        <SmartSelect
          label="Fruit *"
          value={fruitType}
          options={OPTIONS.fruit ?? []}
          disabled={readOnly}
          onChange={(value) => updateField("fruitType", value)}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="fruit-servings">
          <strong>Servings *</strong>
        </label>

        <input
          id="fruit-servings"
          name="servings"
          type="number"
          min="1"
          step="1"
          inputMode="numeric"
          disabled={readOnly}
          value={servings}
          placeholder="1"
          onChange={(event) => {
            const value = event.target.value;

            updateField("servings", value === "" ? "" : Number(value));
          }}
          onWheel={(event) => event.currentTarget.blur()}
        />
      </div>
    </>
  );
}
