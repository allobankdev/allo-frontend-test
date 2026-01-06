import { defineStore } from "pinia";
import type { Rocket } from "@/types/rocket";
import { fetchRockets } from "@/api/space";

export const useRocketStore = defineStore('rocket', {
  state: () => ({
    rockets: [] as Rocket[],
    isLoading: false,
    error: null as string | null,
  }),

  actions: {
    async loadRockets() {
      this.isLoading = true
      this.error = null

      try {
        this.rockets = await fetchRockets()
      } catch (err) {
        this.error = 'Failed to load rockets ' + err
      } finally {
        this.isLoading = false
      }
    },
  },

})
