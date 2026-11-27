export function formatLaunchCost (cost: string | number | null | undefined): string {
  if (cost === null || cost === undefined || cost === '') {
    return 'Not available'
  }

  const numericCost = Number(cost)
  if (Number.isNaN(numericCost)) {
    return 'Not available'
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(numericCost)
}

export function formatFirstFlight (dateStr: string | null | undefined): string {
  if (!dateStr) {
    return 'Not available'
  }

  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) {
    return dateStr
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function formatCountry (countryCode: string | null | undefined): string {
  return countryCode?.trim() || 'Not available'
}

export function formatText (value: string | null | undefined, fallback = 'No description available.'): string {
  return value?.trim() || fallback
}