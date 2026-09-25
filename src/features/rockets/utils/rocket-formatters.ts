export function displayValue (
  value: string | number | null | undefined,
  fallback = 'Tidak tersedia',
): string {
  if (value === null || value === undefined || value === '') return fallback
  return String(value)
}

export function formatLaunchCost (value: string | null | undefined): string {
  if (!value) return 'Tidak tersedia'

  const amount = Number(value)
  if (!Number.isFinite(amount)) return value

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatFlightDate (value: string | null | undefined): string {
  if (!value) return 'Belum tersedia'

  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}
