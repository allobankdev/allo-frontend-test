const FALLBACK_TEXT = 'Not available'

export function withFallback(value: string, fallback = FALLBACK_TEXT) {
  if (value === null || value === undefined || value === '') return fallback
  return value
}

export function formatLaunchCost(launchCost: string) {
  return withFallback(launchCost)
}

export function formatDate(dateString: string) {
  if (!dateString) return FALLBACK_TEXT
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return FALLBACK_TEXT
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatCountry(countryCode: string) {
  return withFallback(countryCode)
}

export { FALLBACK_TEXT }
