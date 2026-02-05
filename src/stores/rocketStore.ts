import { defineStore } from 'pinia'
import { getRockets, getRocketById } from '@/api/rocketApi'

export const useRocketStore = defineStore('rocket', {
state: () => ({
  rockets: [],
  rocketDetail: null,

  rocketsLoading: false,
  rocketsError: null as string | null,

  detailLoading: false,
  detailError: null as string | null,
}),

  actions: {
    async fetchRockets() {

      if (this.rockets.length) return

      this.rocketsLoading = true
      this.rocketsError = null

      try {
          this.rockets = await getRockets()
      } catch {
          this.rocketsError = 'Failed to fetch rockets'
      } finally {
          this.rocketsLoading = false
      }
    },

    async fetchRocketById(id: string) {

      this.detailLoading = true
      this.detailError = null

      try {
          this.rocketDetail = await getRocketById(id)
      } catch {
          this.detailError = 'Failed to fetch rocket detail'
      } finally {
          this.detailLoading = false
      }
    },
    addRocket(rocket: any) {

    if (!rocket?.name) return

    this.rockets.unshift(rocket)
    }
 },

})
