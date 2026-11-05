/**
 * Formats a monetary amount into a readable USD currency string.
 * Gracefully handles null, empty, or non-numeric inputs.
 */
export function formatCurrency(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') {
    return 'N/A'
  }

  const numericValue = typeof value === 'number' ? value : parseFloat(value.replace(/[^0-9.-]+/g, ''))
  if (isNaN(numericValue)) {
    return 'N/A'
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(numericValue)
}

/**
 * Formats an ISO date string (YYYY-MM-DD) into a human-readable date.
 * Gracefully returns "N/A" for null or invalid dates.
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) {
    return 'N/A'
  }

  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    return dateString || 'N/A'
  }

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

/**
 * Returns the provided value or a fallback string (default: "N/A").
 */
export function formatFallback(value: string | number | null | undefined, fallback = 'N/A'): string {
  if (value === null || value === undefined || value === '') {
    return fallback
  }
  return String(value)
}

/**
 * Truncates text with an ellipsis if it exceeds the maximum length.
 */
export function truncateText(text: string | null | undefined, maxLength = 160): string {
  if (!text) return 'No description available for this vehicle.'
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

