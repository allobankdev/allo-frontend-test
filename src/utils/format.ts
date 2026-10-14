export const MISSING_COST_LABEL = 'Not disclosed'
export const MISSING_DATE_LABEL = 'Unknown'
export const MISSING_DESCRIPTION_LABEL = 'No description available.'
export const MISSING_TEXT_LABEL = '—'

export function isMissing (value: unknown): boolean {
  return value === null || value === undefined || (typeof value === 'string' && value.trim() === '')
}

export function formatLaunchCost (launchCost: string | null | undefined): string {
  if (isMissing(launchCost)) return MISSING_COST_LABEL
  const amount = Number(String(launchCost).replace(/[^0-9.]/g, ''))
  if (!Number.isFinite(amount) || amount <= 0) return MISSING_COST_LABEL
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatMaidenFlight (maidenFlight: string | null | undefined): string {
  if (isMissing(maidenFlight)) return MISSING_DATE_LABEL
  const date = new Date(String(maidenFlight))
  if (Number.isNaN(date.getTime())) return MISSING_DATE_LABEL
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function formatDescription (description: string | null | undefined): string {
  if (isMissing(description)) return MISSING_DESCRIPTION_LABEL
  return String(description)
}

export function countryLabel (countryCode: string | null | undefined): string {
  if (isMissing(countryCode)) return MISSING_TEXT_LABEL
  return String(countryCode)
}

export function familyLabel (family: string | null | undefined): string {
  if (isMissing(family)) return MISSING_TEXT_LABEL
  return String(family)
}
