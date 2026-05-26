export const formatCurrency = (value, decimals = 0) => {
  if (value === null || value === undefined) return '-';
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const formatNumber = (value, decimals = 0) => {
  if (value === null || value === undefined) return '-';
  return new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const formatPercent = (value, decimals = 1, showSign = true) => {
  if (value === null || value === undefined) return '-';
  const sign = showSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
};

export const formatLargeNumber = (value) => {
  if (value === null || value === undefined) return '-';
  if (Math.abs(value) >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return String(value);
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export const formatShortDate = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }).format(date);
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatKPI = (value, format, unit = '') => {
  switch (format) {
    case 'currency':
      return formatCurrency(value);
    case 'large':
      return formatLargeNumber(value);
    case 'percent':
      return formatPercent(value);
    case 'nps':
      return `${value} ${unit}`;
    case 'number':
    default:
      return formatNumber(value);
  }
};

export const getChangeColor = (change) => {
  if (change > 0) return 'text-success';
  if (change < 0) return 'text-danger';
  return 'text-muted';
};

export const getChangeArrow = (change) => {
  if (change > 0) return '▲';
  if (change < 0) return '▼';
  return '●';
};

export const getSentimentLabel = (score) => {
  if (score >= 70) return { label: 'Pozitif', color: 'text-success', bg: 'bg-success/20' };
  if (score >= 40) return { label: 'Nötr', color: 'text-warning', bg: 'bg-warning/20' };
  return { label: 'Negatif', color: 'text-danger', bg: 'bg-danger/20' };
};

export const getScoreColor = (score) => {
  if (score >= 80) return 'text-success';
  if (score >= 60) return 'text-warning';
  return 'text-danger';
};

export const getScoreBadgeClass = (score) => {
  if (score >= 80) return 'badge-success';
  if (score >= 60) return 'badge-warning';
  return 'badge-danger';
};
