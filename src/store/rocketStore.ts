import { defineStore } from 'pinia'
import type { Rocket } from '@/types/Rocket'
import { fetchRockets } from '@/services/rocketService'

export const useRocketStore = defineStore('rocket', {
  state: () => ({
    rockets: [] as Rocket[],
    loading: false,
    error: false,
  }),
  actions: {
    async loadRockets() {
      this.loading = true
      this.error = false
      try {
        this.rockets = await fetchRockets()
      } catch {
        this.error = true
      } finally {
        this.loading = false
      }
    },
    addRocket(rocket: Rocket) {
      this.rockets.push(rocket)
    },
  },
})
