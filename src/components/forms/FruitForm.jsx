import { OPTIONS } from "../../constants/options";
import SmartSelect from "../common/SmartSelect/SmartSelect";

export default function FruitForm({
  formData,
  setFormData,
  readOnly,
}) {
  return (
    <>
      <div style={{ marginBottom: "15px" }}>
        <label>
          <strong>Fruit *</strong>
        </label>

        <SmartSelect
          label="Fruit"
          value={formData.fruitType || ""}
          options={OPTIONS.fruitType || []}
          disabled={readOnly}
          onChange={(value) =>
            setFormData({
              ...formData,
              fruitType: value,
            })
          }
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>
          <strong>Servings *</strong>
        </label>

        <input
          type="number"
          min="1"
          disabled={readOnly}
          value={formData.servings || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              servings: Number(e.target.value),
            })
          }
        />
      </div>
    </>
  );
}