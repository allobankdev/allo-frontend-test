export function formatCurrency (value: number | string | null, compact = true): string | null {
  const amount = Number(value)
  if (!amount) return null

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    notation: compact ? 'compact' : 'standard',
  }).format(amount)
}

export function formatNumber (value: number | string | null, unit?: string): string | null {
  const amount = Number(value)
  if (!value && value !== 0) return null
  if (Number.isNaN(amount)) return null

  const formatted = new Intl.NumberFormat('en-US').format(amount)
  return unit ? `${formatted} ${unit}` : formatted
}

export function formatDate (value: string | null): string | null {
  if (!value) return null

  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
