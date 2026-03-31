import { useBill } from '../context/BillContext';
import { useLocalStorage } from '../hooks/useLocalStorage';

const BudgetAlert = () => {
  const { totalBill } = useBill();
  const [budget, setBudget] = useLocalStorage('ebs_budget', 1500);

  const percentage = Math.min((totalBill / budget) * 100, 100);
  const remaining = budget - totalBill;
  const isOver = totalBill > budget;
  const isWarning = percentage >= 80 && !isOver;

  const getColor = () => {
    if (isOver) return '#f43f5e';
    if (isWarning) return '#f59e0b';
    return '#22c55e';
  };

  const getMessage = () => {
    if (isOver) return `🚨 Over budget by ₹${Math.abs(remaining).toLocaleString('en-IN')}!`;
    if (isWarning) return `⚠️ Almost at limit! ₹${remaining.toLocaleString('en-IN')} left`;
    return `✅ ₹${remaining.toLocaleString('en-IN')} under budget`;
  };

  return (
    <div className="budget-card">
      <div className="budget-header">
        <span className="budget-title">Monthly Budget</span>
        <div className="budget-input-wrap">
          <span className="budget-rs">₹</span>
          <input
            type="number"
            className="budget-input"
            value={budget}
            min="0"
            onChange={e => setBudget(parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className="budget-bar-wrap">
        <div
          className="budget-bar-fill"
          style={{
            width: `${percentage}%`,
            background: getColor(),
            transition: 'width 0.6s ease, background 0.4s ease',
          }}
        />
      </div>

      <div className="budget-footer">
        <span className="budget-message" style={{ color: getColor() }}>
          {getMessage()}
        </span>
        <span className="budget-pct" style={{ color: getColor() }}>
          {percentage.toFixed(0)}%
        </span>
      </div>

      <div className="budget-amounts">
        <span>Bill: <strong>₹{totalBill.toLocaleString('en-IN')}</strong></span>
        <span>Budget: <strong>₹{budget.toLocaleString('en-IN')}</strong></span>
      </div>
    </div>
  );
};

export default BudgetAlert;