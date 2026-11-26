/**
 * utils/format.ts
 *
 * Null-safe display formatters. Each returns `null` when there is nothing
 * meaningful to show, so the caller decides on the fallback text.
 */

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  // API dates are plain calendar dates; formatting in UTC keeps them from shifting a day.
  timeZone: 'UTC',
})

/** ISO 3166-1 alpha-3 → alpha-2, for the countries that build launch vehicles. */
const ALPHA3_TO_ALPHA2: Record<string, string> = {
  USA: 'US', RUS: 'RU', CHN: 'CN', IND: 'IN', JPN: 'JP', FRA: 'FR', GBR: 'GB', DEU: 'DE',
  ITA: 'IT', ESP: 'ES', KOR: 'KR', PRK: 'KP', ISR: 'IL', IRN: 'IR', IDN: 'ID', NZL: 'NZ',
  AUS: 'AU', CAN: 'CA', BRA: 'BR', UKR: 'UA', KAZ: 'KZ',
}

const regionNames = typeof Intl.DisplayNames === 'function'
  ? new Intl.DisplayNames(['en'], { type: 'region' })
  : null

export function formatCurrency (amount: number | null | undefined): string | null {
  if (amount === null || amount === undefined || !Number.isFinite(amount)) return null
  return currencyFormatter.format(amount)
}

export function formatDate (isoDate: string | null | undefined): string | null {
  if (!isoDate) return null
  const date = new Date(isoDate)
  return Number.isNaN(date.getTime()) ? null : dateFormatter.format(date)
}

/** "USA" → "United States (USA)"; unknown codes are shown as-is. */
export function formatCountry (code: string | null | undefined): string | null {
  const normalized = code?.trim().toUpperCase()
  if (!normalized) return null

  const alpha2 = ALPHA3_TO_ALPHA2[normalized]
  const name = alpha2 ? regionNames?.of(alpha2) : undefined
  return name ? `${name} (${normalized})` : normalized
}
