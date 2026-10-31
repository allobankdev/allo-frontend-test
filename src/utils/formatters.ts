export const FALLBACK_ROCKET_IMAGE =
  'https://images.unsplash.com/photo-1517976487502-5731c3497ab0?auto=format&fit=crop&w=800&q=80'

export function formatCurrency(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') {
    return 'N/A'
  }

  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) {
    return String(value)
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(num)
}

export function formatDate(value: string | null | undefined): string {
  if (!value) {
    return 'N/A'
  }

  try {
    const date = new Date(value)
    if (isNaN(date.getTime())) {
      return value
    }

    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date)
  } catch {
    return value
  }
}
