import { defineStore } from 'pinia'
import { fetchSpaceXRockets } from '@/services/launchLibrary'
import type { Rocket } from '@/types/rocket'

type Status = 'idle' | 'loading' | 'success' | 'error'

let nextCustomId = -1

export const useRocketsStore = defineStore('rockets', {
  state: () => ({
    rockets: [] as Rocket[],
    status: 'idle' as Status,
    errorMessage: '',
  }),

  getters: {
    getById: state => (id: number) => state.rockets.find(rocket => rocket.id === id),
  },

  actions: {
    async fetchRockets () {
      this.status = 'loading'
      this.errorMessage = ''

      try {
        this.rockets = await fetchSpaceXRockets()
        this.status = 'success'
      } catch (error) {
        this.status = 'error'
        this.errorMessage = error instanceof Error ? error.message : 'Something went wrong'
      }
    },

    addRocket (rocket: Omit<Rocket, 'id'>) {
      this.rockets.unshift({ ...rocket, id: nextCustomId-- })
    },
  },
})