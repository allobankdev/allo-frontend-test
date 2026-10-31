export const FALLBACK = 'N/A'

export function orFallback (value: string | null | undefined): string {
  return value && value.trim() ? value : FALLBACK
}

export function formatCurrency (value: number | null | undefined): string {
  if (value === null || value === undefined) return FALLBACK
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDate (value: string | null | undefined): string {
  if (!value) return FALLBACK
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return FALLBACK
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(date)
}

