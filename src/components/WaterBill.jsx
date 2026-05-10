import { useLocalStorage } from '../hooks/useLocalStorage';
import { getPersonColor } from '../utils/colors';
import { getInitials, formatCurrency } from '../utils/formatters';

const SPLIT_MODES = [
  { value: 'equal', label: '⚖️ Equal' },
  { value: 'days',  label: '📅 Days Stayed' },
];

const MODE_EXPLAIN = {
  equal: 'Everyone pays the same amount regardless of usage.',
  days:  'Person away for 7 days pays less. Enter actual days stayed this month.',
};

const safePerson = (p, index) => ({
  id:   p.id   || Date.now() + index,
  name: p.name || `Person ${index + 1}`,
  days: p.days || 30,
});

const DEFAULT_PEOPLE = [
  { id: 1, name: 'Rahul', days: 30 },
  { id: 2, name: 'Priya', days: 30 },
  { id: 3, name: 'Arjun', days: 30 },
];

const WaterBill = () => {
  const [totalBill, setTotalBill] = useLocalStorage('water_bill', 300);
  const [splitMode, setSplitMode] = useLocalStorage('water_mode', 'equal');
  const [rawPeople, setPeople] = useLocalStorage('water_people', DEFAULT_PEOPLE);

  const people = rawPeople.map(safePerson);

  const addPerson = () => {
    setPeople(prev => [
      ...prev,
      { id: Date.now(), name: `Person ${prev.length + 1}`, days: 30 },
    ]);
  };

  const updatePerson = (id, field, value) => {
    setPeople(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const removePerson = (id) => {
    if (people.length > 1) setPeople(prev => prev.filter(p => p.id !== id));
  };

  const calcShares = () => {
    if (splitMode === 'days') {
      const total = people.reduce((s, p) => s + (p.days || 30), 0) || 1;
      return people.map(p => (p.days || 30) / total);
    }
    return people.map(() => 1 / people.length);
  };

  const shares = calcShares();
  const amounts = shares.map(s => s * totalBill);
  const maxAmount = Math.max(...amounts);

  return (
    <div className="bill-tab-section">

      <div className="bill-tab-header water-header">
        <span className="bill-tab-icon">💧</span>
        <div>
          <div className="bill-tab-title">Water Bill Splitter</div>
          <div className="bill-tab-sub">Split your monthly water charges fairly</div>
        </div>
      </div>

      <div className="bill-card" style={{ marginBottom: '1rem' }}>
        <label className="bill-label">Total Water Bill</label>
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
        <div className="bill-sub">enter total amount from your water bill</div>
      </div>

      <div className="bill-card" style={{ marginBottom: '1.5rem' }}>
        <label className="bill-label">Split Mode</label>
        <div className="split-toggle" style={{ marginTop: '10px' }}>
          {SPLIT_MODES.map(opt => (
            <button
              key={opt.value}
              className={`split-opt ${splitMode === opt.value ? 'active' : ''}`}
              onClick={() => setSplitMode(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="mode-explain" style={{ marginTop: '10px' }}>
          {MODE_EXPLAIN[splitMode]}
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

                  <div className={`field-group ${splitMode !== 'days' ? 'dimmed' : ''}`}>
                    <label className="field-label">📅 Days stayed</label>
                    <input
                      type="number"
                      className="field-input"
                      value={person.days}
                      min="1"
                      max="31"
                      disabled={splitMode !== 'days'}
                      onChange={e => updatePerson(person.id, 'days', parseInt(e.target.value) || 1)}
                    />
                    {splitMode === 'days' && person.days < 30 && (
                      <div style={{ fontSize: '10px', color: '#22c55e', marginTop: '4px' }}>
                        Away for {30 - person.days} days 👍
                      </div>
                    )}
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
                          {splitMode === 'days' && `${person.days} days · `}
                          <span className="pct-badge" style={{ background: color.bg, color: color.text }}>
                            {pct}%
                          </span>
                        </div>
                        <div className="result-bar-wrap">
                          <div className="result-bar" style={{ width: `${barWidth}%`, background: color.dot }} />
                        </div>
                      </div>
                    </div>
                    <div className="result-amount" style={{ color: color.dot }}>
                      {formatCurrency(amount)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="tips-card water-tips">
            <div className="tips-title">💡 Water Saving Tips</div>
            <div className="tip-item">🚿 Shorter showers save 50L per day</div>
            <div className="tip-item">🪣 Fix leaks — 1 drip/sec wastes 30L/day</div>
            <div className="tip-item">🌿 Water plants in morning to reduce evaporation</div>
            <div className="tip-item">🧺 Run washing machine only when full</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WaterBill;