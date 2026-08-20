const FALLBACK = 'Not available'
const DESCRIPTION_FALLBACK = 'Description not available'

export function formatText(
  value: string | number | null | undefined,
  fallback: string = FALLBACK,
): string {
  if (value === null || value === undefined || String(value).trim() === '') {
    return fallback
  }
  return String(value)
}

export function formatDescription(value: string | null | undefined): string {
  return formatText(value, DESCRIPTION_FALLBACK)
}

export function formatCurrency(value: string | number | null | undefined): string {
  if (value === null || value === undefined || String(value).trim() === '') {
    return FALLBACK
  }
  const num = Number(value)
  if (isNaN(num)) return FALLBACK
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(num)
}

export function formatDate(value: string | null | undefined): string {
  if (!value || value.trim() === '') return FALLBACK

  // API returns YYYY-MM-DD; parsing with Date.UTC avoids timezone shifts
  const [year, month, day] = value.split('-').map(Number)
  if (
    !year ||
    !month ||
    !day ||
    isNaN(year) ||
    isNaN(month) ||
    isNaN(day) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return FALLBACK
  }

  const date = new Date(Date.UTC(year, month - 1, day))
  if (isNaN(date.getTime())) return FALLBACK

  // Guard against Date rollover (e.g. invalid days like Feb 31 overflowing into March)
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() + 1 !== month ||
    date.getUTCDate() !== day
  ) {
    return FALLBACK
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}
