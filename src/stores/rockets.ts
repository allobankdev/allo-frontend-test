/**
 * stores/rockets.ts
 *
 * Framework documentation: https://pinia.vuejs.org
 */

// Composables
import { defineStore } from 'pinia'

// API
import { fetchRockets } from '@/api/rockets'

// Types
import type { Rocket } from '@/types/rocket'

export const useRocketsStore = defineStore('rockets', {
  state: () => ({
    rockets: [] as Rocket[],
    loading: false,
    error: false,
    loaded: false,
  }),
  actions: {
    async fetchRockets () {
      this.loading = true
      this.error = false

      try {
        this.rockets = await fetchRockets()
        this.loaded = true
      } catch {
        this.error = true
      } finally {
        this.loading = false
      }
    },

    addRocket (rocket: Rocket) {
      this.rockets.unshift(rocket)
    },
  },
})
