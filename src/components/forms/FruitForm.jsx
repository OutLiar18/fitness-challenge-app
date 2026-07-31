import { getFruitNames } from "../../services/libraries/fruitLibraryService";
import FormField from "../common/Form/FormField";
import NumberInput from "../common/Form/NumberInput";
import SmartSelect from "../common/Selector/SmartSelect";

const FRUIT_OPTIONS = getFruitNames();

export default function FruitForm({ formData, setFormData, readOnly = false }) {
  function updateField(field, value) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  return (
    <>
      <SmartSelect
        label="Fruit"
        required
        value={formData.fruitType ?? ""}
        options={FRUIT_OPTIONS}
        disabled={readOnly}
        onChange={(value) => updateField("fruitType", value)}
      />

      <FormField label="Servings" htmlFor="fruit-servings" required>
        <NumberInput
          id="fruit-servings"
          name="servings"
          min={1}
          step={1}
          inputMode="numeric"
          readOnly={readOnly}
          value={formData.servings}
          placeholder="1"
          required
          onChange={(value) => updateField("servings", value)}
        />
      </FormField>
    </>
  );
}
