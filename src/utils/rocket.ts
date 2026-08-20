import type { Rocket } from '@/types/rocket'

export type RocketFamily = 'all' | 'falcon' | 'starship' | 'other'

const unavailableLabel = 'Not available'

export function getRocketName (rocket: Rocket): string {
  return rocket.full_name?.trim() || 'Unnamed rocket'
}

export function getRocketDescription (rocket: Rocket): string {
  return rocket.description?.trim() || 'No description is available for this rocket.'
}

export function getRocketFamily (rocket: Rocket): Exclude<RocketFamily, 'all'> {
  const name = getRocketName(rocket).toLocaleLowerCase()

  if (name.includes('falcon')) return 'falcon'
  if (name.includes('starship') || name.includes('super heavy')) return 'starship'

  return 'other'
}

export function filterRockets (
  rockets: Rocket[],
  query: string,
  family: RocketFamily,
): Rocket[] {
  const normalizedQuery = query.trim().toLocaleLowerCase()

  return rockets.filter(rocket => {
    const matchesFamily = family === 'all' || getRocketFamily(rocket) === family
    const searchableText = [
      getRocketName(rocket),
      rocket.description,
      rocket.manufacturer?.country_code,
    ]
      .filter(Boolean)
      .join(' ')
      .toLocaleLowerCase()

    return matchesFamily && (!normalizedQuery || searchableText.includes(normalizedQuery))
  })
}

export function formatLaunchCost (value: string | null): string {
  if (!value) return unavailableLabel

  const amount = Number(value)
  if (!Number.isFinite(amount)) return unavailableLabel

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatFirstFlight (value: string | null): string {
  if (!value) return unavailableLabel

  const date = new Date(`${value}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return unavailableLabel

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

export function formatCountry (rocket: Rocket): string {
  return rocket.manufacturer?.country_code?.trim() || unavailableLabel
}

export function isAbortError (error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

export function getRequestErrorMessage (error: unknown): string {
  if (error instanceof TypeError) {
    return 'Check your connection and try again.'
  }

  return error instanceof Error
    ? error.message
    : 'Something went wrong while loading rocket data.'
}
