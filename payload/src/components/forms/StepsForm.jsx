import FormField from "../common/Form/FormField";
import NumberInput from "../common/Form/NumberInput";

export default function StepsForm({ formData, setFormData, readOnly = false }) {
  return (
    <FormField label="Steps" htmlFor="steps-amount" required help="Use your phone, watch or best available estimate.">
      <NumberInput
        id="steps-amount"
        name="steps"
        min={1}
        step={1}
        inputMode="numeric"
        readOnly={readOnly}
        value={formData.steps}
        placeholder="10000"
        required
        onChange={(steps) => setFormData((current) => ({ ...current, steps }))}
      />
    </FormField>
  );
}
