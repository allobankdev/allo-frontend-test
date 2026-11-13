export const FALLBACK = 'N/A'

export const formatText = (v?: string | null) => (v?.trim() ? v : FALLBACK)

export const formatCost = (v?: string | number | null) => {
  const n = Number(v)
  return v && !Number.isNaN(n)
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
    : FALLBACK
}

export const formatDate = (v?: string | null) =>
  v ? new Date(v).toLocaleDateString('en-US', { dateStyle: 'long', timeZone: 'UTC' }) : FALLBACK