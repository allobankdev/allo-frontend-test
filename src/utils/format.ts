const FALLBACK = 'Not available'

export function formatCost(value: number | string | null | undefined): string {
  const amount = Number(value)
  if (value === null || value === undefined || value === '' || Number.isNaN(amount)) return FALLBACK
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return FALLBACK
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return FALLBACK
  return date.toLocaleDateString('en-US', { dateStyle: 'long', timeZone: 'UTC' })
}

export function formatText(value: string | null | undefined): string {
  return value && value.trim() ? value : FALLBACK
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error && error.message ? error.message : 'Something went wrong.'
}
