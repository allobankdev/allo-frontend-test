export const NOT_AVAILABLE = 'Not available'

export function formatCost (value: number | null): string {
  return value == null
    ? NOT_AVAILABLE
    : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

export function formatDate (iso: string | null): string {
  if (!iso) return NOT_AVAILABLE
  const date = new Date(iso)
  return Number.isNaN(date.getTime())
    ? NOT_AVAILABLE
    : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function formatText (value: string | null, fallback = NOT_AVAILABLE): string {
  return value || fallback
}
