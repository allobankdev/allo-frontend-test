import { defineStore } from 'pinia'

export interface Rocket {
  id: string
  name: string
  description: string
  flickr_images: string[]
  cost_per_launch: number
  country: string
  first_flight: string
}

export interface RocketFilters {
  search: string
  country: string
}

export interface CreateRocketForm {
  name: string
  description: string
  imageUrl: string
  costPerLaunch: number
  country: string
  firstFlight: string
}

const ROCKET_ENDPOINT = 'https://api.spacexdata.com/v4/rockets'

const toApiPayload = (form: CreateRocketForm) => ({
  name: form.name,
  type: 'rocket',
  cost_per_launch: form.costPerLaunch,
  first_flight: form.firstFlight,
  country: form.country,
  description: form.description,
  flickr_images: form.imageUrl ? [form.imageUrl] : [],
})

export const useRocketStore = defineStore('rocket-store', {
  state: () => ({
    rockets: [] as Rocket[],
    listLoading: false,
    listError: '' as string | null,
    filters: {
      search: '',
      country: 'all',
    } as RocketFilters,
    createLoading: false,
    createError: '' as string | null,
    createdRocket: null as Rocket | null,
  }),
  getters: {
    filteredRockets: (state) => {
      const query = state.filters.search.trim().toLowerCase()
      return state.rockets.filter((rocket) => {
        const matchesQuery = rocket.name.toLowerCase().includes(query)
        const matchesCountry = state.filters.country === 'all' || rocket.country === state.filters.country
        return matchesQuery && matchesCountry
      })
    },
    availableCountries: (state) => {
      const unique = new Set<string>()
      state.rockets.forEach((rocket) => {
        if (rocket.country) {
          unique.add(rocket.country)
        }
      })
      return Array.from(unique).sort()
    },
  },
  actions: {
    async fetchRockets() {
      this.listLoading = true
      this.listError = null
      try {
        const response = await fetch(ROCKET_ENDPOINT)
        if (!response.ok) {
          throw new Error('Unable to load rockets. Please try again.')
        }
        const data = (await response.json()) as Rocket[]
        this.rockets = data
      } catch (error) {
        this.listError = error instanceof Error ? error.message : 'Something went wrong.'
        throw error
      } finally {
        this.listLoading = false
      }
    },
    async createRocket(form: CreateRocketForm) {
      this.createLoading = true
      this.createError = null
      try {
        const response = await fetch(ROCKET_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(toApiPayload(form)),
        })
        if (!response.ok) {
          throw new Error('Unable to add rocket right now.')
        }
        const data = (await response.json()) as Rocket
        this.createdRocket = data
        this.rockets = [data, ...this.rockets]
      } catch (error) {
        this.createError = error instanceof Error ? error.message : 'Failed to create rocket.'
        throw error
      } finally {
        this.createLoading = false
      }
    },
    clearCreateFeedback() {
      this.createError = null
      this.createdRocket = null
    },
  },
})

