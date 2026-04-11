import { useLocalStorage } from '../hooks/useLocalStorage';
import { getPersonColor } from '../utils/colors';
import { getInitials, formatCurrency } from '../utils/formatters';

const WIFI_PLANS = [
  { name: 'Basic 40 Mbps', price: 399 },
  { name: 'Standard 100 Mbps', price: 599 },
  { name: 'Fast 200 Mbps', price: 799 },
  { name: 'Ultra 500 Mbps', price: 1099 },
  { name: 'Custom', price: 0 },
];

const WifiBill = () => {
  const [totalBill, setTotalBill] = useLocalStorage('wifi_bill', 599);
  const [selectedPlan, setSelectedPlan] = useLocalStorage('wifi_plan', 'Standard 100 Mbps');
  const [people, setPeople] = useLocalStorage('wifi_people', [
    { id: 1, name: 'Rahul', devices: 3, usage: 'heavy' },
    { id: 2, name: 'Priya', devices: 2, usage: 'medium' },
    { id: 3, name: 'Arjun', devices: 1, usage: 'light' },
  ]);
  const [splitMode, setSplitMode] = useLocalStorage('wifi_mode', 'equal');

  const USAGE_WEIGHT = { light: 1, medium: 2, heavy: 3 };

  const addPerson = () => {
    setPeople(prev => [...prev, { id: Date.now(), name: `Person ${prev.length + 1}`, devices: 1, usage: 'medium' }]);
  };

  const updatePerson = (id, field, value) => {
    setPeople(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const removePerson = (id) => {
    if (people.length > 1) setPeople(prev => prev.filter(p => p.id !== id));
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan.name);
    if (plan.name !== 'Custom') setTotalBill(plan.price);
  };

  const calcShares = () => {
    if (splitMode === 'equal') return people.map(() => 1 / people.length);
    if (splitMode === 'devices') {
      const total = people.reduce((s, p) => s + (p.devices || 1), 0) || 1;
      return people.map(p => (p.devices || 1) / total);
    }
    if (splitMode === 'usage') {
      const total = people.reduce((s, p) => s + USAGE_WEIGHT[p.usage], 0) || 1;
      return people.map(p => USAGE_WEIGHT[p.usage] / total);
    }
    return people.map(() => 1 / people.length);
  };

  const shares = calcShares();
  const amounts = shares.map(s => s * totalBill);
  const maxAmount = Math.max(...amounts);

  return (
    <div className="bill-tab-section">
      <div className="bill-tab-header wifi-header">
        <span className="bill-tab-icon">📶</span>
        <div>
          <div className="bill-tab-title">WiFi Bill Splitter</div>
          <div className="bill-tab-sub">Split internet charges by usage or devices</div>
        </div>
      </div>

      {/* Plan Selector */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <label className="bill-label" style={{ marginBottom: '10px', display: 'block' }}>Select Internet Plan</label>
        <div className="plan-grid">
          {WIFI_PLANS.map(plan => (
            <button
              key={plan.name}
              className={`plan-card ${selectedPlan === plan.name ? 'active' : ''}`}
              onClick={() => handlePlanSelect(plan)}
            >
              <div className="plan-name">{plan.name}</div>
              {plan.price > 0 && <div className="plan-price">₹{plan.price}/mo</div>}
            </button>
          ))}
        </div>
        {selectedPlan === 'Custom' && (
          <div className="bill-input-wrap" style={{ marginTop: '12px' }}>
            <span className="currency-symbol">₹</span>
            <input
              type="number"
              className="bill-number-input"
              value={totalBill}
              min="0"
              onChange={e => setTotalBill(parseFloat(e.target.value) || 0)}
              placeholder="Enter custom amount"
            />
          </div>
        )}
        {selectedPlan !== 'Custom' && (
          <div style={{ marginTop: '10px', fontSize: '13px', color: 'var(--text-muted)' }}>
            Total bill: <strong style={{ color: 'var(--accent)' }}>₹{totalBill}/month</strong>
          </div>
        )}
      </div>

      {/* Split Mode */}
      <div className="bill-card" style={{ marginBottom: '1rem' }}>
        <label className="bill-label">Split by</label>
        <div className="split-toggle" style={{ marginTop: '8px' }}>
          {[
            { value: 'equal', label: 'Equal' },
            { value: 'devices', label: 'No. of Devices' },
            { value: 'usage', label: 'Usage Level' },
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

      <div className="two-col-layout">
        <div>
          <div className="section-header">
            <h3 className="section-title">Members</h3>
            <button
              className="add-btn"
              style={{ width: 'auto', padding: '6px 14px', marginTop: 0 }}
              onClick={addPerson}
            >
              + Add
            </button>
          </div>
          <div className="roommate-grid">
            {people.map((person, index) => {
              const color = getPersonColor(index);
              return (
                <div key={person.id} className="roommate-card" style={{ borderLeftColor: color.dot }}>
                  <div className="roommate-header">
                    <div className="avatar" style={{ background: color.bg, color: color.text }}>
                      {getInitials(person.name)}
                    </div>
                    <input
                      type="text"
                      className="name-input"
                      value={person.name}
                      onChange={e => updatePerson(person.id, 'name', e.target.value)}
                    />
                    {people.length > 1 && (
                      <button className="remove-btn" onClick={() => removePerson(person.id)}>×</button>
                    )}
                  </div>
                  <div className="roommate-fields">
                    <div className={`field-group ${splitMode !== 'devices' ? 'dimmed' : ''}`}>
                      <label className="field-label">Devices connected</label>
                      <input
                        type="number"
                        className="field-input"
                        value={person.devices}
                        min="1"
                        disabled={splitMode !== 'devices'}
                        onChange={e => updatePerson(person.id, 'devices', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div className={`field-group ${splitMode !== 'usage' ? 'dimmed' : ''}`}>
                      <label className="field-label">Usage level</label>
                      <select
                        className="field-input"
                        value={person.usage}
                        disabled={splitMode !== 'usage'}
                        onChange={e => updatePerson(person.id, 'usage', e.target.value)}
                        style={{
                          background: 'var(--bg-input)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '7px 10px',
                          fontSize: '14px',
                          width: '100%',
                          cursor: splitMode !== 'usage' ? 'not-allowed' : 'pointer',
                        }}
                      >
                        <option value="light">🟢 Light</option>
                        <option value="medium">🟡 Medium</option>
                        <option value="heavy">🔴 Heavy</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="section-title">Each person pays</h3>
          <div className="results-section" style={{ marginBottom: '1rem' }}>
            <div className="results-list">
              {people.map((person, index) => {
                const color = getPersonColor(index);
                const amount = amounts[index] || 0;
                const pct = (shares[index] * 100).toFixed(1);
                const barWidth = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
                return (
                  <div className="result-item" key={person.id}>
                    <div className="result-left">
                      <div className="avatar" style={{ background: color.bg, color: color.text }}>
                        {getInitials(person.name)}
                      </div>
                      <div className="result-info">
                        <div className="result-name">{person.name}</div>
                        <div className="result-meta">
                          {splitMode === 'devices' && `${person.devices} devices · `}
                          {splitMode === 'usage' && `${person.usage} user · `}
                          <span className="pct-badge" style={{ background: color.bg, color: color.text }}>{pct}%</span>
                        </div>
                        <div className="result-bar-wrap">
                          <div className="result-bar" style={{ width: `${barWidth}%`, background: color.dot }} />
                        </div>
                      </div>
                    </div>
                    <div className="result-amount" style={{ color: color.dot }}>{formatCurrency(amount)}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="tips-card wifi-tips">
            <div className="tips-title">📶 WiFi Tips</div>
            <div className="tip-item">📺 Streaming HD video uses ~3GB/hour</div>
            <div className="tip-item">🎮 Online gaming uses ~50MB/hour</div>
            <div className="tip-item">💼 Video calls use ~1.5GB/hour</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WifiBill;