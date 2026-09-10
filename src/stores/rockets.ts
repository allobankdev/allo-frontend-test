/**
 * stores/rockets.ts
 *
 * Client-only rocket state: the search filter and the rockets a user adds
 * in-app. Server state (the fetched list) is owned by TanStack Query in
 * `@/queries/rockets`, so a refetch never drops what the user added.
 */

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type {
  CostStatusFilter,
  FlightStatusFilter,
  NewRocketInput,
  Rocket,
} from '@/types/rocket'

/** Parses user-entered cost, tolerating separators like "50,000,000". */
function parseCost (value: string): number | null {
  const digits = value.replace(/[^0-9.]/g, '')
  if (!digits) return null

  const parsed = Number(digits)
  return Number.isFinite(parsed) ? parsed : null
}

/** Matches a rocket against a lowercased search term. */
function matchesQuery (rocket: Rocket, query: string): boolean {
  return rocket.name.toLowerCase().includes(query)
    || (rocket.description?.toLowerCase().includes(query) ?? false)
}

function matchesFlightStatus (rocket: Rocket, status: FlightStatusFilter): boolean {
  if (status === 'flown') return Boolean(rocket.firstFlight)
  if (status === 'not_flown') return !rocket.firstFlight
  return true
}

function matchesCostStatus (rocket: Rocket, status: CostStatusFilter): boolean {
  if (status === 'has_cost') return rocket.launchCost !== null
  if (status === 'no_cost') return rocket.launchCost === null
  return true
}

export const useRocketsStore = defineStore('rockets', () => {
  /** Rockets added by the user. The API is read-only, so they stay in memory. */
  const localRockets = ref<Rocket[]>([])

  const filterQuery = ref('')
  const countryFilter = ref<string | null>(null)
  const flightStatusFilter = ref<FlightStatusFilter>('all')
  const costStatusFilter = ref<CostStatusFilter>('all')

  const hasFilter = computed(() =>
    filterQuery.value.trim().length > 0
    || countryFilter.value !== null
    || flightStatusFilter.value !== 'all'
    || costStatusFilter.value !== 'all',
  )

  /** Country codes present in the data, for the country filter's options. */
  function availableCountries (remoteRockets: Rocket[] | undefined): string[] {
    const codes = new Set<string>()
    for (const rocket of [...localRockets.value, ...(remoteRockets ?? [])]) {
      if (rocket.country) codes.add(rocket.country)
    }
    return [...codes].sort()
  }

  /**
   * Merges user-added rockets with the fetched ones and applies the filter.
   * Local rockets come first so a newly added rocket is easy to spot.
   */
  function filterRockets (remoteRockets: Rocket[] | undefined): Rocket[] {
    const all = [...localRockets.value, ...(remoteRockets ?? [])]
    const query = filterQuery.value.trim().toLowerCase()
    const country = countryFilter.value

    return all.filter(rocket =>
      (!query || matchesQuery(rocket, query))
      && (country === null || rocket.country === country)
      && matchesFlightStatus(rocket, flightStatusFilter.value)
      && matchesCostStatus(rocket, costStatusFilter.value),
    )
  }

  /** Looks up a user-added rocket, which never exists on the API. */
  function findLocalRocket (id: string): Rocket | undefined {
    return localRockets.value.find(rocket => rocket.id === id)
  }

  /** Adds a user-created rocket to the in-memory list. */
  function addRocket (input: NewRocketInput): Rocket {
    const rocket: Rocket = {
      // Prefixed so a local id can never collide with a numeric API id.
      id: `local-${Date.now()}-${localRockets.value.length}`,
      name: input.name.trim(),
      description: input.description.trim() || null,
      imageUrl: input.imageUrl.trim() || null,
      launchCost: parseCost(input.launchCost),
      country: input.country.trim().toUpperCase() || null,
      firstFlight: input.firstFlight || null,
      isLocal: true,
    }

    localRockets.value = [rocket, ...localRockets.value]

    return rocket
  }

  function setFilterQuery (query: string) {
    filterQuery.value = query
  }

  /** Clears every filter criterion at once. */
  function clearFilter () {
    filterQuery.value = ''
    countryFilter.value = null
    flightStatusFilter.value = 'all'
    costStatusFilter.value = 'all'
  }

  return {
    localRockets,
    filterQuery,
    countryFilter,
    flightStatusFilter,
    costStatusFilter,
    hasFilter,
    availableCountries,
    filterRockets,
    findLocalRocket,
    addRocket,
    setFilterQuery,
    clearFilter,
  }
})
