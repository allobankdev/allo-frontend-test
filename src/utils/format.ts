/**
 * utils/format.ts
 *
 * Small, dependency-free formatting helpers. Every function here is
 * null-safe on purpose — rocket data from the API is frequently
 * missing `launch_cost`, `maiden_flight`, or `image_url`, and the UI
 * requirement is to keep displaying correctly when that happens.
 */

const FALLBACK = 'Not available'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

/** Formats a launch cost in USD, e.g. `52000000` -> "$52,000,000". */
export function formatCurrency (value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return FALLBACK
  return currencyFormatter.format(value)
}

/** Formats an ISO date string, e.g. `2018-05-11` -> "May 11, 2018". */
export function formatDate (value: string | null | undefined): string {
  if (!value) return FALLBACK
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return FALLBACK
  return dateFormatter.format(parsed)
}

/** Returns the given value, or a fallback label when it's empty. */
export function formatText (value: string | null | undefined): string {
  const trimmed = value?.trim()
  return trimmed ? trimmed : FALLBACK
}
