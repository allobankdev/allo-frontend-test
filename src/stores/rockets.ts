import { defineStore } from 'pinia'

export type FetchStatus = 'idle' | 'loading' | 'success' | 'error'

export interface Rocket {
  id: string
  name: string
  description: string
  flickr_images: string[]
  cost_per_launch: number
  country: string
  first_flight: string
  // Mark custom rockets created from UI (not from SpaceX API)
  isCustom?: boolean
}

export interface NewRocketPayload {
  name: string
  description: string
  image: string
  cost_per_launch: number
  country: string
  first_flight: string
}

interface State {
  rockets: Rocket[]
  status: FetchStatus
  errorMessage: string | null
  filterText: string
  countryFilter: string // 'all' or country name
}

export const useRocketStore = defineStore('rockets', {
  state: (): State => ({
    rockets: [],
    status: 'idle',
    errorMessage: null,
    filterText: '',
    countryFilter: 'all',
  }),

  getters: {
    countries: (state): string[] => {
      const set = new Set<string>()
      state.rockets.forEach((r) => {
        if (r.country) set.add(r.country)
      })
      return Array.from(set).sort()
    },

    filteredRockets: (state): Rocket[] => {
      let items = [...state.rockets]

      const text = state.filterText.trim().toLowerCase()
      if (text) {
        items = items.filter((rocket) => {
          return (
            rocket.name.toLowerCase().includes(text) ||
            rocket.description.toLowerCase().includes(text)
          )
        })
      }

      if (state.countryFilter !== 'all') {
        items = items.filter((rocket) => rocket.country === state.countryFilter)
      }

      return items
    },

    getById: (state) => {
      return (id: string): Rocket | undefined =>
        state.rockets.find((r) => r.id === id)
    },
  },

  actions: {
    setFilterText (text: string) {
      this.filterText = text
    },

    setCountryFilter (country: string) {
      this.countryFilter = country || 'all'
    },

    resetFilters () {
      this.filterText = ''
      this.countryFilter = 'all'
    },

    async fetchRockets () {
      if (this.status === 'loading') return

      this.status = 'loading'
      this.errorMessage = null

      try {
        const response = await fetch('https://api.spacexdata.com/v4/rockets')

        if (!response.ok) {
          throw new Error(`Failed to fetch rockets: ${response.status}`)
        }

        const data = await response.json()

        // Map ke tipe Rocket kita
        this.rockets = (data as any[]).map((item) => ({
          id: String(item.id),
          name: String(item.name),
          description: String(item.description ?? ''),
          flickr_images: Array.isArray(item.flickr_images) ? item.flickr_images : [],
          cost_per_launch: Number(item.cost_per_launch ?? 0),
          country: String(item.country ?? ''),
          first_flight: String(item.first_flight ?? ''),
        }))

        this.status = 'success'
      } catch (err: any) {
        console.error(err)
        this.status = 'error'
        this.errorMessage =
          err?.message ?? 'Unexpected error while fetching rockets.'
      }
    },

    addRocket (payload: NewRocketPayload) {
      const id =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`

      const newRocket: Rocket = {
        id,
        name: payload.name,
        description: payload.description,
        flickr_images: payload.image ? [payload.image] : [],
        cost_per_launch: payload.cost_per_launch,
        country: payload.country,
        first_flight: payload.first_flight,
        isCustom: true,
      }

      this.rockets.unshift(newRocket)
    },
  },
})
