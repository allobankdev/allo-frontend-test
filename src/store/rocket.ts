import { defineStore } from 'pinia'
import type { Rocket } from '@/types/rocket'
import { fetchRockets } from '@/service/space'

export const useRocketsStore = defineStore('rockets', {
  state: () => ({
    items: [] as Rocket[],
    dropdownList: [] as Rocket[],
    loading: false,
    fetchError: null as string | null,
  }),

  actions: {
    async retrieveRockets() {
      this.loading = true
      this.fetchError = null

      try {
        await new Promise(resolve => setTimeout(resolve, 500))

        const rocketsList = await fetchRockets()
        this.items = rocketsList
        this.dropdownList = [...rocketsList]
      } catch (err: any) {
        this.fetchError = `Unable to fetch rockets: ${err.message || err}`
      } finally {
        this.loading = false
      }
    },

    prependRocket(rocket: Rocket) {
      this.items.unshift(rocket)
    },
  },
})