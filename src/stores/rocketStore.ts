import { defineStore } from 'pinia'
import axios from 'axios'
import type { Rocket, RocketApiResponse, NewRocketPayload } from '@/types/rocket'

const API_BASE_URL = 'https://lldev.thespacedevs.com/2.2.0/config/launcher'

export const useRocketStore = defineStore('rockets', {
  state: () => ({
    rockets: [] as Rocket[],
    selectedRocket: null as Rocket | null,
    isLoading: false,
    isDetailLoading: false,
    error: null as string | null,
    detailError: null as string | null,
    searchQuery: '',
    selectedFamily: 'all',
  }),

  getters: {
    filteredRockets(state): Rocket[] {
      let result = state.rockets

      // Filter by search query
      if (state.searchQuery.trim()) {
        const query = state.searchQuery.toLowerCase().trim()
        result = result.filter((rocket) => {
          const nameMatch = rocket.name?.toLowerCase().includes(query)
          const fullNameMatch = rocket.full_name?.toLowerCase().includes(query)
          const descMatch = rocket.description?.toLowerCase().includes(query)
          const countryMatch = rocket.manufacturer?.country_code?.toLowerCase().includes(query)
          return nameMatch || fullNameMatch || descMatch || countryMatch
        })
      }

      // Filter by rocket family
      if (state.selectedFamily !== 'all') {
        result = result.filter((rocket) => rocket.family === state.selectedFamily)
      }

      return result
    },

    rocketFamilies(state): string[] {
      const families = new Set<string>()
      state.rockets.forEach((r) => {
        if (r.family) families.add(r.family)
      })
      return Array.from(families).sort()
    },

    getRocketById: (state) => {
      return (id: number | string): Rocket | undefined => {
        return state.rockets.find((r) => String(r.id) === String(id))
      }
    },

    metrics(state) {
      return {
        total: state.rockets.length,
        active: state.rockets.filter((r) => r.active).length,
        reusable: state.rockets.filter((r) => r.reusable).length,
        custom: state.rockets.filter((r) => r.is_custom).length,
      }
    },
  },

  actions: {
    async fetchRockets(force = false) {
      // Don't refetch if already loaded unless explicitly forced
      if (this.rockets.length > 0 && !force) {
        return
      }

      this.isLoading = true
      this.error = null

      try {
        const response = await axios.get<RocketApiResponse>(
          `${API_BASE_URL}/?manufacturer__name=SpaceX&mode=detailed&limit=20`,
          { timeout: 12000 }
        )

        const fetchedRockets = response.data.results || []

        // Preserve any custom rockets added by the user during this session
        const customRockets = this.rockets.filter((r) => r.is_custom)
        this.rockets = [...customRockets, ...fetchedRockets]
      } catch (err: unknown) {
        console.error('Failed to fetch rockets:', err)
        if (axios.isAxiosError(err)) {
          this.error =
            err.response?.data?.detail ||
            err.message ||
            'Failed to load SpaceX rocket configurations. Please check your connection and try again.'
        } else {
          this.error = (err as Error).message || 'An unexpected error occurred.'
        }
      } finally {
        this.isLoading = false
      }
    },

    async fetchRocketDetail(id: number | string) {
      this.detailError = null

      // Check if rocket is already in store (in-memory or previously fetched)
      const existing = this.getRocketById(id)
      if (existing) {
        this.selectedRocket = existing
        return
      }

      this.isDetailLoading = true
      try {
        const response = await axios.get<Rocket>(`${API_BASE_URL}/${id}/`, {
          timeout: 10000,
        })
        this.selectedRocket = response.data

        // Also add to rockets list if not already present
        if (!this.rockets.some((r) => String(r.id) === String(id))) {
          this.rockets.push(response.data)
        }
      } catch (err: unknown) {
        console.error(`Failed to fetch rocket detail for ID ${id}:`, err)
        if (axios.isAxiosError(err)) {
          this.detailError =
            err.response?.data?.detail ||
            err.message ||
            `Failed to load details for rocket #${id}.`
        } else {
          this.detailError = (err as Error).message || `Failed to load details for rocket #${id}.`
        }
      } finally {
        this.isDetailLoading = false
      }
    },

    addRocket(payload: NewRocketPayload): Rocket {
      const newRocket: Rocket = {
        id: `custom-${Date.now()}`,
        name: payload.name.trim(),
        full_name: payload.full_name.trim(),
        description: payload.description.trim(),
        image_url: payload.image_url?.trim() || null,
        launch_cost: payload.launch_cost ? String(payload.launch_cost) : null,
        maiden_flight: payload.maiden_flight || null,
        active: payload.active ?? true,
        reusable: payload.reusable ?? true,
        family: payload.name.split(' ')[0] || 'SpaceX',
        manufacturer: {
          name: 'SpaceX',
          country_code: payload.country_code?.trim().toUpperCase() || 'USA',
        },
        is_custom: true,
      }

      // Prepend to top so user sees the newly added rocket immediately
      this.rockets.unshift(newRocket)
      return newRocket
    },

    clearFilters() {
      this.searchQuery = ''
      this.selectedFamily = 'all'
    },
  },
})
