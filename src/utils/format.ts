/** Text shown in place of any value the API did not provide. */
export const UNAVAILABLE_TEXT = 'Not available'

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const longDate = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

export function formatCost(value: number | null): string {
  return value === null ? UNAVAILABLE_TEXT : usd.format(value)
}

/** Formats a date-only (YYYY-MM-DD) or full ISO string. Returns the raw input if it cannot be parsed. */
export function formatDate(value: string | null): string {
  if (!value) return UNAVAILABLE_TEXT
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00Z`) : new Date(value)
  return Number.isNaN(date.getTime()) ? value : longDate.format(date)
}
