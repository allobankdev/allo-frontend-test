/**
 * src/utils/formatters.ts
 *
 * Presentation formatting helpers for rocket data.
 */

/**
 * Formats a launch cost value into a human-readable USD currency string.
 * e.g., "50000000" -> "$50,000,000"
 */
export function formatCurrency(value: string | number | null | undefined, fallback = '—'): string {
  if (value === null || value === undefined || value === '') {
    return fallback
  }

  const numericValue = typeof value === 'number' ? value : Number(value)
  if (isNaN(numericValue) || numericValue < 0) {
    return String(value) || fallback
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(numericValue)
}

/**
 * Formats an ISO date string into a friendly localized date format.
 * e.g., "2010-06-04" -> "June 4, 2010"
 */
export function formatDate(dateStr: string | null | undefined, fallback = '—'): string {
  if (!dateStr) {
    return fallback
  }

  const date = new Date(dateStr)
  if (isNaN(date.getTime())) {
    return dateStr || fallback
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Formats a country code or name safely with fallback.
 */
export function formatCountry(code: string | null | undefined, fallback = '—'): string {
  if (!code || !code.trim()) {
    return fallback
  }
  return code.trim()
}

/**
 * Safely provides fallback text if string is empty or null.
 */
export function formatText(text: string | null | undefined, fallback = '—'): string {
  if (!text || !text.trim()) {
    return fallback
  }
  return text.trim()
}
