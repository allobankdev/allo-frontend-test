import { defineStore } from 'pinia'
import type { Rocket } from '@/types/rocket'
import { fetchRocketById, fetchRocketList } from '@/services/RocketService'

export const useRocketsStore = defineStore('rockets', {
  state: () => ({
    rockets: [] as Rocket[],
    filteredRockets: [] as Rocket[],
    detailRocket: null as Rocket | null,
    isLoading: false,
    error: null as string | null
  }),
  actions: {
    async fetchRockets() {
      this.isLoading = true
      this.error = null
      try {
        const data = await fetchRocketList()
        this.rockets = data
        this.filteredRockets = data
      } catch (err: any) {
        this.error = err?.message ?? 'Failed to load rockets'
      } finally {
        this.isLoading = false
      }
    },
    async fetchRocketById(id: string) {
      this.isLoading = true
      this.error = null
      try {
        const data = await fetchRocketById(id)
        this.detailRocket = data
      } catch (err: any) {
        this.error = err?.message ?? 'Failed to load rocket detail'
      } finally {
        this.isLoading = false
      }
    }
  }
})
