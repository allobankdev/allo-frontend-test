import { defineStore } from 'pinia'
import { fetchRockets, type Rocket } from '@/api/spacex'

export const useRocketStore = defineStore('rocket', {
  state: () => ({
    rockets: [] as Rocket[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async loadRockets() {
      this.loading = true
      this.error = null

      try {
        const apiData = await fetchRockets()
        const localData = JSON.parse(
          localStorage.getItem('custom-rockets') || '[]'
        )

        this.rockets = [...localData, ...apiData]
      } catch {
        this.error = 'Failed to load rockets'
      } finally {
        this.loading = false
      }
    },

    addRocket(rocket: Rocket) {
      this.rockets.unshift(rocket)

      const saved = JSON.parse(
        localStorage.getItem('custom-rockets') || '[]'
      )
      localStorage.setItem(
        'custom-rockets',
        JSON.stringify([rocket, ...saved])
      )
    },

    getRocketById(id: string) {
      return this.rockets.find(r => r.id === id)
    },
  },
})
