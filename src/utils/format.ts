export function formatCurrency(value?: string | number | null): string {
  if (value === null || value === undefined || value === '') {
    return 'N/A'
  }
  const numericValue = typeof value === 'string' ? Number(value) : value
  if (Number.isNaN(numericValue) || numericValue <= 0) {
    return 'N/A'
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(numericValue)
}

export function formatDate(dateStr?: string | null): string {
  if (!dateStr || dateStr.trim() === '') {
    return 'Unknown'
  }
  try {
    const parsed = new Date(dateStr)
    if (Number.isNaN(parsed.getTime())) {
      return dateStr
    }
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(parsed)
  } catch {
    return dateStr
  }
}

export function fallbackText(value?: string | null, fallback = 'Unknown'): string {
  if (!value || value.trim() === '') {
    return fallback
  }
  return value.trim()
}
