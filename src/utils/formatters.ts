export function formatLaunchCost(cost: string | number | null | undefined): string {
  if (cost === null || cost === undefined || cost === '') {
    return 'N/A'
  }
  const numericCost = typeof cost === 'string' ? parseFloat(cost) : cost
  if (isNaN(numericCost)) {
    return 'N/A'
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(numericCost)
}

export function formatFlightDate(dateStr: string | null | undefined): string {
  if (!dateStr) {
    return 'N/A'
  }
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) {
      return dateStr
    }
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date)
  } catch {
    return dateStr
  }
}

export function fallbackText(value: string | number | null | undefined, fallback = 'N/A'): string {
  if (value === null || value === undefined || value === '') {
    return fallback
  }
  return String(value)
}
