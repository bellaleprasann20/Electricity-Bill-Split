export const PERSON_COLORS = [
  { bg: '#e8f4fd', border: '#3b82f6', text: '#1e40af', dot: '#3b82f6' },
  { bg: '#fef3e2', border: '#f59e0b', text: '#92400e', dot: '#f59e0b' },
  { bg: '#f0fdf4', border: '#22c55e', text: '#166534', dot: '#22c55e' },
  { bg: '#fdf4ff', border: '#a855f7', text: '#6b21a8', dot: '#a855f7' },
  { bg: '#fff1f2', border: '#f43f5e', text: '#881337', dot: '#f43f5e' },
  { bg: '#f0fdfa', border: '#14b8a6', text: '#134e4a', dot: '#14b8a6' },
];

export const getPersonColor = (index) => PERSON_COLORS[index % PERSON_COLORS.length];

export const APPLIANCE_COLORS = [
  '#3b82f6', '#f59e0b', '#22c55e', '#a855f7',
  '#f43f5e', '#14b8a6', '#f97316', '#6366f1',
];