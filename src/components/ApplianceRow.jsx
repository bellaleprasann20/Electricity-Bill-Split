import { useBill } from '../context/BillContext';
import { calcMonthlyKwh } from '../utils/calculations';
import { formatCurrency, formatUnits } from '../utils/formatters';
import { calcRatePerUnit } from '../utils/calculations';

const ApplianceRow = ({ appliance, index, color }) => {
  const { updateAppliance, removeAppliance, appliances, totalBill, totalUnits } = useBill();
  const rate = calcRatePerUnit(totalBill, totalUnits);
  const kwh = calcMonthlyKwh(appliance.watts, appliance.hours);
  const cost = kwh * rate;

  return (
    <div className="appliance-row">
      <div className="appliance-color-dot" style={{ background: color }} />
      <input
        type="text"
        className="field-input appliance-name-input"
        value={appliance.name}
        onChange={e => updateAppliance(appliance.id, 'name', e.target.value)}
      />
      <div className="appliance-number-group">
        <input
          type="number"
          className="field-input small-input"
          value={appliance.watts}
          min="0"
          onChange={e => updateAppliance(appliance.id, 'watts', parseFloat(e.target.value) || 0)}
        />
        <span className="field-unit">W</span>
      </div>
      <div className="appliance-number-group">
        <input
          type="number"
          className="field-input small-input"
          value={appliance.hours}
          min="0"
          max="24"
          step="0.5"
          onChange={e => updateAppliance(appliance.id, 'hours', parseFloat(e.target.value) || 0)}
        />
        <span className="field-unit">h/day</span>
      </div>
      <div className="appliance-calc">
        <span className="calc-kwh">{formatUnits(kwh)}</span>
        <span className="calc-cost">{formatCurrency(cost)}</span>
      </div>
      {appliances.length > 1 && (
        <button className="remove-btn" onClick={() => removeAppliance(appliance.id)}>×</button>
      )}
    </div>
  );
};

export default ApplianceRow;