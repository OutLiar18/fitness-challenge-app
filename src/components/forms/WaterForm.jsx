import FormField from "../common/Form/FormField";
import NumberInput from "../common/Form/NumberInput";

export default function WaterForm({ formData, setFormData, readOnly = false }) {
  return (
    <FormField label="Water" htmlFor="water-amount" required help="Enter the amount in millilitres.">
      <NumberInput
        id="water-amount"
        name="amount"
        min={1}
        step={1}
        inputMode="numeric"
        readOnly={readOnly}
        value={formData.amount}
        placeholder="500"
        required
        onChange={(amount) => setFormData((current) => ({ ...current, amount }))}
      />
    </FormField>
  );
}
