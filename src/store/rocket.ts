import { defineStore } from 'pinia'
import { fetchRockets } from '@/api/spacex'
import type { Rocket } from '@/types/rocket'

export const useRocketStore = defineStore('rocket', {
  state: () => ({
    rockets: [] as Rocket[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    async loadRockets() {
      this.loading = true
      this.error = null
      try {
        this.rockets = await fetchRockets()
      } catch (err) {
        this.error = 'Failed to load rockets'
      } finally {
        this.loading = false
      }
    },

    addRocket(rocket: Rocket) {
      this.rockets.push(rocket)
    }
  }
})
