import React from 'react';
import { useBill } from '../context/BillContext';

// --- Internal Helpers to prevent import errors ---
const formatCurrency = (amount) => 
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);

const formatRate = (rate) => 
  `₹${(rate || 0).toFixed(2)}`;

const calcRatePerUnit = (totalBill, totalUnits) => 
  totalUnits > 0 ? totalBill / totalUnits : 0;

const calcShares = (people, splitMode) => {
  if (!people || people.length === 0) return [];
  const totalWeight = people.reduce((acc, p) => 
    acc + (splitMode === 'units' ? Number(p.units || 0) : Number(p.days || 0)), 0);
  
  return people.map(p => {
    const val = splitMode === 'units' ? Number(p.units || 0) : Number(p.days || 0);
    return totalWeight > 0 ? val / totalWeight : 0;
  });
};

const SummaryCards = () => {
  const { totalBill, totalUnits, people, splitMode } = useBill();
  
  // Logic calculations
  const rate = calcRatePerUnit(totalBill, totalUnits);
  const shares = calcShares(people, splitMode);
  const amounts = shares.map(share => share * (totalBill || 0));
  
  const hasPeople = people.length > 0;
  const avg = hasPeople ? (totalBill || 0) / people.length : 0;
  const max = hasPeople ? Math.max(...amounts) : 0;
  const min = hasPeople ? Math.min(...amounts) : 0;

  // Find names for high/low shares
  const maxPerson = hasPeople ? people[amounts.indexOf(max)]?.name : 'N/A';
  const minPerson = hasPeople ? people[amounts.indexOf(min)]?.name : 'N/A';

  const cards = [
    { label: 'Rate per unit', value: formatRate(rate), sub: 'per kWh' },
    { label: 'Average share', value: formatCurrency(avg), sub: `across ${people.length} people` },
    { label: 'Highest share', value: formatCurrency(max), sub: maxPerson },
    { label: 'Lowest share', value: formatCurrency(min), sub: minPerson },
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