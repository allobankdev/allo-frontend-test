import { defineStore } from 'pinia'
import { fetchRocketById, fetchSpaceXRockets } from '@/services/launchLibrary'
import type { Rocket } from '@/types/rocket'

type Status = 'idle' | 'loading' | 'success' | 'error'

let nextCustomId = -1

export const useRocketsStore = defineStore('rockets', {
  state: () => ({
    rockets: [] as Rocket[],
    status: 'idle' as Status,
    errorMessage: '',
    detailStatus: 'idle' as Status,
    detailErrorMessage: '',
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

    async fetchRocketDetail (id: number) {
      if (id < 0) {
        this.detailStatus = 'success'
        return
      }

      this.detailStatus = 'loading'
      this.detailErrorMessage = ''

      try {
        const rocket = await fetchRocketById(id)
        const index = this.rockets.findIndex(item => item.id === id)
        if (index === -1) {
          this.rockets.push(rocket)
        } else {
          this.rockets[index] = rocket
        }
        this.detailStatus = 'success'
      } catch (error) {
        this.detailStatus = 'error'
        this.detailErrorMessage = error instanceof Error ? error.message : 'Something went wrong'
      }
    },

    addRocket (rocket: Omit<Rocket, 'id'>) {
      this.rockets.unshift({ ...rocket, id: nextCustomId-- })
    },
  },
})