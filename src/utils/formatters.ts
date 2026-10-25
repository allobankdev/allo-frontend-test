/**
 * Format string cost or number to USD currency format
 * e.g., "7000000" -> "$7,000,000"
 */
export function formatCurrency(cost: string | number | null | undefined): string {
  if (cost === null || cost === undefined || cost === '') {
    return 'N/A'
  }

  const numericCost = typeof cost === 'string' ? parseFloat(cost) : cost

  if (isNaN(numericCost)) {
    return 'N/A'
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(numericCost)
}

/**
 * Format date string to localized human readable date
 * e.g., "2006-03-24" -> "March 24, 2006"
 */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) {
    return 'N/A'
  }

  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) {
      return dateStr
    }
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  } catch {
    return dateStr
  }
}

/**
 * Truncate long text with ellipsis
 */
export function truncateText(text: string | null | undefined, maxLength = 120): string {
  if (!text) {
    return 'No description available.'
  }
  if (text.length <= maxLength) {
    return text
  }
  return text.substring(0, maxLength).trim() + '...'
}

/**
 * Safe image fallback
 */
export const DEFAULT_ROCKET_IMAGE = 'https://images.unsplash.com/photo-1517976487502-5884d9f002b6?auto=format&fit=crop&w=800&q=80'
