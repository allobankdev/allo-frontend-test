// Text shown whenever a value is missing from the API.
const FALLBACK = 'Unknown'

/** Formats a USD amount, e.g. 50000000 -> "$50,000,000". */
export function formatCost (value: number | null): string {
  if (value === null) return FALLBACK
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0, // launch costs are whole dollars, no cents needed
  }).format(value)
}

/** Formats an ISO date, e.g. "2018-02-06" -> "February 6, 2018". */
export function formatDate (iso: string | null): string {
  if (!iso) return FALLBACK
  // Parse as UTC so the displayed day never shifts with the viewer's timezone.
  const date = new Date(`${iso}T00:00:00Z`)
  // An unparsable string gives an "Invalid Date"; show the fallback instead.
  if (Number.isNaN(date.getTime())) return FALLBACK
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

/** Returns the text, or a fallback when it is null, empty, or only spaces. */
export function formatText (value: string | null, fallback = FALLBACK): string {
  return value?.trim() ? value : fallback
}
