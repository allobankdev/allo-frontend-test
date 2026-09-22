import { defineStore } from 'pinia'
import { fetchRockets, RocketApiError } from '@/services/rocketApi'
import type { Rocket } from '@/types/rocket'

export type FetchStatus = 'idle' | 'loading' | 'success' | 'error'

export interface NewRocketInput {
  fullName: string
  description: string
  imageUrl: string
  launchCost: string
  countryCode: string
  maidenFlight: string
}

interface RocketState {
  rockets: Rocket[]
  status: FetchStatus
  errorMessage: string | null
  searchQuery: string
}

export const useRocketStore = defineStore('rockets', {
  state: (): RocketState => ({
    rockets: [],
    status: 'idle',
    errorMessage: null,
    searchQuery: '',
  }),

  getters: {
    filteredRockets (state): Rocket[] {
      const query = state.searchQuery.trim().toLowerCase()
      if (!query) return state.rockets
      return state.rockets.filter(rocket => {
        return (
          rocket.fullName.toLowerCase().includes(query) ||
          rocket.name.toLowerCase().includes(query) ||
          (rocket.countryCode ?? '').toLowerCase().includes(query)
        )
      })
    },
    getById: state => {
      return (id: string): Rocket | undefined =>
        state.rockets.find(rocket => String(rocket.id) === id)
    },
  },

  actions: {
    /** Loads the rocket list. Safe to call repeatedly — skips refetching a list already in memory. */
    async loadRockets (force = false) {
      if (this.status === 'loading') return
      if (this.status === 'success' && !force) return

      this.status = 'loading'
      this.errorMessage = null
      try {
        const apiRockets = await fetchRockets()
        const localRockets = this.rockets.filter(rocket => rocket.isLocal)
        this.rockets = [...localRockets, ...apiRockets]
        this.status = 'success'
      } catch (error) {
        this.status = 'error'
        this.errorMessage =
          error instanceof RocketApiError ? error.message : 'Something went wrong loading rockets.'
      }
    },

    setSearchQuery (query: string) {
      this.searchQuery = query
    },

    addRocket (input: NewRocketInput) {
      const rocket: Rocket = {
        id: `local-${Date.now()}`,
        name: input.fullName.trim(),
        fullName: input.fullName.trim(),
        description: input.description.trim() || null,
        imageUrl: input.imageUrl.trim() || null,
        launchCost: input.launchCost.trim() ? Number(input.launchCost) : null,
        countryCode: input.countryCode.trim() || null,
        maidenFlight: input.maidenFlight.trim() || null,
        isLocal: true,
      }
      this.rockets.unshift(rocket)
      return rocket
    },
  },
})
