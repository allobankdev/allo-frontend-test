import { defineStore } from 'pinia'
import { fetchSpaceXRockets } from '@/api/rockets'
import type { Rocket } from '@/types/rocket'

type FetchStatus = 'idle' | 'loading' | 'success' | 'error'

export const useRocketStore = defineStore('rockets', {
  state: () => ({
    rockets: [] as Rocket[],
    status: 'idle' as FetchStatus,
    errorMessage: '',
    nextLocalId: -1, 
  }),

  getters: {
    findById: (state) => {
      return (id: string | number): Rocket | undefined =>
        state.rockets.find((rocket) => String(rocket.id) === String(id))
    },

    families: (state) => {
      const set = new Set<string>()
      for (const rocket of state.rockets) {
        if (rocket.family) set.add(rocket.family)
      }
      return Array.from(set).sort()
    },
  },

  actions: {
    async fetchRockets() {
      this.status = 'loading'
      this.errorMessage = ''

      try {
        this.rockets = await fetchSpaceXRockets()
        this.status = 'success'
      } catch (error) {
        this.status = 'error'
        this.errorMessage = error instanceof Error ? error.message : 'Failed to load rockets.'
      }
    },

    addLocalRocket(input: Omit<Rocket, 'id' | 'isLocal'>) {
      this.rockets = [
        { ...input, id: this.nextLocalId, isLocal: true },
        ...this.rockets,
      ]
      this.nextLocalId -= 1
    },
  },
})