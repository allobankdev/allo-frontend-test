/**
 * Format number or numeric string into currency format (USD)
 */
export const formatCurrency = (value: string | number | null | undefined): string => {
  if (!value) return 'N/A';

  const numericValue = typeof value === 'number' ? value : Number(value);
  if (isNaN(numericValue)) {
    return String(value);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(numericValue);
};

/**
 * Format date string (e.g., '2023-04-20') into a readable format (e.g., 'April 20, 2023')
 */
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Unknown';

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};
