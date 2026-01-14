import { defineStore } from 'pinia'
import axios from 'axios'

// Define the structure of a Rocket based on SpaceX API requirements
export interface Rocket {
  id: string
  name: string
  description: string
  flickr_images: string[]
  cost_per_launch?: number
  country?: string
  first_flight?: string
}

export const useRocketStore = defineStore('rocket', {
  state: () => ({
    rockets: [] as Rocket[],
    loading: false,
    error: false,
  }),
  getters: {
    getRocketById: (state) => {
      return (id: string) => state.rockets.find((r) => r.id === id)
    }
  },
  actions: {
    async fetchRockets() {
      this.loading = true
      this.error = false
      try {
        const response = await axios.get<Rocket[]>('https://api.spacexdata.com/v4/rockets')
        this.rockets = response.data
      } catch {
        this.error = true
      } finally {
        this.loading = false
      }
    },
    addRocket(newRocket: Omit<Rocket, 'id' | 'flickr_images'>) {
      this.rockets.unshift({
        id: crypto.randomUUID(),
        flickr_images: ['https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=800'],
        ...newRocket
      })
    }
  }
})
