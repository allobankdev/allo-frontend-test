import { isAxiosError } from 'axios'
import { defineStore } from 'pinia'

import api from '@/services/api'

export interface Rocket {
  id: string
  name: string
  description: string
  flickr_images: string[]
  cost_per_launch: number
  country: string
  first_flight: string
}

const getRequestErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (isAxiosError(error) && error.response?.status === 404) {
    return 'Rocket not found.'
  }

  return fallbackMessage
}

export const useRocketStore = defineStore('rocket', {
  state: () => ({
    rockets: [] as Rocket[],
    rocket: null as Rocket | null,
    loading: false,
    error: null as string | null,
    filterQuery: '',
  }),
  getters: {
    filteredRockets: state => {
      const query = state.filterQuery.trim().toLowerCase()

      if (!query) {
        return state.rockets
      }

      return state.rockets.filter(rocket => {
        return [
          rocket.name,
          rocket.description,
          rocket.country,
        ].some(value => value.toLowerCase().includes(query))
      })
    },
  },
  actions: {
    async fetchRockets () {
      this.loading = true
      this.error = null

      try {
        const response = await api.get<Rocket[]>('/rockets')
        this.rockets = response.data
      } catch (error: unknown) {
        this.error = getRequestErrorMessage(error, 'Failed to fetch rockets. Please try again.')
      } finally {
        this.loading = false
      }
    },
    async fetchRocket (id: string) {
      this.loading = true
      this.error = null
      this.rocket = null

      const localRocket = this.rockets.find(rocket => rocket.id === id)

      if (localRocket) {
        this.rocket = localRocket
        this.loading = false
        return
      }

      try {
        const response = await api.get<Rocket>(`/rockets/${id}`)
        this.rocket = response.data
      } catch (error: unknown) {
        this.error = getRequestErrorMessage(error, 'Failed to fetch rocket details. Please try again.')
      } finally {
        this.loading = false
      }
    },
    addRocket (newRocket: Rocket) {
      this.rockets = [newRocket, ...this.rockets]
    },
    setFilter (query: string) {
      this.filterQuery = query
    },
  },
})
