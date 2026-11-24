const FALLBACK = 'Not available'

const COUNTRY_NAMES: Record<string, string> = {
  USA: 'United States',
  GBR: 'United Kingdom',
  FRA: 'France',
  DEU: 'Germany',
  CHN: 'China',
  RUS: 'Russia',
  JPN: 'Japan',
  IND: 'India',
  NZL: 'New Zealand',
}

export function formatCost(value: number | null): string {
  if (value === null) return FALLBACK
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDate(value: string | null): string {
  if (value === null) return FALLBACK
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' }).format(date)
}

export function formatCountry(code: string | null): string {
  if (code === null) return FALLBACK
  const key = code.toUpperCase()
  return COUNTRY_NAMES[key] ?? key
}