export const formatCurrency = (amount) => {
  if (!amount) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPercentage = (value) => {
  if (!value && value !== 0) return '0%';
  return `${Math.round(value)}%`;
};

export const formatNumber = (num) => {
  if (!num) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
};

export const formatEligibilityScore = (score) => {
  if (score >= 80) return { label: 'High', color: 'success' };
  if (score >= 50) return { label: 'Medium', color: 'warning' };
  return { label: 'Low', color: 'danger' };
};
