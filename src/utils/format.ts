/**
 * utils/format.ts
 *
 * Display helpers. The API leaves `launch_cost`, `maiden_flight` and
 * `image_url` empty for several rockets, so every formatter here takes a
 * nullable value and returns a placeholder rather than throwing or
 * rendering "null".
 */

/** Shown wherever the API gave us nothing. */
export const NOT_AVAILABLE = 'Not available'

/** Formats a launch cost in USD, e.g. `$50,000,000`. */
export function formatCurrency (value: number | null): string {
  if (value === null || !Number.isFinite(value)) return NOT_AVAILABLE

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

/** Formats an ISO date (`2006-03-24`) as `24 March 2006`. */
export function formatDate (value: string | null): string {
  if (!value) return NOT_AVAILABLE

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return NOT_AVAILABLE

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

/** Returns the text itself, or the placeholder when it is empty. */
export function formatText (value: string | null): string {
  return value?.trim() || NOT_AVAILABLE
}

/** Shortens long descriptions for the list cards. */
export function truncate (value: string, maxLength: number): string {
  if (value.length <= maxLength) return value

  return `${value.slice(0, maxLength).trimEnd()}…`
}
