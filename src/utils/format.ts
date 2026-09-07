const FALLBACK = 'Tidak diketahui'

/**
 * Formats the API's numeric-string launch cost (e.g. "50000000") into a
 * readable USD amount. Falls back gracefully when the value is missing or
 * not actually numeric.
 */
export function formatLaunchCost(cost?: string | null): string {
  if (!cost) return FALLBACK
  const amount = Number(cost)
  if (Number.isNaN(amount)) return FALLBACK
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

/** Formats an ISO date string (e.g. "2015-12-22") for display. */
export function formatDate(date?: string | null): string {
  if (!date) return FALLBACK
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return date
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(parsed)
}

export function formatCountry(countryCode?: string | null): string {
  return countryCode?.trim() || FALLBACK
}

export function formatDescription(description?: string | null): string {
  return description?.trim() || 'Deskripsi tidak tersedia.'
}

export function truncate(text: string, maxLength = 120): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trimEnd()}...`
}
