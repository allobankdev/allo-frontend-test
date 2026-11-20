import { ALL_COUNTRIES } from '@/constants/app'
import type { Rocket, RocketSortOption } from '@/types/rocket'

export function compareNullableNumbers (
  a: number | null,
  b: number | null,
  direction: 'asc' | 'desc',
): number {
  if (a === null && b === null) return 0
  if (a === null) return 1
  if (b === null) return -1
  return direction === 'asc' ? a - b : b - a
}

export function parseFlightTimestamp (dateStr: string | null): number | null {
  if (!dateStr) return null
  const ms = Date.parse(`${dateStr}T00:00:00`)
  return Number.isNaN(ms) ? null : ms
}

export function matchesRocketSearch (rocket: Rocket, normalizedQuery: string): boolean {
  if (!normalizedQuery) return true

  return (
    rocket.fullName.toLowerCase().includes(normalizedQuery)
    || (rocket.description ?? '').toLowerCase().includes(normalizedQuery)
    || (rocket.countryCode ?? '').toLowerCase().includes(normalizedQuery)
  )
}

function sortRockets (items: Rocket[], sortBy: RocketSortOption): Rocket[] {
  if (sortBy === 'default') return items

  return [...items].sort((a, b) => {
    if (sortBy === 'name-asc') {
      return a.fullName.localeCompare(b.fullName)
    }
    if (sortBy === 'first-flight-desc') {
      return compareNullableNumbers(
        parseFlightTimestamp(a.maidenFlight),
        parseFlightTimestamp(b.maidenFlight),
        'desc',
      )
    }
    return compareNullableNumbers(a.launchCost, b.launchCost, 'asc')
  })
}

export function filterAndSortRockets (
  rockets: Rocket[],
  searchQuery: string,
  countryFilter: string,
  sortBy: RocketSortOption,
): Rocket[] {
  const normalizedQuery = searchQuery.trim().toLowerCase()

  const matching = rockets.filter((rocket) => {
    if (countryFilter !== ALL_COUNTRIES && rocket.countryCode !== countryFilter) {
      return false
    }
    return matchesRocketSearch(rocket, normalizedQuery)
  })

  return sortRockets(matching, sortBy)
}

export function extractAvailableCountries (rockets: Rocket[]): string[] {
  const codes = new Set<string>()
  for (const rocket of rockets) {
    if (rocket.countryCode) {
      codes.add(rocket.countryCode)
    }
  }
  return [...codes].sort((a, b) => a.localeCompare(b))
}
