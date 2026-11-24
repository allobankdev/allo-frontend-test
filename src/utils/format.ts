export const NOT_AVAILABLE = 'Not available'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

export function formatLaunchCost (value: number | null): string {
  if (value === null || !Number.isFinite(value)) {
    return NOT_AVAILABLE
  }
  return currencyFormatter.format(value)
}

export function formatMaidenFlight (iso: string | null): string {
  if (!iso || iso.trim().length === 0) {
    return NOT_AVAILABLE
  }
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return NOT_AVAILABLE
  }
  return dateFormatter.format(date)
}

export function formatText (value: string | null, fallback = NOT_AVAILABLE): string {
  if (!value) {
    return fallback
  }
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : fallback
}
