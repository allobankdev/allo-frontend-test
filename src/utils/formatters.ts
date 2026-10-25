export function formatLaunchCost (cost: string | null | undefined): string {
  if (!cost) return 'N/A'

  const numericCost = Number(cost)
  if (Number.isNaN(numericCost)) return cost

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(numericCost)
}

export function formatDate (date: string | null | undefined): string {
  if (!date) return 'N/A'

  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return date

  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatText (value: string | null | undefined, fallback = 'N/A'): string {
  if (!value?.trim()) return fallback
  return value
}
