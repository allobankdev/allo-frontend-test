/**
 * Formats a launch cost number or string into a formatted currency string,
 * or returns a fallback if missing.
 */
export function formatCurrency(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') {
    return 'Not Disclosed'
  }

  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) {
    return String(value)
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(num)
}

/**
 * Formats a date string (e.g. YYYY-MM-DD) into readable format (e.g. Dec 22, 2015),
 * or returns a fallback if missing.
 */
export function formatDate(value: string | null | undefined): string {
  if (!value) return 'Unknown Date'

  try {
    const date = new Date(value)
    if (isNaN(date.getTime())) {
      return value
    }
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date)
  } catch {
    return value
  }
}

/**
 * Graceful fallback text helper
 */
export function fallbackText(value: string | null | undefined, fallback = 'N/A'): string {
  if (!value || !value.trim()) return fallback
  return value.trim()
}

/**
 * Placeholder SVG data URL used when rocket image is missing or fails to load
 */
export const DEFAULT_ROCKET_IMAGE =
  'https://images.unsplash.com/photo-1517976487507-5b3a48e39874?auto=format&fit=crop&w=800&q=80'
