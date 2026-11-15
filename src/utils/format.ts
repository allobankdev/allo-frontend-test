export function launchCost(value: string | null): string {
  if (value === null || value.trim() === '') return 'Not available'
  const number = Number(value)
  if (!Number.isFinite(number) || number < 0) return value
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 2,
  }).format(number)
}

export function flightDate(value: string | null): string {
  if (!value) return 'Not available'
  // Parse calendar dates at midnight UTC to avoid shifting the day between time zones.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  const date = new Date(value + 'T00:00:00Z')
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(date)
}
