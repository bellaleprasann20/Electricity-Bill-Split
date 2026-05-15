import { useLocalStorage } from '../hooks/useLocalStorage';
import { getPersonColor } from '../utils/colors';
import { getInitials, formatCurrency } from '../utils/formatters';

const WIFI_PLANS = [
  { name: 'Basic 40 Mbps',     price: 399  },
  { name: 'Standard 100 Mbps', price: 599  },
  { name: 'Fast 200 Mbps',     price: 799  },
  { name: 'Ultra 500 Mbps',    price: 1099 },
  { name: 'Custom',            price: 0    },
];

const DEFAULT_PEOPLE = [
  { id: 1, name: 'Rahul' },
  { id: 2, name: 'Priya' },
  { id: 3, name: 'Arjun' },
];

const WifiBill = () => {
  const [totalBill, setTotalBill] = useLocalStorage('wifi_bill', 599);
  const [selectedPlan, setSelectedPlan] = useLocalStorage('wifi_plan', 'Standard 100 Mbps');
  const [customAmount, setCustomAmount] = useLocalStorage('wifi_custom', 0);
  const [people, setPeople] = useLocalStorage('wifi_people', DEFAULT_PEOPLE);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan.name);
    if (plan.name !== 'Custom') setTotalBill(plan.price);
    else setTotalBill(customAmount || 0);
  };

  const handleCustomAmount = (val) => {
    const num = parseFloat(val) || 0;
    setCustomAmount(num);
    setTotalBill(num);
  };

  const addPerson = () => {
    setPeople(prev => [...prev, { id: Date.now(), name: `Person ${prev.length + 1}` }]);
  };

  const updatePerson = (id, field, value) => {
    setPeople(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const removePerson = (id) => {
    if (people.length > 1) setPeople(prev => prev.filter(p => p.id !== id));
  };

  const share = totalBill / people.length;

  return (
    <div className="bill-tab-section">

      <div className="bill-tab-header wifi-header">
        <span className="bill-tab-icon">📶</span>
        <div>
          <div className="bill-tab-title">WiFi Bill Splitter</div>
          <div className="bill-tab-sub">Select your plan and split equally among roommates</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <label className="bill-label" style={{ marginBottom: '10px', display: 'block' }}>
          Select Internet Plan
        </label>
        <div className="plan-grid">
          {WIFI_PLANS.map(plan => (
            <button
              key={plan.name}
              className={`plan-card ${selectedPlan === plan.name ? 'active' : ''}`}
              onClick={() => handlePlanSelect(plan)}
            >
              <div className="plan-name">{plan.name}</div>
              {plan.price > 0
                ? <div className="plan-price">₹{plan.price}/mo</div>
                : <div className="plan-price" style={{ color: 'var(--text-muted)' }}>Enter amount</div>
              }
            </button>
          ))}
        </div>

        {selectedPlan === 'Custom' && (
          <div style={{ marginTop: '1rem' }}>
            <label className="bill-label" style={{ marginBottom: '6px', display: 'block' }}>
              Enter Your Plan Amount
            </label>
            <div className="bill-input-wrap">
              <span className="currency-symbol">₹</span>
              <input
                type="number"
                className="bill-number-input"
                value={customAmount || ''}
                min="0"
                placeholder="0"
                onChange={e => handleCustomAmount(e.target.value)}
              />
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>/month</span>
            </div>
            <div className="bill-sub" style={{ marginTop: '4px' }}>
              Enter the exact amount from your internet provider bill
            </div>
          </div>
        )}

        <div style={{
          marginTop: '12px',
          padding: '10px 14px',
          background: 'var(--bg-input)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Total bill this month</span>
          <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent)', fontFamily: 'Syne, sans-serif' }}>
            ₹{totalBill}/month
          </span>
        </div>
      </div>

      <div className="bill-card" style={{ marginBottom: '1.5rem' }}>
        <label className="bill-label">Split Mode</label>
        <div style={{ marginTop: '8px' }}>
          <span className="split-opt active">⚖️ Equal Share</span>
        </div>
        <div className="mode-explain" style={{ marginTop: '10px' }}>
          WiFi bill is split equally — everyone uses the same connection and pays the same amount.
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
                      placeholder="Name"
                    />
                    {people.length > 1 && (
                      <button className="remove-btn" onClick={() => removePerson(person.id)}>×</button>
                    )}
                  </div>
                  <div style={{
                    marginTop: '8px',
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    padding: '6px 10px',
                    background: 'var(--bg-input)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                  }}>
                    Pays: <strong style={{ color: 'var(--accent)' }}>{formatCurrency(share)}</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="section-title">Each person pays</h3>
          <div className="results-section">
            <div className="results-list">
              {people.map((person, index) => {
                const color = getPersonColor(index);
                return (
                  <div className="result-item" key={person.id}>
                    <div className="result-left">
                      <div className="avatar" style={{ background: color.bg, color: color.text }}>
                        {getInitials(person.name)}
                      </div>
                      <div className="result-info">
                        <div className="result-name">{person.name}</div>
                        <div className="result-meta">
                          <span className="pct-badge" style={{ background: color.bg, color: color.text }}>
                            {(100 / people.length).toFixed(1)}%
                          </span>
                        </div>
                        <div className="result-bar-wrap">
                          <div className="result-bar" style={{ width: '100%', background: color.dot }} />
                        </div>
                      </div>
                    </div>
                    <div className="result-amount" style={{ color: color.dot }}>
                      {formatCurrency(share)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WifiBill;