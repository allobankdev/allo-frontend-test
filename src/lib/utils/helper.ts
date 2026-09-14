export function formatCurrency (value: number | string | null): string | null {
  const amount = Number(value)
  if (!amount) return null

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    notation: 'compact',
  }).format(amount)
}

export function formatDate (value: string | null): string | null {
  if (!value) return null

  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
