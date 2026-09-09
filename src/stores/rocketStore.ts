import { defineStore } from 'pinia'
import axios from 'axios'

export interface Rocket {
  id: string | number
  full_name: string
  description: string | null
  image_url: string | null
  launch_cost: number | null
  maiden_flight: string | null
  manufacturer?: {
    country_code?: string
  }
  isCustom?: boolean
}

export const useRocketStore = defineStore('rocket', {
  state: () => ({
    rockets: [] as Rocket[],
    loading: false,
    error: null as string | null,
    searchQuery: '',
  }),

  getters: {
    filteredRockets: (state) => {
      if (!state.searchQuery.trim()) return state.rockets
      const query = state.searchQuery.toLowerCase()
      return state.rockets.filter((rocket) =>
        rocket.full_name?.toLowerCase().includes(query)
      )
    },
  },

  actions: {
    async fetchRockets() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(
          'https://lldev.thespacedevs.com/2.2.0/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20'
        )
        const customRockets = this.rockets.filter((r) => r.isCustom)
        this.rockets = [...customRockets, ...response.data.results]
      } catch (err: any) {
        this.error = err.message || 'Gagal mengambil data dari API.'
      } finally {
        this.loading = false
      }
    },

    addRocket(newRocket: Omit<Rocket, 'id'>) {
      const createdRocket: Rocket = {
        ...newRocket,
        id: `custom-${Date.now()}`,
        isCustom: true,
      }
      this.rockets.unshift(createdRocket)
    },
  },
})
