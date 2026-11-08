/**
 * Display formatters. Each one returns `null` for missing input so the
 * caller decides how to show "not available".
 */

import { COUNTRY_NAMES } from '@/constants/countries'

const LOCALE = 'en-US'

const currencyFull = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const currencyCompact = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
})

const dateLong = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'long', timeZone: 'UTC' })

const numberFormat = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 2 })

export const NOT_AVAILABLE = 'Not available'

export function formatCurrency (value: number | null, options: { compact?: boolean } = {}): string | null {
  if (value === null) return null
  return (options.compact ? currencyCompact : currencyFull).format(value)
}

/** Formats `YYYY-MM-DD` in UTC so the day never shifts with the viewer's timezone. */
export function formatDate (isoDate: string | null): string | null {
  if (!isoDate) return null
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return Number.isNaN(date.getTime()) ? null : dateLong.format(date)
}

export function formatYear (isoDate: string | null): string | null {
  return isoDate ? isoDate.slice(0, 4) : null
}

export function formatCountries (codes: readonly string[]): string | null {
  if (codes.length === 0) return null
  return codes.map(code => COUNTRY_NAMES[code] ?? code).join(', ')
}

export function formatQuantity (value: number | null, unit: string): string | null {
  if (value === null) return null
  return `${numberFormat.format(value)} ${unit}`
}
