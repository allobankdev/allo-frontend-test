export function formatCost(cost: string | null | undefined): string {
  if (!cost) return 'N/A'
  const num = Number(cost)
  if (isNaN(num)) return cost
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(num)
}

export function formatFlightDate(dateStr: string | null | undefined, format: 'short' | 'long' = 'short'): string {
  if (!dateStr) return 'N/A'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: format === 'long' ? 'long' : 'short',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}
