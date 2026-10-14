/**
 * utils/formatters.ts
 *
 * Display text for optional rocket values, so the UI never shows
 * "null", "undefined" or "Invalid Date".
 */

import { parseDate } from './parsers'

const NOT_AVAILABLE = 'N/A'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

// Date-only values ("2006-03-24") are parsed as UTC midnight, so format in UTC too,
// otherwise users west of UTC would see the previous day.
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'long',
  timeZone: 'UTC',
})

export function formatDescription (description: string | null): string {
  return description ?? 'Description unavailable'
}

export function formatLaunchCost (cost: number | null): string {
  return cost === null ? NOT_AVAILABLE : currencyFormatter.format(cost)
}

export function formatCountry (country: string | null): string {
  return country ?? NOT_AVAILABLE
}

export function formatFirstFlight (value: string | null): string {
  const date = parseDate(value)
  return date ? dateFormatter.format(date) : NOT_AVAILABLE
}
