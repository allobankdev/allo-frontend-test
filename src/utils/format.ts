const FALLBACK = 'Not available'

export function formatCost (cost: string | null | undefined): string {
  if (!cost) return FALLBACK
  const value = Number(cost)
  if (Number.isNaN(value)) return FALLBACK
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDate (isoDate: string | null | undefined): string {
  if (!isoDate) return FALLBACK
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return FALLBACK
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

export function orFallback (value: string | null | undefined, fallback = FALLBACK): string {
  return value && value.trim().length > 0 ? value : fallback
}

export const NOT_AVAILABLE = FALLBACK
