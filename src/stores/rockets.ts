import { defineStore } from 'pinia'
import { fetchRocketById, fetchRockets, RocketApiError } from '@/services/rocketApi'
import { mapApiRecordToRocket } from '@/utils/mappers'
import type { Rocket } from '@/types/rocket'

export type FetchStatus = 'idle' | 'loading' | 'success' | 'error'
export type SortOption = 'default' | 'name-asc' | 'name-desc' | 'cost-asc' | 'cost-desc' | 'date-asc' | 'date-desc'

const CUSTOM_ROCKETS_STORAGE_KEY = 'allo-rockets:custom-rockets'

function loadCustomRocketsFromStorage (): Rocket[] {
  try {
    const raw = localStorage.getItem(CUSTOM_ROCKETS_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Rocket[]) : []
  } catch {
    // Corrupt data or storage unavailable (e.g. private browsing) — start empty.
    return []
  }
}

function persistCustomRockets (rockets: Rocket[]) {
  try {
    localStorage.setItem(CUSTOM_ROCKETS_STORAGE_KEY, JSON.stringify(rockets))
  } catch {
    // Not critical if this fails — the rocket still exists for the current session.
  }
}

export const useRocketStore = defineStore('rockets', {
  state: () => ({
    rockets: [] as Rocket[],
    customRockets: loadCustomRocketsFromStorage(),
    status: 'idle' as FetchStatus,
    errorMessage: '',

    searchQuery: '',
    familyFilters: [] as string[],
    activeOnly: false,
    sortBy: 'default' as SortOption,
  }),

  getters: {
    /** Custom rockets are shown first so adding one gives instant feedback. */
    allRockets: state => [...state.customRockets, ...state.rockets],

    /** Distinct rocket families found in the fetched data, used to build filter chips. */
    families: state => {
      const set = new Set<string>()
      for (const rocket of [...state.customRockets, ...state.rockets]) {
        if (rocket.family) set.add(rocket.family)
      }
      return Array.from(set).sort()
    },

    filteredRockets (): Rocket[] {
      const query = this.searchQuery.trim().toLowerCase()

      const filtered = this.allRockets.filter((rocket: Rocket) => {
        const matchesQuery = !query ||
          rocket.fullName.toLowerCase().includes(query) ||
          rocket.name.toLowerCase().includes(query)
        const matchesFamily = this.familyFilters.length === 0 ||
          (rocket.family !== null && this.familyFilters.includes(rocket.family))
        const matchesActive = !this.activeOnly || rocket.active
        return matchesQuery && matchesFamily && matchesActive
      })

      return sortRockets(filtered, this.sortBy)
    },
  },

  actions: {
    async loadRockets () {
      this.status = 'loading'
      this.errorMessage = ''
      try {
        const response = await fetchRockets()
        this.rockets = response.results.map(mapApiRecordToRocket)
        this.status = 'success'
      } catch (error) {
        this.status = 'error'
        this.errorMessage = error instanceof RocketApiError
          ? error.message
          : 'Something went wrong while loading rockets.'
      }
    },

    /** Fallback used by the detail page when a rocket isn't already
     *  cached locally (e.g. a hard refresh / direct link). Returns
     *  `null` specifically for a 404 (unknown id) so the caller can
     *  tell "not found" apart from a network/API failure. */
    async loadRocketById (id: string): Promise<Rocket | null> {
      try {
        const record = await fetchRocketById(id)
        return mapApiRecordToRocket(record)
      } catch (error) {
        if (error instanceof RocketApiError && error.status === 404) {
          return null
        }
        throw error
      }
    },

    addCustomRocket (input: Omit<Rocket, 'id' | 'isCustom'>): Rocket {
      const newRocket: Rocket = {
        ...input,
        id: `custom-${Date.now()}`,
        isCustom: true,
      }
      this.customRockets = [newRocket, ...this.customRockets]
      persistCustomRockets(this.customRockets)
      return newRocket
    },

    resetFilters () {
      this.searchQuery = ''
      this.familyFilters = []
      this.activeOnly = false
      this.sortBy = 'default'
    },
  },
})

function sortRockets (rockets: Rocket[], sortBy: SortOption): Rocket[] {
  if (sortBy === 'default') return rockets

  const sorted = [...rockets]
  switch (sortBy) {
    case 'name-asc':
      return sorted.sort((a, b) => a.fullName.localeCompare(b.fullName))
    case 'name-desc':
      return sorted.sort((a, b) => b.fullName.localeCompare(a.fullName))
    case 'cost-asc':
      return sorted.sort((a, b) => compareNullable(a.launchCost, b.launchCost, 1))
    case 'cost-desc':
      return sorted.sort((a, b) => compareNullable(a.launchCost, b.launchCost, -1))
    case 'date-asc':
      return sorted.sort((a, b) => compareNullable(dateValue(a), dateValue(b), 1))
    case 'date-desc':
      return sorted.sort((a, b) => compareNullable(dateValue(a), dateValue(b), -1))
    default:
      return sorted
  }
}

function dateValue (rocket: Rocket): number | null {
  return rocket.maidenFlight ? new Date(rocket.maidenFlight).getTime() : null
}

/** Numeric comparator where `null` always sorts to the end, no matter
 *  the direction — an "unknown" value shouldn't jump to the top just
 *  because the user flipped from ascending to descending. */
function compareNullable (a: number | null, b: number | null, direction: 1 | -1): number {
  if (a === null && b === null) return 0
  if (a === null) return 1
  if (b === null) return -1
  return (a - b) * direction
}
