import { defineStore } from 'pinia'
import type { Rocket, NewRocketInput } from '@/types/rocket'
import { getSpaceXRockets, getRocketById } from '@/services/rocketService'

const LOCAL_STORAGE_KEY = 'allo_spacex_local_rockets'

function loadSavedLocalRockets(): Rocket[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw)
    }
  } catch (e) {
    console.error('Failed to parse local rockets from localStorage', e)
  }
  return []
}

function persistLocalRockets(rockets: Rocket[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(rockets))
  } catch (e) {
    console.error('Failed to persist local rockets to localStorage', e)
  }
}

export const useRocketStore = defineStore('rocket', {
  state: () => ({
    rockets: [] as Rocket[],
    localRockets: loadSavedLocalRockets() as Rocket[],
    isLoading: false,
    error: null as string | null,
    searchQuery: '',
    selectedFilter: 'all' as 'all' | 'active' | 'reusable',

    currentRocket: null as Rocket | null,
    isLoadingDetail: false,
    errorDetail: null as string | null,
    isAddDialogOpen: false,
  }),

  getters: {
    allRockets: (state): Rocket[] => {
      // Local rockets appear first
      return [...state.localRockets, ...state.rockets]
    },

    filteredRockets(): Rocket[] {
      let list = this.allRockets

      // Filter by category
      if (this.selectedFilter === 'active') {
        list = list.filter(r => r.active === true)
      } else if (this.selectedFilter === 'reusable') {
        list = list.filter(r => r.reusable === true)
      }

      // Filter by search query
      const query = this.searchQuery.trim().toLowerCase()
      if (!query) return list

      return list.filter(r => {
        const nameMatch = (r.full_name || r.name || '').toLowerCase().includes(query)
        const descMatch = (r.description || '').toLowerCase().includes(query)
        const countryMatch = (r.manufacturer?.country_code || '').toLowerCase().includes(query)
        return nameMatch || descMatch || countryMatch
      })
    },

    getRocketFromState: (state) => {
      return (id: string | number): Rocket | undefined => {
        const stringId = String(id)
        return (
          state.localRockets.find(r => String(r.id) === stringId) ||
          state.rockets.find(r => String(r.id) === stringId)
        )
      }
    },
  },

  actions: {
    async fetchRockets(force = false) {
      // If we already have API data and not forced, reuse cache to respect rate limit
      if (this.rockets.length > 0 && !force) {
        return
      }

      this.isLoading = true
      this.error = null

      try {
        const data = await getSpaceXRockets()
        this.rockets = data
      } catch (err: unknown) {
        const error = err as Error
        this.error = error?.message || 'Failed to fetch rockets. Please check your network and try again.'
      } finally {
        this.isLoading = false
      }
    },

    async fetchRocketDetail(id: string | number, force = false) {
      const stringId = String(id)
      const existing = this.getRocketFromState(stringId)

      // If already in state and not forced, use cached data
      if (existing && !force) {
        this.currentRocket = existing
        this.errorDetail = null
        return
      }

      // If it's a locally added rocket, it won't exist on the API
      if (existing?.is_local) {
        this.currentRocket = existing
        this.errorDetail = null
        return
      }

      this.isLoadingDetail = true
      this.errorDetail = null

      try {
        const data = await getRocketById(id)
        this.currentRocket = data

        // Update rocket in state if already present or add it
        const index = this.rockets.findIndex(r => String(r.id) === stringId)
        if (index !== -1) {
          this.rockets[index] = data
        }
      } catch (err: unknown) {
        const error = err as Error
        // If API call fails but we had an existing rocket from list, fall back to it
        if (existing) {
          this.currentRocket = existing
          this.errorDetail = null
        } else {
          this.errorDetail = error?.message || `Failed to fetch rocket #${id} details.`
        }
      } finally {
        this.isLoadingDetail = false
      }
    },

    addRocket(input: NewRocketInput): Rocket {
      const newRocket: Rocket = {
        id: `local-${Date.now()}`,
        full_name: input.full_name.trim(),
        name: input.full_name.trim(),
        description: input.description?.trim() || null,
        image_url: input.image_url?.trim() || null,
        launch_cost: input.launch_cost ? String(input.launch_cost).trim() : null,
        maiden_flight: input.maiden_flight?.trim() || null,
        manufacturer: {
          name: 'SpaceX',
          country_code: input.country_code?.trim() || 'USA',
        },
        active: true,
        reusable: true,
        is_local: true,
      }

      this.localRockets.unshift(newRocket)
      persistLocalRockets(this.localRockets)
      return newRocket
    },

    setSearchQuery(query: string) {
      this.searchQuery = query
    },

    setSelectedFilter(filter: 'all' | 'active' | 'reusable') {
      this.selectedFilter = filter
    },

    openAddDialog() {
      this.isAddDialogOpen = true
    },

    closeAddDialog() {
      this.isAddDialogOpen = false
    },
  },
})
