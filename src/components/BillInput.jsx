import { useBill } from '../context/BillContext';

const BillInput = () => {
  const { totalBill, setTotalBill, splitMode, setSplitMode } = useBill();

  return (
    <div className="bill-input-section">

      <div className="bill-card" style={{ marginBottom: '1rem' }}>
        <label className="bill-label">Total Electricity Bill</label>
        <div className="bill-input-wrap">
          <span className="currency-symbol">₹</span>
          <input
            type="number"
            className="bill-number-input"
            value={totalBill}
            min="0"
            onChange={e => setTotalBill(parseFloat(e.target.value) || 0)}
            placeholder="0"
          />
        </div>
        <div className="bill-sub">enter the total amount from your electricity bill</div>
      </div>

      <div className="bill-hint-card">
        <div className="hint-title">📄 Where to find the amount?</div>
        <div className="hint-steps">
          <div className="hint-step">
            <span className="hint-num">1</span>
            <span>Open your electricity bill paper or app</span>
          </div>
          <div className="hint-step">
            <span className="hint-num">2</span>
            <span>Look for <strong>"Net Amount Payable"</strong> or <strong>"Total Due"</strong></span>
          </div>
          <div className="hint-step">
            <span className="hint-num">3</span>
            <span>Enter that number above ☝️</span>
          </div>
        </div>
      </div>

      <div className="split-mode-row">
        <span className="split-label">Split by</span>
        <div className="split-toggle">
          {[
            { value: 'equal', label: '⚖️ Equal' },
            { value: 'days', label: '📅 Days stayed' },
            { value: 'rooms', label: '🚪 Room size' },
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

      {splitMode === 'days' && (
        <div className="mode-explain">
          📅 People who stayed fewer days pay less. Enter each person's days below.
        </div>
      )}
      {splitMode === 'rooms' && (
        <div className="mode-explain">
          🚪 People with bigger rooms pay more. Enter room size (1=small, 2=medium, 3=large) below.
        </div>
      )}
      {splitMode === 'equal' && (
        <div className="mode-explain">
          ⚖️ Everyone pays the exact same amount. Simplest and most common method.
        </div>
      )}

    </div>
  );
};

export default BillInput;