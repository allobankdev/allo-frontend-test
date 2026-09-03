const FALLBACK = 'Not available'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

export function formatCurrency(value: number | null): string {
  if (value === null || Number.isNaN(value)) return FALLBACK
  return currencyFormatter.format(value)
}

export function formatDate(value: string | null): string {
  if (!value) return FALLBACK
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return FALLBACK
  return dateFormatter.format(parsed)
}