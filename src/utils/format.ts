const FALLBACK = 'N/A'

export function displayText (value: string | null | undefined): string {
  const trimmed = value?.trim()
  return trimmed ? trimmed : FALLBACK
}

export function formatLaunchCost (value: string | null | undefined): string {
  if (!value?.trim()) return FALLBACK

  const amount = Number(value)
  if (Number.isNaN(amount)) return value

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate (value: string | null | undefined): string {
  if (!value?.trim()) return FALLBACK

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}
