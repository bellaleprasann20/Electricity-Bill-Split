import { useBill } from '../context/BillContext';
import { calcShares, calcAmounts } from '../utils/calculations';
import { formatCurrency, getInitials } from '../utils/formatters';
import { getPersonColor } from '../utils/colors';

const ResultsPanel = () => {
  const { totalBill, people, splitMode } = useBill();
  const shares = calcShares(people, splitMode);
  const amounts = calcAmounts(totalBill, shares);
  const maxAmount = Math.max(...amounts);

  return (
    <div className="results-section">
      <h2 className="section-title">Each person pays</h2>
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
                    {person.days} days
                    {splitMode === 'units' && ` · ${person.units} kWh`}
                    <span className="pct-badge" style={{ background: color.bg, color: color.text }}>
                      {pct}%
                    </span>
                  </div>
                  <div className="result-bar-wrap">
                    <div
                      className="result-bar"
                      style={{ width: `${barWidth}%`, background: color.dot }}
                    />
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
  );
};

export default ResultsPanel;