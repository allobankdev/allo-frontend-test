import { defineStore } from 'pinia'
import type { Rocket } from '../types/rocket'
import { fetchRockets, fetchRocketById } from '../api/rocketApi'

export const useRocketStore = defineStore('rocket', {
  state: () => ({
    apiRockets: [] as Rocket[],
    customRockets: [] as Rocket[],
    selectedRocket: null as Rocket | null,
    loading: false,
    detailLoading: false,
    error: null as string | null,
    detailError: null as string | null,
    searchQuery: '',
  }),

  getters: {
    allRockets(state): Rocket[] {
      return [...state.customRockets, ...state.apiRockets]
    },

    filteredRockets(state): Rocket[] {
      const query = state.searchQuery.trim().toLowerCase()
      const list = [...state.customRockets, ...state.apiRockets]
      if (!query) return list

      return list.filter((rocket) => {
        const nameMatch = rocket.full_name?.toLowerCase().includes(query)
        const descMatch = rocket.description?.toLowerCase().includes(query)
        const countryMatch = rocket.manufacturer?.country_code?.toLowerCase().includes(query)
        return nameMatch || descMatch || countryMatch
      })
    },
  },

  actions: {
    async loadRockets() {
      this.loading = true
      this.error = null
      try {
        const rockets = await fetchRockets()
        this.apiRockets = rockets
      } catch (err: any) {
        this.error = err.message || 'Failed to load rockets. Please try again.'
      } finally {
        this.loading = false
      }
    },

    async loadRocketById(id: string | number) {
      this.detailLoading = true
      this.detailError = null
      this.selectedRocket = null

      // Check if it's a custom rocket in store memory first
      const existing = this.allRockets.find((r) => String(r.id) === String(id))
      if (existing) {
        this.selectedRocket = existing
        this.detailLoading = false
        return
      }

      try {
        const rocket = await fetchRocketById(id)
        this.selectedRocket = rocket
      } catch (err: any) {
        this.detailError = err.message || `Failed to load details for rocket #${id}`
      } finally {
        this.detailLoading = false
      }
    },

    addCustomRocket(rocketData: {
      full_name: string
      description?: string
      image_url?: string
      launch_cost?: string | number
      country_code?: string
      maiden_flight?: string
    }) {
      const defaultImage = 'https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=800&auto=format&fit=crop'
      const newRocket: Rocket = {
        id: `custom-${Date.now()}`,
        full_name: rocketData.full_name,
        description: rocketData.description || 'No description provided for this custom rocket.',
        image_url: rocketData.image_url && rocketData.image_url.trim() ? rocketData.image_url.trim() : defaultImage,
        launch_cost: rocketData.launch_cost || null,
        maiden_flight: rocketData.maiden_flight || null,
        manufacturer: {
          name: 'Custom Manufacturer',
          country_code: rocketData.country_code || 'IDN',
        },
        is_custom: true,
      }
      this.customRockets.unshift(newRocket)
    },
  },
})
