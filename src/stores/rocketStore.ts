import { defineStore } from 'pinia'
import type { Rocket } from '@/types/rocket'
import { getRockets } from '@/api/spacex'

export const useRocketStore = defineStore('rocket', {
  state: () => ({
    rockets: [] as Rocket[],
    loading: false,
    error: null as unknown,
    filter: '',
  }),

  getters: {
    filteredRockets: (state): Rocket[] => {
      if (!state.filter) return state.rockets
      return state.rockets.filter(r =>
        r.name.toLowerCase().includes(state.filter.toLowerCase())
      )
    },
  },

  actions: {
    async fetchRockets() {
      this.loading = true
      try {
        const res = await getRockets()
        this.rockets = res.data as Rocket[]
      } finally {
        this.loading = false
      }
    },

    addRocket(rocket: Rocket) {
      this.rockets.unshift(rocket)
    },

    updateRocketImage(id: string, image: string) {
      const rocket = this.rockets.find(r => r.id === id)
      if (rocket) {
        rocket.flickr_images = [image]
      }
    }
  },
})
