export const formatCurrency = (amount) =>
  `₹${Math.round(amount).toLocaleString('en-IN')}`;

export const formatUnits = (units) =>
  `${parseFloat(units).toFixed(1)} kWh`;

export const formatRate = (rate) =>
  `₹${parseFloat(rate).toFixed(2)}`;

export const getInitials = (name) =>
  name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '??';