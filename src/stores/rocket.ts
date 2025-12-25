import { defineStore } from 'pinia'
import type { Rocket } from '@/types/rocket'
import { fetchRocketById, fetchRocketList } from '@/services/RocketService'

export const useRocketsStore = defineStore('rockets', {
  state: () => ({
    rockets: [] as Rocket[],
    detailRocket: null as Rocket | null,
    isLoading: false,
    isError: false,
    error: null as string | null,
    filterQuery: {
      name: null as string | null,
      active: null as boolean | null
    }
  }),
  getters: {
    getTotalInactiveRocket: (state) => {
      const rocketData = state.rockets
      if(rocketData?.length === 0) return 0
      const inactiveRocket = rocketData.filter(item => !item.active)?.length
      return inactiveRocket
    },
    getTotalSuccessRate: (state) => {
      const rocketData = state.rockets
      if(rocketData?.length === 0) return 0
      const totalSuccessRate = rocketData.reduce((total, rocket) => total + (rocket.success_rate_pct ?? 0), 0);
      return totalSuccessRate / rocketData.length;
    },
    filteredRockets: (state) => {
      let filtered = state.rockets

      // Filter by name
      if (state.filterQuery.name?.trim()) {
        const nameQuery = state.filterQuery.name.trim().toLowerCase()
        filtered = filtered.filter(rocket => 
          rocket.name.toLowerCase().includes(nameQuery)
        )
      }

      // Filter by active status
      if (state.filterQuery.active !== null) {
        filtered = filtered.filter(rocket => rocket.active === state.filterQuery.active)
      }

      return filtered
    }
  },
  actions: {
    async fetchRockets() {
      this.isLoading = true
      this.error = null
      try {
        const data = await fetchRocketList()
        this.rockets = data
      } catch (err: any) {
        this.error = err?.message ?? 'Failed to load rockets'
        this.isError = true
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
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    addRocket(rocket: Rocket) {
      this.rockets.push(rocket)
    },
    clearErrorState() {
      this.error = ""
      this.isError = false
    }
  }
})
