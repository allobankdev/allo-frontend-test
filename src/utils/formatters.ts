const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const date = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })

export function formatLaunchCost (value: string | null): string {
  if (!value) return 'Not available'
  const number = Number(value)
  return Number.isFinite(number) && number >= 0 ? usd.format(number) : 'Not available'
}

export function formatFirstFlight (value: string | null): string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'Not available'
  const parsed = new Date(`${value}T00:00:00Z`)
  return Number.isNaN(parsed.getTime()) ? 'Not available' : date.format(parsed)
}

export function fallback (value: string | null): string {
  return value || 'Not available'
}
