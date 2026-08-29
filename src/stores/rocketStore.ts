import { defineStore } from 'pinia'
import axios from 'axios'

export interface Rocket {
  id: string
  name: string
  description: string
  flickr_images: string[]
  cost_per_launch: number
  country: string
  first_flight: string
}

export const useRocketStore = defineStore('rocket', {
  state: () => ({
    rockets: [] as Rocket[],
    isLoading: false,
    error: null as string | null,
    searchQuery: ''
  }),
  getters: {
    filteredRockets(state) {
      if (!state.searchQuery) return state.rockets
      const query = state.searchQuery.toLowerCase()
      // Filter rockets by name or description
      return state.rockets.filter(r => 
        r.name.toLowerCase().includes(query) || 
        r.description.toLowerCase().includes(query)
      )
    }
  },
  actions: {
    async fetchRockets() {
      // Avoid re-fetching if data already exists and no error occurred
      if (this.rockets.length > 0 && !this.error) return

      this.isLoading = true
      this.error = null
      
      try {
        const response = await axios.get<Rocket[]>('https://api.spacexdata.com/v4/rockets')
        this.rockets = response.data
      } catch (err: any) {
        this.error = 'Failed to load rockets. ' + (err.message || 'Unknown error')
      } finally {
        this.isLoading = false
      }
    },
    addManualRocket(rocket: Rocket) {
      // Simulating "Add new rocket locally" by pushing it unshifted to states array
      this.rockets.unshift(rocket)
    }
  }
})
