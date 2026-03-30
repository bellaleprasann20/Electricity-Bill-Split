import { useBill } from '../context/BillContext';
import { calcMonthlyKwh, calcRatePerUnit, calcApplianceStats } from '../utils/calculations';
import { formatCurrency, formatUnits } from '../utils/formatters';
import { APPLIANCE_COLORS } from '../utils/colors';
import ApplianceRow from './ApplianceRow';
import UsageBar from './UsageBar';

const ApplianceTracker = () => {
  const { appliances, addAppliance, totalBill, totalUnits } = useBill();
  const rate = calcRatePerUnit(totalBill, totalUnits);
  const { totalKwh, totalCost, topAppliance } = calcApplianceStats(appliances, rate);

  return (
    <div className="appliance-section">
      <div className="appliance-summary-grid">
        <div className="summary-card">
          <div className="summary-label">Estimated units</div>
          <div className="summary-value">{formatUnits(totalKwh)}</div>
          <div className="summary-sub">monthly total</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Estimated bill</div>
          <div className="summary-value">{formatCurrency(totalCost)}</div>
          <div className="summary-sub">at current rate</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Top consumer</div>
          <div className="summary-value" style={{ fontSize: '16px' }}>
            {topAppliance?.name || '—'}
          </div>
          <div className="summary-sub">
            {topAppliance ? formatUnits(calcMonthlyKwh(topAppliance.watts, topAppliance.hours)) : ''}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="appliance-list-header">
          <div className="appliance-col-labels">
            <span />
            <span>Appliance</span>
            <span>Wattage</span>
            <span>Hours/day</span>
            <span>Monthly</span>
            <span />
          </div>
        </div>
        <div className="appliance-list">
          {appliances.map((a, i) => (
            <ApplianceRow
              key={a.id}
              appliance={a}
              index={i}
              color={APPLIANCE_COLORS[i % APPLIANCE_COLORS.length]}
            />
          ))}
        </div>
        <button className="add-btn" onClick={addAppliance}>+ Add appliance</button>
      </div>

      <div className="card">
        <h3 className="card-title">Usage breakdown</h3>
        <UsageBar appliances={appliances} ratePerUnit={rate} />
      </div>
    </div>
  );
};

export default ApplianceTracker;