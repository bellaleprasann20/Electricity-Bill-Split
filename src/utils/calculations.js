export const calcMonthlyKwh = (watts, hoursPerDay) =>
  (watts * hoursPerDay * 30) / 1000;

export const calcShares = (people, splitMode) => {
  if (splitMode === 'equal') {
    const totalDays = people.reduce((s, p) => s + (p.days || 30), 0) || 1;
    return people.map(p => (p.days || 30) / totalDays);
  }
  if (splitMode === 'units') {
    const totalUnits = people.reduce((s, p) => s + (p.units || 0), 0) || 1;
    return people.map(p => (p.units || 0) / totalUnits);
  }
  return people.map(() => 1 / people.length);
};

export const calcAmounts = (totalBill, shares) =>
  shares.map(s => s * totalBill);

export const calcRatePerUnit = (totalBill, totalUnits) =>
  totalUnits > 0 ? totalBill / totalUnits : 0;

export const calcApplianceStats = (appliances, ratePerUnit) => {
  const totalKwh = appliances.reduce((s, a) => s + calcMonthlyKwh(a.watts, a.hours), 0);
  const totalCost = totalKwh * ratePerUnit;
  const topAppliance = [...appliances].sort(
    (a, b) => calcMonthlyKwh(b.watts, b.hours) - calcMonthlyKwh(a.watts, a.hours)
  )[0];
  return { totalKwh, totalCost, topAppliance };
};