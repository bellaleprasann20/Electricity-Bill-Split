import { useBill } from '../context/BillContext';
import { calcRatePerUnit } from '../utils/calculations';
import { formatRate } from '../utils/formatters';

const BillInput = () => {
  const { totalBill, setTotalBill, totalUnits, setTotalUnits, splitMode, setSplitMode } = useBill();
  const rate = calcRatePerUnit(totalBill, totalUnits);

  return (
    <div className="bill-input-section">
      <div className="bill-cards-row">
        <div className="bill-card">
          <label className="bill-label">Total Bill Amount</label>
          <div className="bill-input-wrap">
            <span className="currency-symbol">₹</span>
            <input
              type="number"
              className="bill-number-input"
              value={totalBill}
              min="0"
              onChange={e => setTotalBill(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="bill-sub">this month's total</div>
        </div>

        <div className="bill-card">
          <label className="bill-label">Units Consumed</label>
          <div className="bill-input-wrap">
            <input
              type="number"
              className="bill-number-input"
              value={totalUnits}
              min="1"
              onChange={e => setTotalUnits(parseFloat(e.target.value) || 1)}
            />
            <span className="currency-symbol">kWh</span>
          </div>
          <div className="bill-sub">rate: {formatRate(rate)}/unit</div>
        </div>
      </div>

      <div className="split-mode-row">
        <span className="split-label">Split by</span>
        <div className="split-toggle">
          {[
            { value: 'equal', label: 'Equal share' },
            { value: 'days', label: 'Days stayed' },
            { value: 'units', label: 'Units used' },
          ].map(opt => (
            <button
              key={opt.value}
              className={`split-opt ${splitMode === opt.value ? 'active' : ''}`}
              onClick={() => setSplitMode(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BillInput;