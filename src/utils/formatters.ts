/**
 * utils/formatters.ts
 *
 * Formats API values for display. Every helper returns an em dash when the
 * value is missing so the UI never renders "null" or "Invalid Date".
 */

export const EMPTY_VALUE = '—'

export function formatCurrency (value: string | null | undefined): string {
  if (!value) {
    return EMPTY_VALUE
  }

  const amount = Number(value)

  if (!Number.isFinite(amount)) {
    return EMPTY_VALUE
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate (value: string | null | undefined): string {
  if (!value) {
    return EMPTY_VALUE
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return EMPTY_VALUE
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

const regionNames = typeof Intl.DisplayNames === 'function'
  ? new Intl.DisplayNames(['en'], { type: 'region' })
  : null

/**
 * The API returns ISO 3166-1 alpha-3 codes (e.g. "USA"), while
 * Intl.DisplayNames expects alpha-2. Unknown codes simply fall back to the
 * raw value, so the UI never breaks on an unmapped country.
 */
const ALPHA3_TO_ALPHA2: Record<string, string> = {
  ARG: 'AR',
  AUS: 'AU',
  BRA: 'BR',
  CAN: 'CA',
  CHN: 'CN',
  DEU: 'DE',
  ESP: 'ES',
  FRA: 'FR',
  GBR: 'GB',
  IND: 'IN',
  IRN: 'IR',
  ISR: 'IL',
  ITA: 'IT',
  JPN: 'JP',
  KOR: 'KR',
  MEX: 'MX',
  NZL: 'NZ',
  PRK: 'KP',
  RUS: 'RU',
  SWE: 'SE',
  TUR: 'TR',
  UKR: 'UA',
  USA: 'US',
}

export function formatCountry (code: string | null | undefined): string {
  if (!code) {
    return EMPTY_VALUE
  }

  try {
    const regionCode = ALPHA3_TO_ALPHA2[code.toUpperCase()] ?? code
    return regionNames?.of(regionCode) ?? code
  } catch {
    return code
  }
}

export function formatText (
  value: string | null | undefined,
  fallback = EMPTY_VALUE,
): string {
  return value?.trim() || fallback
}
