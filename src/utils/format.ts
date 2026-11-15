/**
 * utils/format.ts
 *
 * Display formatters. Each returns `null` for missing/invalid input so the UI
 * can render its own fallback text.
 */

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })

// LL2 dates are calendar dates ("2018-05-11"); format in UTC to avoid off-by-one days.
const dateFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' })

function parseDate (iso: string | null): Date | null {
  if (!iso) return null
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatCurrency (value: number | null): string | null {
  return value === null ? null : currencyFormatter.format(value)
}

/** e.g. `formatNumber(22800, 'kg')` → "22,800 kg". */
export function formatNumber (value: number | null, unit = ''): string | null {
  if (value === null) return null
  const formatted = numberFormatter.format(value)
  return unit ? `${formatted} ${unit}` : formatted
}

export function formatDate (iso: string | null): string | null {
  const date = parseDate(iso)
  return date ? dateFormatter.format(date) : null
}

export function formatYear (iso: string | null): string | null {
  const date = parseDate(iso)
  return date ? String(date.getUTCFullYear()) : null
}

/** Short catalog code: "LV-164" for API rockets, "USR-1A2B" for locally added ones. */
export function formatDesignation (rocket: { id: string, isLocal: boolean }): string {
  if (!rocket.isLocal) return `LV-${rocket.id}`
  return `USR-${rocket.id.replace(/^local-/, '').slice(0, 4).toUpperCase()}`
}

/** Success rate in percent with one decimal, or `null` when there is nothing to rate. */
export function getSuccessRate (successes: number, attempts: number): number | null {
  if (attempts <= 0) return null
  return Math.round((successes / attempts) * 1000) / 10
}
