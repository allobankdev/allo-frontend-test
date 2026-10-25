import { defineStore } from 'pinia'
import { getSpaceXRockets, getRocketById } from '@/services/rocketService'
import type { Rocket, NewRocketInput } from '@/types/rocket'

interface RocketState {
  rockets: Rocket[]
  localRockets: Rocket[]
  selectedRocket: Rocket | null
  loading: boolean
  error: string | null
  searchQuery: string
  statusFilter: 'all' | 'active' | 'inactive'
}

export const useRocketStore = defineStore('rocket', {
  state: (): RocketState => ({
    rockets: [],
    localRockets: [],
    selectedRocket: null,
    loading: false,
    error: null,
    searchQuery: '',
    statusFilter: 'all',
  }),

  getters: {
    /**
     * Combined list of user-created (local) and API rockets.
     * Local rockets are placed on top for immediate user visibility.
     */
    allRockets(state): Rocket[] {
      return [...state.localRockets, ...state.rockets]
    },

    /**
     * Filtered list of rockets based on search query (name/description) and status filter
     */
    filteredRockets(state): Rocket[] {
      const query = state.searchQuery.trim().toLowerCase()
      let list = this.allRockets

      // Filter by active/inactive status
      if (state.statusFilter === 'active') {
        list = list.filter((r) => r.active === true)
      } else if (state.statusFilter === 'inactive') {
        list = list.filter((r) => r.active === false)
      }

      // Filter by search query
      if (query) {
        list = list.filter((r) => {
          const nameMatch = r.full_name?.toLowerCase().includes(query) || r.name?.toLowerCase().includes(query)
          const descMatch = r.description?.toLowerCase().includes(query)
          const familyMatch = r.family?.toLowerCase().includes(query)
          return Boolean(nameMatch || descMatch || familyMatch)
        })
      }

      return list
    },

    /**
     * Total count of available rockets
     */
    totalCount(): number {
      return this.allRockets.length
    },
  },

  actions: {
    /**
     * Fetch all SpaceX rockets from the Launch Library 2 API
     */
    async fetchRockets(forceRefresh = false) {
      if (this.rockets.length > 0 && !forceRefresh) {
        return
      }

      this.loading = true
      this.error = null

      try {
        const results = await getSpaceXRockets()
        this.rockets = results
      } catch (err: unknown) {
        if (err instanceof Error) {
          this.error = err.message
        } else {
          this.error = 'Failed to fetch rockets from API.'
        }
      } finally {
        this.loading = false
      }
    },

    /**
     * Fetch rocket details by ID. First checks local/cached state, then falls back to API.
     */
    async fetchRocketDetail(id: number | string) {
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id

      // Check if it exists in locally added rockets
      const localRocket = this.localRockets.find((r) => r.id === numericId)
      if (localRocket) {
        this.selectedRocket = localRocket
        return localRocket
      }

      // Check if already in cache
      const cachedRocket = this.rockets.find((r) => r.id === numericId)
      if (cachedRocket && cachedRocket.description !== undefined) {
        this.selectedRocket = cachedRocket
      }

      this.loading = true
      this.error = null

      try {
        const rocket = await getRocketById(numericId)
        this.selectedRocket = rocket

        // Update in list cache if present
        const index = this.rockets.findIndex((r) => r.id === numericId)
        if (index !== -1) {
          this.rockets[index] = rocket
        }

        return rocket
      } catch (err: unknown) {
        // If API fails but we had cached version, keep cached
        if (!this.selectedRocket) {
          if (err instanceof Error) {
            this.error = err.message
          } else {
            this.error = `Failed to fetch details for rocket ID ${id}.`
          }
        }
      } finally {
        this.loading = false
      }
    },

    /**
     * Add a new rocket locally to the running app state.
     */
    addNewRocket(input: NewRocketInput): Rocket {
      const newId = Date.now()

      const newRocket: Rocket = {
        id: newId,
        name: input.name,
        full_name: input.full_name,
        description: input.description || null,
        image_url: input.image_url?.trim() || null,
        launch_cost: input.launch_cost?.trim() || null,
        maiden_flight: input.maiden_flight || null,
        active: input.active ?? true,
        reusable: true,
        family: 'SpaceX Custom',
        manufacturer: {
          id: 121,
          name: 'SpaceX',
          country_code: input.country_code?.trim() || 'USA',
        },
        isLocal: true,
      }

      this.localRockets.unshift(newRocket)
      return newRocket
    },

    /**
     * Update search query filter
     */
    setSearchQuery(query: string) {
      this.searchQuery = query
    },

    /**
     * Update status filter ('all' | 'active' | 'inactive')
     */
    setStatusFilter(status: 'all' | 'active' | 'inactive') {
      this.statusFilter = status
    },

    /**
     * Clear active error state
     */
    clearError() {
      this.error = null
    },

    /**
     * Clear selected rocket
     */
    clearSelectedRocket() {
      this.selectedRocket = null
    },
  },
})
