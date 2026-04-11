export const calcShares = (people, splitMode) => {
  if (splitMode === 'equal') {
    return people.map(() => 1 / people.length);
  }
  if (splitMode === 'days') {
    const totalDays = people.reduce((s, p) => s + (p.days || 30), 0) || 1;
    return people.map(p => (p.days || 30) / totalDays);
  }
  if (splitMode === 'rooms') {
    const totalRooms = people.reduce((s, p) => s + (p.rooms || 1), 0) || 1;
    return people.map(p => (p.rooms || 1) / totalRooms);
  }
  return people.map(() => 1 / people.length);
};

export const calcAmounts = (totalBill, shares) =>
  shares.map(s => s * totalBill);

export const calcMonthlyKwh = (watts, hoursPerDay) =>
  (watts * hoursPerDay * 30) / 1000;

export const calcApplianceStats = (appliances) => {
  const topAppliance = [...appliances].sort(
    (a, b) => calcMonthlyKwh(b.watts, b.hours) - calcMonthlyKwh(a.watts, a.hours)
  )[0];
  return { topAppliance };
};