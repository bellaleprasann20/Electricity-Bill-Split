import { useBill } from '../context/BillContext';
import { calcShares, calcAmounts } from '../utils/calculations';
import { formatCurrency } from '../utils/formatters';

const SummaryCards = () => {
  const { totalBill, people, splitMode } = useBill();
  const shares = calcShares(people, splitMode);
  const amounts = calcAmounts(totalBill, shares);
  const avg = amounts.reduce((a, b) => a + b, 0) / (amounts.length || 1);
  const max = Math.max(...amounts);
  const min = Math.min(...amounts);
  const maxPerson = people[amounts.indexOf(max)];
  const minPerson = people[amounts.indexOf(min)];

  const cards = [
    { label: 'Total Bill', value: formatCurrency(totalBill), sub: 'this month' },
    { label: 'Average Share', value: formatCurrency(avg), sub: `across ${people.length} people` },
    { label: 'Highest Share', value: formatCurrency(max), sub: maxPerson?.name || '' },
    { label: 'Lowest Share', value: formatCurrency(min), sub: minPerson?.name || '' },
  ];

  return (
    <div className="summary-grid">
      {cards.map((card, i) => (
        <div className="summary-card" key={i}>
          <div className="summary-label">{card.label}</div>
          <div className="summary-value">{card.value}</div>
          <div className="summary-sub">{card.sub}</div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;